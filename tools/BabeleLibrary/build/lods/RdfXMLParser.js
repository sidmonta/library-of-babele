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
const fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
const ramda_1 = require("ramda");
const N3 = __importStar(require("n3"));
const n3_1 = require("n3");
var quad = n3_1.DataFactory.quad;
var literal = n3_1.DataFactory.literal;
var namedNode = n3_1.DataFactory.namedNode;
var blankNode = n3_1.DataFactory.blankNode;
const ATTR_NODE_NAME = 'attr';
const TEXT_NODE_NAME = '#text';
/**
 * Verifico se è un oggetto non vuoto
 * @param a
 */
const isObject = (a) => typeof a === 'object' && !ramda_1.isEmpty(a);
// Definizione delle opzioni per il parsing del XML
const options = {
    attributeNamePrefix: '',
    attrNodeName: ATTR_NODE_NAME,
    textNodeName: TEXT_NODE_NAME,
    ignoreAttributes: false,
    ignoreNameSpace: false,
    allowBooleanAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: false,
    trimValues: true,
    parseTrueNumberOnly: false,
    arrayMode: false, //"strict"
};
/* Definizione delle lenti per l'accesso alle proprietà di un Nodo XML */
const namespaceLens = ramda_1.lensPath(['rdf:RDF', ATTR_NODE_NAME]); // Accede ai namespace
const aboutLens = ramda_1.lensPath([ATTR_NODE_NAME, 'rdf:about']); // Accede all'attributo about
const resourceLens = ramda_1.lensPath([ATTR_NODE_NAME, 'rdf:resource']); // Accede all'attributo resource
const langLens = ramda_1.lensPath([ATTR_NODE_NAME, 'xml:lang']); // Accede all'attributo lingua
/* Definizioni di getter e check su proprietà dei nodi XML */
// Un nodo XML contiene un soggetto
const getSubject = ramda_1.view(aboutLens) || '';
const haveSubject = node => ramda_1.pipe(getSubject, ramda_1.isNil, ramda_1.not)(node) || ramda_1.keys(node)[0] === 'rdf:Description';
// Un nodo xml contiene un oggetto
const getResource = ramda_1.view(resourceLens) || '';
const haveResource = ramda_1.pipe(getResource, ramda_1.isNil, ramda_1.not);
// In un nodo xml è definita la lingua
const getLang = ramda_1.view(langLens);
const haveLang = ramda_1.pipe(getLang, ramda_1.isNil, ramda_1.not);
/* Genera Nodi in formato N3 a partire dai valori */
const generatePredicate = namedNode;
const generateSubject = (subject) => subject ? namedNode(subject) : blankNode();
// Di seguito il generatore per l'oggetto che utilizza funzioni di utilità per capire come deve essere definito
// l'oggetto. L'oggetto RDF può essere un literal, un namedNode
const termFromResource = ramda_1.pipe(getResource, namedNode);
const termFromSubject = ramda_1.pipe(getSubject, generateSubject);
const termWithLanguage = node => literal(node[TEXT_NODE_NAME], getLang(node));
const termFromBasicString = literal;
/*
* Permette di estrarre un oggetto da un oggetto padre.
* Praticamente un oggetto di una tripla può essere la definizione di un'altra risorsa LOD
* definita nello stesso modo in cui viene definito il soggetto di una tripla
*/
const extractTermFromObject = node => {
    const val = ramda_1.head(ramda_1.values(node));
    if (val) {
        return ramda_1.ifElse(haveSubject, termFromSubject, generateObject)(val);
    }
    return blankNode();
};
/**
 * Genera un oggetto a partire da un nodo XML
 * @param node
 */
const generateObject = (node) => {
    // Gestione dei literal
    if (typeof node === 'string')
        return termFromBasicString(node);
    // Gestione dei namedNode
    if (haveResource(node))
        return termFromResource(node);
    // Gestione dei literal con l'attributo lang
    if (haveLang(node))
        return termWithLanguage(node);
    // Gestione di un sotto-oggetto come proprietà
    if (isObject(node))
        return extractTermFromObject(node);
    // Altrimenti ritorna un nodo vuoto
    return blankNode();
};
/**
 * Permette di estrarre tutti i namespace definiti nell'XML
 * @param namespaceAttr Nodo xml contenente i namespace
 */
