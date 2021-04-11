"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const N3 = __importStar(require("n3"));
const fs_1 = require("fs");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const rdfxml_streaming_parser_1 = require("rdfxml-streaming-parser");
const stream_1 = require("../stream");
const RDFConverter_1 = __importDefault(require("./RDFConverter"));
const tools_1 = require("../tools");
const RdfXMLParser_1 = __importDefault(require("./RdfXMLParser"));
const ramda_1 = require("ramda");
// Iniziallizzazione del parser N3 globale (non serve inizializzarlo ad ogni utilizzo)
const parser = new N3.Parser();
//const { namedNode, literal, quad } = N3.DataFactory
/**
 * Effettua un parse da una stringa in formato N3 in array di triple, transformandole poi in stream
 * @param text stringa di testo contenente Turtle da convertire
 */
const parse = (text) => {
    const res = parser.parse(text);
    return rxjs_1.from(res);
};
/**
 * Provo per prima cosa a convertire RDF in N3 con un metodo veloce, se qualcosa va storto provo con i tool online
 */
const convertXmlWthFallback = ramda_1.tryCatch(RdfXMLParser_1.default, (t) => RDFConverter_1.default.convertFrom(t, 'xml', 'n3'));
/**
 * @class
 * Classe statica che definisce diversi metodi per la generazione di Triple a partire da vari formati
 */
class QuadFactory {
    /**
     * Trasforma un file di triple in uno Observable di Quad
     * @param {string} filename file da convertire
     * @returns {Observable<Quad>} Observable di Quad
     */
    static generateFromFile(filename) {
        const rdfStream = fs_1.createReadStream(filename);
        const streamParser = filename.endsWith('.rdf') || filename.endsWith('.xml')
            ? new rdfxml_streaming_parser_1.RdfXmlParser()
            : new N3.StreamParser();
        rdfStream.pipe(streamParser);
        return stream_1.fromStream(rdfStream);
    }
    /**
     * Trasforma una stringa in un Observable di Quad
     * @param {string} text testo da convertire
     * @param {boolean} rdf se il testo è in formato RDF, Default false
     * @returns {Observable<Quad>} Observable di Quad
     */
    static generateFromString(text, rdf = false) {
        if (rdf) { // Se la stringa è in formato RDF allora va convertita in formato N3
            // Effettuo la conversione da XML a N3
            const toParse = convertXmlWthFallback(text);
            // Dal testo parsificato poi eseguo il parse per ottenere lo stream di triple
            return rxjs_1.from(toParse).pipe(operators_1.mergeMap(parse));
        }
        else {
            // Se è già in formato n3 eseguo direttamente il parse
            return parse(text);
        }
    }
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
    static generateFromArray(quads) {
        return rxjs_1.from(quads).pipe(operators_1.map((q) => {
            const [subject, predicate, object] = q.map(el => tools_1.validURL(el) ? N3.DataFactory.namedNode(el) : N3.DataFactory.literal(el));
            return N3.DataFactory.quad(subject, predicate, object);
        }));
    }
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
    static generateFromObject(quads) {
        return rxjs_1.from(quads).pipe(operators_1.map((q) => N3.DataFactory.quad(N3.DataFactory.namedNode(q.s), N3.DataFactory.namedNode(q.p), tools_1.validURL(q.o) ? N3.DataFactory.namedNode(q.o) : N3.DataFactory.literal(q.o))));
    }
}
exports.default = QuadFactory;
