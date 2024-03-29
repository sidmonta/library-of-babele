import {pipe, replace} from 'ramda'
import * as http from 'http'
import * as https from 'https'

/**
 * @private
 * Oggetto restituito dal metodo match, finche non si esegue l'otherwise
 * @param x qualunque valore restituito dalla funzione `fn`
 */
const matched = <E>(x: E) => ({
  on: () => matched(x),
  otherwise: () => x
})

/**
 * Una versione funzionale dello switch case
 *
 * @example
 * const result = match(val)
 *                  .on((value) => value < 10, (value) => value + 10)
 *                  .on((value) => value < 20, (value) => value + 20)
 *                  .otherwise((value) => value + 50)
 * // val = 5
 * console.log(result) // => 15
 * // val = 14
 * console.log(result) // => 34
 * // val = 3003
 * console.log(result) // => 3053
 *
 * @param x valore che verrà matchato
 * @return un oggetto che supporta due funzioni:
 *
 *          1. `on(cond, fn)` dove cond è una funziona che controlla x,
 *              mentre fn è la funzione che deve essere eseguita se cond
 *              è soddisfatta
 *          2. `otherwise(fn)` dove fn è la funzione da eseguire se nessun
 *              controllo precedente è stato soddisfatto
 */
export const match = <T, E>(x: T) => ({
  on: (cond: (x: T) => boolean, fn: (x: T) => E) =>
    cond(x) ? matched(fn(x)) : match(x),
  otherwise: (fn: (x: T) => E) => fn(x)
})

/**
 * Una funzione che torna sempre TRUE indipendentemente dai parametri passati
 */
export const alwaysTrue = (..._: unknown[]): boolean => true

/**
 * Rimuove un determinato carattere all'inizio o alla fine di una stringa
 */
export const trimCh = (ch: string) => (x: string): string =>
  x.replace(new RegExp(`^${ch}+|${ch}+$`, 'g'), '')

/**
 * Controlla se una stringa è un URL valido
 * @param {string} str stringa da controllare
 * @returns {boolean} se è un URL valido
 */
export const validURL = (str: string): boolean => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return pattern.test(str)
}

/**
 * Definisce un array che non può essere vuoto
 */
export type NonEmptyArray<T> = [T, ...T[]]

/**
 * Genera un colore univoco a partire da una stringa di testo.
 * @param s stringa da cui generare un colore
 * @return colore esadecimale
 */
export const generateColorFromString: (s: string) => string = (s: string) => {
  const hashCode = (s: string): number => s
    .split('')
    .reduce((hash: number, char: string) => hash + char.charCodeAt(0) + ((hash << 5) - hash), 0)
  const intToRGB = (int: number): string => {
    let c = (int & 0x00FFFFFF).toString(16).toUpperCase()
    return '#' + "00000".substring(0, 6 - c.length) + c;
  }

  return pipe(hashCode, intToRGB)(s)
}

/**
 * Tools contiene anche tutti gli strumenti per la gestione dei WebSocket
 */
export * from './WebSocketClient'

/**
 * Funzione per eseguire un ping ad un endpoint qualunque.
 * Utile per sapere se la risorsa web richiesta è accessibile
 * @param endpoint endpoint da controllarne la reperibilità
 */
export const pingEndpoint = async (endpoint: string): Promise<boolean> => {
  const { request } = endpoint.startsWith('https') ? https : http

  return new Promise((resolve: (value: boolean) => void): void => {
    try {
      const req = request(endpoint, { method: 'HEAD', timeout: 800 }, function (r) {
        resolve(r.statusCode ? r.statusCode < 400 : false)
      })
      req.setTimeout(1000, () => req.abort())
      req.end()
      req.on('error', function (err) {
        console.error('Error on ping ' + endpoint, err)
        resolve(false)
      })
    } catch (err) {
      console.error('Error on ping ' + endpoint, err)
      resolve(false)
    }
  })
}

/**
 * Funzione che trasforma una stringa in un uri con i + al posto degli spazi
 * @param uri stringa da modificare
 */
export const customEncodeUri = (uri: string): string => {
  return replace(/\s+/g, '+', uri)
}

/**
 * Funzione che trasforma un uri a cui si sono sostituiti gli spazi con i +, di nuovo nella stringa con gli spazi
 * @param encodedUri uri con + al posto degli spazi
 */
export const customDecodeUri = (encodedUri: string): string => {
  return replace(/\+/g, ' ', encodedUri)
}
