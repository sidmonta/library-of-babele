import { WsEffect } from '@marblejs/websockets'
import { act, Event, matchEvent } from '@marblejs/core'
import { map } from 'rxjs/operators'
import { pipe } from 'fp-ts/lib/pipeable'
import { reply } from '@marblejs/messaging'
import { Observable, of } from 'rxjs'
import { redisClient } from '../cache/redis.context'
import { Type, WSBookDataIn, WSBookDataOut } from './EffectTypes'
import { getBookListFromCache, searchFromCache, getBookData } from './stream.response'

// Passa la cache ai vari servizi
const getBookList = getBookListFromCache(redisClient)
const search = searchFromCache(redisClient)
const getBkData = getBookData(redisClient)

/**
 * Funzione per la generazione di un effetto per il WebServer
 * @param eventType Tipologia di evento per la quale l'effetto risponderà
 * @param method metodo da usare per la generazione del payload per la risposta
 */
const EffectGenerator = <A>(eventType: Type, method: (event: Event) => Observable<A>): WsEffect => (
  event$: Observable<Event>
) => {
  return event$.pipe(
    matchEvent(eventType), // matcha l'evento da gestire
    act((event: Event) => {
      return pipe(
        method(event), // funzione per la generazione del payload della risposta
        map((payload) =>
          reply(event)({
            type: eventType,
            payload,
          })
        )
      )
    })
  )
}

/**
 * Effetto per la gestione della richiesta della lista di libri
 */
export const bookList$ = EffectGenerator(Type.BOOKLIST, getBookList)

export const bookData$ = (event$: Observable<Event>) => {
  return event$.pipe(
    matchEvent(Type.BOOKDATA),
    act((event: WSBookDataIn) => {
      return pipe(
        getBkData(event),
        map((eventOutData: WSBookDataOut) =>
          reply(event)({
            type: eventOutData.type,
            payload: eventOutData.payload,
          })
        )
      )
    })
  )
}

/**
 * Effetto per la gestione della richiesta di reperimento di una label di una
 * risorsa
 */
export const label$ = EffectGenerator(Type.LABEL, of)

/**
 * Effetto per le richieste di ricerca di una stringa per più endpoint
 */
export const search$ = EffectGenerator(Type.BOOKSEARCH, search)
