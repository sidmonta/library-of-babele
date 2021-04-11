import { r, combineRoutes, HttpRequest, EffectContext, HttpServer } from '@marblejs/core'
import { map, mapTo } from 'rxjs/operators'
import { getCategory, getDeweyElement, getDeweyLabel } from '../database/database.methods'
import { Observable, OperatorFunction } from 'rxjs'

// Alias per funzioni di utilità
const formatOutput = (body: unknown) => ({ body })
const mapOutput = map(formatOutput)

// @ts-ignore
const extractIdFromReqParam: OperatorFunction<unknown, string> = map((req) => req?.params?.id)

/**
 * Definisce la root base per le API.
 *
 * Non fa altro che ritornare un messaggio
 */
const base$ = r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.useEffect((req$) => req$.pipe(mapTo({ body: 'API active' })))
)

/**
 * API che ritorna l'elenco delle categorie Dewey radice
 */
const init$ = r.pipe(
  r.matchPath('/init'),
  r.matchType('GET'),
  r.useEffect((req$, ctx) => {
    return req$.pipe(
      map(() => ''),
      getCategory(ctx),
      mapOutput
    )
  })
)

/**
 * API che ritorna le dewey figle di una dewey passata come parametro
 */
const children$ = r.pipe(
  r.matchPath('/children/:id'),
  r.matchType('GET'),
  r.useEffect((req$: Observable<HttpRequest>, ctx: EffectContext<HttpServer>) => {
    return req$.pipe(extractIdFromReqParam, getCategory(ctx), mapOutput)
  })
)

/**
 * API che ritorna le informazioni di una dewey specificata
 */
const getDewey$ = r.pipe(
  r.matchPath('/get-dewey/:id'),
  r.matchType('GET'),
  r.useEffect((req$: Observable<HttpRequest>, ctx: EffectContext<HttpServer>) => {
    return req$.pipe(extractIdFromReqParam, getDeweyElement(ctx), mapOutput)
  })
)

/**
 * API che ritorna la label di una dewey speficificata
 */
const getDeweyLabel$ = r.pipe(
  r.matchPath('/get-dewey/:id/label'),
  r.matchType('GET'),
  r.useEffect((req$: Observable<HttpRequest>, ctx: EffectContext<HttpServer>) => {
    return req$.pipe(extractIdFromReqParam, getDeweyLabel(ctx), mapOutput)
  })
)

/**
 * Combino tutte le API definite sopra sotto il path {{host}}/api/{{API}}
 */
export const api$ = combineRoutes('/api', [base$, init$, children$, getDeweyLabel$, getDewey$])
