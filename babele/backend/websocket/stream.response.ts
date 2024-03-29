import {
  Type,
  WSBookData,
  WSBookDataIn,
  WSBookDataService,
  WSBookList, WSBookListOut,
  WSBookSearch,
  WSNewBookClassified,
} from './EffectTypes'
import { fromPromise } from 'rxjs/internal-compatibility'
import {
  concatMap,
  distinct, distinctUntilChanged,
  filter,
  map,
  mergeAll,
  mergeMap, skip,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators'
import { merge, Observable, of, throwError, timer, from, scheduled, asyncScheduler } from 'rxjs'
import Crawler from '@sidmonta/babelecrawler'
import classify from '@sidmonta/classifier/lib/fp'
import { featureWthMetadata } from '@sidmonta/classifier/lib/Features'
import { allitem, pagination } from '../cache/redis.wrapper'
import { CACHE_KEY_ENDPOINT_LIST, callEndpoint } from '../search/endpoint-list'
import * as N3 from 'n3'
import { formatDocument, LODDocument } from '@sidmonta/babelelibrary/build/stream'
import { ClassifierAlgorithms } from '@sidmonta/classifier/lib/ClassifierFactory'

type Quad = N3.Quad
// Inizializzazione del classificatore
const classy = classify<LODDocument>({
  algorithm: process.env.CLASSIFY_ALGO as ClassifierAlgorithms,
  dbPath: process.env.DATABASE_PATH,
  featureFun: featureWthMetadata,
})

/**
 * Recupera la lista di libri associati ad un particolare dewey
 * @param cache
 */
export function getBookListFromCache(cache) {
  const fetchFromCache = pagination(cache)

  return ({ payload }: WSBookList) => {
    const dewey = payload.id + (payload.id.length === 1 ? '00' : '')
    const page = payload.page || 0

    try {
      return fetchFromCache(dewey, page, 10).pipe(map((output): WSBookListOut =>
        ({ type: Type.BOOKLIST + '_' + payload.id, payload: { book: output.value, totItems: output.totItems } })
      ))
    } catch (err) {
      return throwError(err)
    }
  }
}

/**
 * Effettua la ricerca su tutti gli endpoint disponibili
 * @param cache
 */
export function searchFromCache(cache) {
  return ({ payload }: WSBookSearch) => {
    const call = callEndpoint(payload.query)
    try {
      const endpoints$ = fromPromise(allitem(cache)(CACHE_KEY_ENDPOINT_LIST)) as Observable<string>
      return endpoints$.pipe(switchMap(from), mergeMap(call), distinct(), skip((payload?.page || 0) * 50), take(50))
    } catch (err) {
      console.error(err)
      return throwError(err)
    }
  }
}

/**
 * Effettua l'analisi di una risorsa LOD
 * @param cache
 */
export function getBookData(cache) {
  return ({ payload }: WSBookDataIn) => {
    if (payload.uri) {
      const uri: string = payload.uri
      const crawler = new Crawler()

      const generateType = (t) => `${t}_${uri}`

      // Stream of book info
      const bookData$: Observable<WSBookData> = crawler
        .getNewNodeStream()
        .pipe(
          distinctUntilChanged((a, b) => a.object.value === b.object.value),
          map((quad: Quad) =>
            ({ type: generateType(Type.BOOKDATA), payload: { quad } })
          )
        )

      // Stream of service where info from
      const bookService$: Observable<WSBookDataService> = crawler
        .getNewSourceStream()
        .pipe(map((service: string) => ({ type: generateType(Type.BOOKDATASERVICE), payload: { service } })), take(50))

      let firstService = {}
      bookService$.subscribe(service => {
        firstService = service
      })

      // Stream of new book classified
      const newBookClassified$: Observable<WSNewBookClassified> = crawler.getNewNodeStream().pipe(
        filter((quad: Quad) => quad.object.termType === 'NamedNode'),
        map((quad: Quad) => quad.object.value),
        distinct(),
        mergeMap(formatDocument),
        filter((document: LODDocument) => document.content !== '' || Object.keys(document.metadata).length > 0),
        mergeMap((document: LODDocument) => fromPromise(Promise.all([Promise.resolve(document.uri as string), classy(document)]))),
        tap(([bookUri, dewey]: [string, string]) => {
          console.log('new book', bookUri, dewey)
          // Save on cache for future request
          cache.sadd(dewey, bookUri)
        }),
        map(([bookUri, dewey]: [string, string]) => {
          return {
            type: Type.NEWBOOK,
            payload: {
              bookUri,
              dewey,
            },
          }
        })
      )

      crawler.run(uri)

      // Merge of all different type of response
      // return merge(of(firstService), bookService$, bookData$, newBookClassified$)
      return scheduled([of(firstService), bookService$, bookData$, newBookClassified$], asyncScheduler).pipe(mergeAll())
      // return [bookData$, bookService$, newBookClassified$]
    }
    return throwError(new Error('No URI found for crawling'))
  }
}
