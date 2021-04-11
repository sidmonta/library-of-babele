"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDocument = exports.filterByPing = exports.asyncFilter = exports.fetchSPARQL = exports.fetchContent = exports.fromStream = void 0;
require("rxjs/ajax");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const ramda_1 = require("ramda");
const axios_1 = __importDefault(require("axios"));
const QuadFactory_1 = __importDefault(require("../lods/QuadFactory"));
const changeUri_1 = require("../lods/changeUri");
const n3_1 = require("n3");
const tools_1 = require("../tools");
const lods_1 = require("../lods");
/**
 * Trasforma uno stream di dati in un Observable
 * @param stream streaming da convertire
 * @param finishEventName nome del metodo dello stream per segnalare la fine dello stream. Di default 'end'
 * @param dataEventName nome del metodo dello stream per l'arrivo di nuovi dati. Di default 'data'
 * @returns {Observable<any>} Observable dello stream
 */
function fromStream(stream, finishEventName = 'end', dataEventName = 'data') {
    stream.pause();
    return new rxjs_1.Observable(observer => {
        function dataHandler(data) {
            observer.next(data);
        }
        function errorHandler(err) {
            observer.error(err);
        }
        function endHandler() {
            observer.complete();
        }
        stream.addListener(dataEventName, dataHandler);
        stream.addListener('error', errorHandler);
        stream.addListener(finishEventName, endHandler);
        stream.resume();
        return () => {
            stream.removeListener(dataEventName, dataHandler);
            stream.removeListener('error', errorHandler);
            stream.removeListener(finishEventName, endHandler);
        };
    });
}
exports.fromStream = fromStream;
/**
 * Effettua una chiamata fetch con axios il cui risultato è trasformato in stream
 * @param url Configurazione per eseguire la chiamata con axios
 * @param params configurazione aggiuntiva che viene appesa alla risposta.
 */
function fetchContent({ url, params }) {
    return new rxjs_1.Observable((observer) => {
        axios_1.default(url)
            .then((response) => {
            observer.next({
                response: response, body: response.data, params
            });
            observer.complete();
        })
            .catch(err => { observer.error(err); });
    });
}
exports.fetchContent = fetchContent;
/**
 * Verifica se il ContentType di una risposta sia in formato xml/rdf
 * @param data Risposta di una chiamata fetch
 */
const checkContentType = (data) => Boolean(ramda_1.hasPath(['response', 'headers', 'content-type'], data) &&
    (data.response.headers['content-type'].includes('xml') ||
        data.response.headers['content-type'].includes('rdf')));
/**
 * Esegue una chiamata fetch. Specifico per gli endpoint SPARQL, restituisce un RDF
 * @param {string} url uri del record da cui ottenere l'RDF
 * @returns {Observable<Quad>} Observable di quad
 */
function fetchSPARQL(url) {
    return fetchContent({
        url: {
            url: changeUri_1.allCheck(url),
            method: 'GET',
            headers: {
                Accept: 'application/rdf+xml'
            }
        }
    }).pipe(operators_1.filter(checkContentType), // Filtra solo la chiamata con il corretto ContentType
    operators_1.map(ramda_1.path(['body'])), // Estrapola il body della risposta
    operators_1.switchMap((data) => QuadFactory_1.default.generateFromString(data, true) // Genera le triple a partire dalla risposta
    ), 
    // Se c'è un errore genera una tripla vuota
    operators_1.catchError((_) => rxjs_1.of(n3_1.DataFactory.quad(n3_1.DataFactory.blankNode(), n3_1.DataFactory.variable(''), n3_1.DataFactory.literal('')))));
}
exports.fetchSPARQL = fetchSPARQL;
/**
 * Implementa un operatore per Rxjs che esegue un filtro asyncrono sui dati che arrivano dallo stream
 * @param predicate funzione che funge da predicato per la valutazione del dato
 */
function asyncFilter(predicate) {
    let inx = 0;
    return rxjs_1.pipe(operators_1.concatMap((data) => rxjs_1.from(predicate(data, inx++)).pipe(operators_1.map((valid) => ({ valid, data })))), operators_1.filter(({ valid }) => valid), operators_1.map(({ data }) => data));
}
exports.asyncFilter = asyncFilter;
/**
 * Operatore Rxjs che ritorna solo gli endpoint che sono accessibili
 */
const filterByPing = () => asyncFilter(tools_1.pingEndpoint);
exports.filterByPing = filterByPing;
/**
 * Metodo che a partire da un URI definisce un LODDocument
 * @param uri della risorsa da formattare
 */
const formatDocument = (uri) => {
    const seek = {
        content: '',
        metadata: {},
        uri
    };
    // Determina se una tripla fa parte del contenuto del documento o meno
    const isContent = (predicate) => ['comment', 'content', 'description'].some(pk => ramda_1.includes(pk, predicate));
    // Recupera le triple della risorsa
    return fetchSPARQL(uri).pipe(operators_1.reduce((document, quad) => {
        const predicate = quad.predicate.value;
        if (isContent(predicate)) {
            document.content = document.content + quad.object.value;
        }
        else {
            let idx = lods_1.getID(predicate) || predicate;
            if (!ramda_1.isEmpty(idx)) {
                document.metadata[idx] = quad.object.value;
            }
        }
        return document;
    }, seek));
};
exports.formatDocument = formatDocument;