const extractNamespaces = (namespaceAttr) => {
    return ramda_1.pipe(ramda_1.mapObjIndexed((value, key) => [key.replace('xmlns:', ''), value]), Object.values, ramda_1.fromPairs)(namespaceAttr);
};
/**
 * Aggiunge una tripla al writer per la scrittura conclusiva
 * @param writer
 */
const addQuad = (writer) => (newQuad) => writer.addQuad(newQuad);
/**
 * Funzione di utilità per eseguire un foreach dei nodi XML
 * @param func
 */
const forEachObj = (func) => {
    const cicle = ramda_1.forEachObjIndexed((value, key, obj) => {
        if (key !== ATTR_NODE_NAME) {
            func(value, key, obj);
        }
    });
    return (obj) => cicle(obj);
};
/**
 * Funzione che esegue il parsing di una stringa XML contenente RDF in una stringa in formato N3
 * @param xmlstring stringa XML contenente RDF
 * @return stringa convertita in formato N3
 */
function parseRdfXML(xmlstring) {
    try {
        // Parsifico l'xml per trasformarlo in un oggetto
        const jsonObj = fast_xml_parser_1.default.parse(xmlstring, options);
        // Estrapolo i namespaces definiti nell'XML
        const namespaces = extractNamespaces(ramda_1.view(namespaceLens, jsonObj));
        // Definisco un writer dove verranno salvate tutte le triple che poi genererà la stringa in formato RDF
        const writer = new N3.Writer({ prefixes: namespaces });
        // Definisco la funzione che permetterà di salvare le triple all'interno del writer
        const add = addQuad(writer);
        //Ciclo per ogni nodo xml
        forEachObj((value, key) => {
            // Se è un oggetto procedo, altrimenti non è un XML per un RDF
            if (ramda_1.is(Object, value)) {
                // Recupero il soggetto definito nel nodo che si sta analizzando
                const subject = termFromSubject(value);
                // Parsifico il contenuto del nodo a cui fa capo il soggetto appena estratto
                parse(add, subject, value);
                // Gestisco il caso in cui nel tag del soggetto sia definito alnche la tipologia del soggetto.
                if (typeof key === 'string' && key !== 'rdf:Description') {
                    const predicate = namedNode('rdf:type');
                    const object = namedNode(key);
                    add(quad(subject, predicate, object));
                }
            }
        })(jsonObj['rdf:RDF']);
        // Finisco con il generare la stringa convertita tramite il writer e ritornarla
        return new Promise((resolve, reject) => {
            writer.end((error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }
    catch (error) {
        console.log(error);
    }
    return Promise.resolve('');
}
exports.default = parseRdfXML;
/**
 * Funzione che parsifica il nodo di un soggetto RDF
 * @param add funzione per aggiungere una tripla al writer
 * @param subject soggetto della tripla
 * @param node nodo da parsificare
 */
function parse(add, subject, node) {
    // Per ogni sotto-nodo del nodo
    forEachObj((value, key) => {
        // Esiste la possibilità che per ogni predicato ci siano più oggetti, quindi gestico il tutto con un array
        const objectsSource = Array.isArray(value) ? value : [value];
        // Genero gli oggetti associati alla tripla
        const object = objectsSource.map(generateObject);
        // Recupero la definizione del predicato dal nodo
        if (typeof key === 'string' && isNaN(parseInt(key))) {
            const predicate = generatePredicate(key);
            // Con il soggetto, il predicato e i vari oggetti inserisco tutti all'interno del writer
            object.forEach((obj) => add(quad(subject, predicate, obj)));
        }
        // Se il sotto-nodo a al suo interno altri sotto-nodi in cui è definito anche un soggetto
        // parsifico questi sotto-sotto-nodi
        if (isObject(value) && haveSubject(value)) {
            parse(add, termFromSubject(value), value);
        }
    })(node);
}
