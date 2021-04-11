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
export declare const match: <T, E>(x: T) => {
    on: (cond: (x: T) => boolean, fn: (x: T) => E) => any;
    otherwise: (fn: (x: T) => E) => E;
};
/**
 * Una funzione che torna sempre TRUE indipendentemente dai parametri passati
 */
export declare const alwaysTrue: (..._: unknown[]) => boolean;
/**
 * Rimuove un determinato carattere all'inizio o alla fine di una stringa
 */
export declare const trimCh: (ch: string) => (x: string) => string;
/**
 * Controlla se una stringa è un URL valido
 * @param {string} str stringa da controllare
 * @returns {boolean} se è un URL valido
 */
export declare const validURL: (str: string) => boolean;
/**
 * Definisce un array che non può essere vuoto
 */
export declare type NonEmptyArray<T> = [T, ...T[]];
/**
 * Genera un colore univoco a partire da una stringa di testo.
 * @param s stringa da cui generare un colore
 * @return colore esadecimale
 */
export declare const generateColorFromString: (s: string) => string;
/**
 * Tools contiene anche tutti gli strumenti per la gestione dei WebSocket
 */
export * from './WebSocketClient';
/**
 * Funzione per eseguire un ping ad un endpoint qualunque.
 * Utile per sapere se la risorsa web richiesta è accessibile
 * @param endpoint endpoint da controllarne la reperibilità
 */
export declare const pingEndpoint: (endpoint: string) => Promise<boolean>;
