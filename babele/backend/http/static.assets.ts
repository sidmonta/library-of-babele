import { r } from '@marblejs/core'
import { map, mergeMap, switchMap } from 'rxjs/operators'
import { readFile } from '@marblejs/core/dist/+internal/files'
import { resolve } from 'path'
import { Observable, of, zip } from 'rxjs'
import { contentType } from 'mime-types'
import { extname } from 'path'
import { pipe } from 'fp-ts/lib/pipeable'

// path al client
const STATIC_PATH = process.env.REACT_APP_STATIC_PATH || resolve(__dirname, '../..', 'client/build')

/**
 * Recupera il content type del file passato come parametro
 * @param filename
 */
const extractContentType: (filename: string) => string = (filename) =>
  pipe(extname(filename), (f) => contentType(f) || 'text/html')

/**
 * Recupera i dati della richiesta ai file statici
 */
const getStaticAssetPath = map((req) => {
  // @ts-ignore
  return req?.params?.dir && req.params.dir !== 'undefined' ? req.params.dir : 'index.html'
})

/**
 * Recupera il file richiesto dalla richiesta server.
 * @param path Path del file richiesto dalla richiesta server
 */
const getStaticAssetBuffer$ = (path: string) =>
  of(path).pipe(
    mergeMap(readFile(STATIC_PATH)),
    map((buffer) => buffer.toString('utf8'))
  )
// Stream per la generazione del content type del file
const getStaticAssetContentType$ = (path: string) => of(path).pipe(map(extractContentType))

/**
 * Format info for asset
 * @param path indirizzo della risorsa richiesta
 */
const staticAssetInfo$ = (path: string): Observable<[string, string]> => {
  return zip(getStaticAssetBuffer$(path), getStaticAssetContentType$(path))
}

/**
 * API per il reperimento dei file statici
 */
export const static$ = r.pipe(
  r.matchPath('/:dir*'),
  r.matchType('GET'),
  r.useEffect((req$) =>
    req$.pipe(
      getStaticAssetPath,
      switchMap(staticAssetInfo$),
      map(([body, contentType]) => ({
        body,
        headers: { 'Content-Type': contentType },
      }))
    )
  )
)
