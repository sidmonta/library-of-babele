import * as N3 from 'n3';
import { Observable } from 'rxjs';
/**
 * Alias
 */
declare type Quad = N3.Quad;
/**
 * @class
 * Classe statica che definisce diversi metodi per la generazione di Triple a partire da vari formati
 */
export default class QuadFactory {
    /**
     * Trasforma un file di triple in uno Observable di Quad
     * @param {string} filename file da convertire
     * @returns {Observable<Quad>} Observable di Quad
     */
    static generateFromFile(filename: string): Observable<Quad>;
    /**
     * Trasforma una stringa in un Observable di Quad
     * @param {string} text testo da convertire
     * @param {boolean} rdf se il testo è in formato RDF, Default false
     * @returns {Observable<Quad>} Observable di Quad
     */
    static generateFromString(text: string, rdf?: boolean): Observable<Quad>;
    /**
     * Prende un array di array e lo trasforma in un Observable<Quad>.
     * L'array e formato:
     * ```
     * [
     *  [subject, predicate, object],
     *  ...
     * ]
     * ```
     * @param {Array<Array<string>>} quads Triple da trasformare
     * @returns {Observable<Quad>} Observable di Quad
     */
    static generateFromArray(quads: Array<Array<string>>): Observable<Quad>;
    /**
     * Prende un array di oggetti e lo trasforma in un Observable<Quad>.
     * L'array e formato:
     * ```
     * [
     *  { s: string, p: string, o: string },
     *  ...
     * ]
     * ```
     * @param {Array<{s: string, p: string, o: string}>} quads Triple da trasformare
     * @returns {Observable<Quad>} Observable di Quad
     */
    static generateFromObject(quads: Array<{
        s: string;
        p: string;
        o: string;
    }>): Observable<Quad>;
}
export {};
