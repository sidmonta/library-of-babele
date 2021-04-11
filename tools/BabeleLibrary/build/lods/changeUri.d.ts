/**
 * Alias URI
 */
declare type URI = string;
declare type ChangeFn = (uri: URI) => URI;
/**
 * Tipologia che definisce come deve essere una funzione per la modifica dell'URI
 */
export declare type control = (is?: string, change?: ChangeFn) => string | control;
/**
 * Funzione di utilità che wrappa i passaggi per la variazione dell'URI
 * @param is valore che l'uri deve contenere per poter essere modificato
 * @param change Funzione che modifica l'URI
 */
export declare const createCheck: (is: string, change: ChangeFn) => ChangeFn;
export declare const checkWikidata: ChangeFn;
export declare const checkViaf: ChangeFn;
export declare const checkOpenLibrary: ChangeFn;
export declare const allCheck: (x: string) => string;
/**
 * Funzione che permette l'aggregazione di più metodi di modifica dell'uri o l'esecuzione vera e propria
 */
export declare const changeUri: control;
export {};
