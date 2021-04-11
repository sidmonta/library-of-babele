"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUri = exports.allCheck = exports.checkOpenLibrary = exports.checkViaf = exports.checkWikidata = exports.createCheck = void 0;
const ramda_1 = require("ramda");
require("../tools");
/**
 * Funzione di utilità che wrappa i passaggi per la variazione dell'URI
 * @param is valore che l'uri deve contenere per poter essere modificato
 * @param change Funzione che modifica l'URI
 */
const createCheck = (is, change) => ramda_1.ifElse(ramda_1.includes(is), change, ramda_1.identity);
exports.createCheck = createCheck;
// Wikidata
exports.checkWikidata = exports.createCheck('wikidata', ramda_1.pipe(ramda_1.match(/[QP][0-9]+$/), // Controllo che l'url finisca con l'identificativo solito di wikidata
ramda_1.head, // Recupero l'identificativo
ramda_1.ifElse(ramda_1.is(String), ramda_1.identity, _ => ''), // Se non ho trovato nessun identificativo lo setto di default a ''
ramda_1.concat('http://www.wikidata.org/wiki/Special:EntityData/') // Concateno l'identificativo all'url di wikidata
));
// VIAF
exports.checkViaf = exports.createCheck('viaf', (uri) => uri + '/rdf.xml');
// OpenLibrary
exports.checkOpenLibrary = exports.createCheck('openlibrary', (uri) => uri + '.rdf');
// Aggraga tutti i modificatori di URI
exports.allCheck = ramda_1.pipe(exports.checkWikidata, exports.checkViaf, exports.checkOpenLibrary);
function baseChangeURI() {
    // Aggiunta dei modificatori di base
    // TODO: Implementare meccanismo per il recupero da un database di questi modificatori
    let aggregate = [exports.checkWikidata, exports.checkViaf, exports.checkOpenLibrary];
    // Creazione di una funzione per l'aggregazione o l'esecuzione delle modifiche all'URI
    const control = (is, change) => {
        // Se ho definito sia il criterio che la funzione di modifica, aggiungo il nuovo criterio nell'aggregatore
        if (is && change) {
            aggregate.push(exports.createCheck(is, change));
            return control;
        }
        else if (is) { // Se ho passato solo il criterio allora eseguo i controlli usando il criterio come URI
            // @ts-ignore
            return ramda_1.pipe(...aggregate)(is);
        }
        // Altrimenti ritorno una funzione che eseguirà tutti i criteri quando gli verrà passato una URI
        // @ts-ignore
        return ramda_1.pipe(...aggregate);
    };
    return control;
}
/**
 * Funzione che permette l'aggregazione di più metodi di modifica dell'uri o l'esecuzione vera e propria
 */
exports.changeUri = baseChangeURI();
