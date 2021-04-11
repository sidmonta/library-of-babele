import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Quad } from 'n3';
/**
 * Tipo di ritorno di una richiesta fetch
 */
export interface FetchResponse {
    response: AxiosResponse;
    body: any;
    params: any;
}
/**
 * Trasforma uno stream di dati in un Observable
 * @param stream streaming da convertire
 * @param finishEventName nome del metodo dello stream per segnalare la fine dello stream. Di default 'end'
 * @param dataEventName nome del metodo dello stream per l'arrivo di nuovi dati. Di default 'data'
 * @returns {Observable<any>} Observable dello stream
 */
export declare function fromStream(stream: any, finishEventName?: string, dataEventName?: string): Observable<any>;
/**
 * Effettua una chiamata fetch con axios il cui risultato è trasformato in stream
 * @param url Configurazione per eseguire la chiamata con axios
 * @param params configurazione aggiuntiva che viene appesa alla risposta.
 */
export declare function fetchContent({ url, params }: {
    url: AxiosRequestConfig;
    params?: unknown;
}): Observable<FetchResponse>;
/**
 * Esegue una chiamata fetch. Specifico per gli endpoint SPARQL, restituisce un RDF
 * @param {string} url uri del record da cui ottenere l'RDF
 * @returns {Observable<Quad>} Observable di quad
 */
export declare function fetchSPARQL(url: string): Observable<Quad>;
/**
 * Implementa un operatore per Rxjs che esegue un filtro asyncrono sui dati che arrivano dallo stream
 * @param predicate funzione che funge da predicato per la valutazione del dato
 */
export declare function asyncFilter<T>(predicate: (value: T, index: number) => Promise<boolean>): MonoTypeOperatorFunction<T>;
/**
 * Operatore Rxjs che ritorna solo gli endpoint che sono accessibili
 */
export declare const filterByPing: () => MonoTypeOperatorFunction<string>;
export declare type LODDocument = {
    content: string;
    metadata: Record<string, string>;
    [key: string]: unknown;
};
/**
 * Metodo che a partire da un URI definisce un LODDocument
 * @param uri della risorsa da formattare
 */
export declare const formatDocument: (uri: string) => Observable<LODDocument>;
