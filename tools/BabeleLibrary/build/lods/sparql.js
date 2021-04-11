"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResults = exports.formatQuery = void 0;
const form_data_1 = __importDefault(require("form-data"));
const ramda_1 = require("ramda");
/**
 * Formatta una query SPARQL per essere inviata con una POST ad un triplestore
 * @param {string} query query in SPARQL
 * @param {string} defaultGraph specifica il grafo su cui fare la query
 */
function formatQuery(query, defaultGraph = '') {
    const form = new form_data_1.default();
    form.append('default-graph-uri', defaultGraph || '');
    form.append('query', query);
    form.append('format', 'application/sparql-results+json');
    return form;
}
exports.formatQuery = formatQuery;
/**
 * Estrapola da una risposta ad un endpoint i risultati trovati
 * @param a Risposta del server
 * @returns {EndpointResult[] | undefined} Lista di risposte del server
 */
exports.getResults = ramda_1.pipe(ramda_1.prop('body'), ramda_1.path(['results', 'bindings']));
