import {
  Type,
  WSBookData,
  WSBookDataIn,
  WSBookDataService,
  WSBookList,
  WSBookSearch,
  WSNewBookClassified,
} from './EffectTypes'
import { fromPromise } from 'rxjs/internal-compatibility'
import { distinct, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators'
import { from, Observable, throwError } from 'rxjs'
import Crawler from '@sidmonta/babelecrawler'
import classify from '@sidmonta/classifier/lib/stream'
import { allitem, smembers } from '../cache/redis.wrapper'
import { CACHE_KEY_ENDPOINT_LIST, callEndpoint } from '../search/endpoint-list'
import * as N3 from 'n3'
import { filterByPing, formatDocument, LODDocument } from '@sidmonta/babelelibrary/build/stream'
import { ClassifierAlgorithms } from '@sidmonta/classifier/lib/ClassifierFactory'
// import { logger } from '@marblejs/core'

type Quad = N3.Quad
// Inizializzazione del classificatore
const classy = classify<LODDocument>({
  algorithm: process.env.CLASSIFY_ALGO as ClassifierAlgorithms,
  dbPath: process.env.DATABASE_PATH,
  featureFun: 'featureWthMetadata',
})

/**
 * Recupera la lista di libri associati ad un particolare dewey
 * @param cache
 */
export function getBookListFromCache(cache) {
  return ({ payload }: WSBookList) => {
    const dewey = payload.id + (payload.id.length === 1 ? '00' : '')
    try {
      return fromPromise(smembers(cache)(dewey)).pipe(mergeMap((list: string[]) => from(list)))
    } catch (err) {
      console.log(dewey, err)
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
      return endpoints$.pipe(switchMap(from), mergeMap(call), distinct(), filterByPing())
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
      crawler.run(uri)

      const generateType = (t) => `${t}_${uri}`

      // Stream of book info
      const bookData$: Observable<WSBookData> = crawler
        .getNewNodeStream()
        .pipe(map((quad: Quad) => ({ type: generateType(Type.BOOKDATA), payload: { quad } })))

      // Stream of service where info from
      const bookService$: Observable<WSBookDataService> = crawler
        .getNewSourceStream()
        .pipe(map((service: string) => ({ type: generateType(Type.BOOKDATASERVICE), payload: { service } })))

      // Stream of new book classified
      const newBookClassified$: Observable<WSNewBookClassified> = crawler.getNewNodeStream().pipe(
        filter((quad: Quad) => quad.object.termType === 'NamedNode'),
        map((quad: Quad) => quad.object.value),
        distinct(),
        mergeMap(formatDocument),
        filter((document: LODDocument) => document.content !== '' || Object.keys(document.metadata).length > 0),
        mergeMap((document: LODDocument) => classy(document.uri as string, document)),
        tap(([bookUri, dewey]: [string, string]) => {
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

      // Merge of all different type of response
      // return merge(bookData$, bookService$, newBookClassified$)
      return [bookData$, bookService$, newBookClassified$]
    }
    return throwError(new Error('No URI found for crawling'))
  }
}
