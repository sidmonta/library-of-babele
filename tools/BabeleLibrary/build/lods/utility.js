"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLodURI = exports.formUrlEncoded = exports.fixedEncodeURIComponent = exports.checkQuad = exports.getID = void 0;
const ramda_1 = require("ramda");
const url_1 = require("url");
require("n3");
const tools_1 = require("../tools");
const axios_1 = __importDefault(require("axios"));
const changeUri_1 = require("./changeUri");
/**
 * Estrapola l'identificativo dall'URI di un elemento
 * @param uri URL dell'elemento
 */
const getID = uri => {
    let urld = url_1.parse(uri).path;
    let get = ramda_1.pipe(tools_1.trimCh('/'), ramda_1.split(/[\/#]/), ramda_1.last);
    return urld ? get(uri) : undefined;
};
exports.getID = getID;
/**
 * Controlla la presenza di una Regex all'interno di una tripla
 */
exports.checkQuad = ramda_1.curry((fil, quad) => {
    var _a, _b, _c, _d, _e, _f;
    const regex = new RegExp(fil, 'gi');
    return Boolean(((_b = (_a = quad === null || quad === void 0 ? void 0 : quad.object) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.match(regex)) ||
        ((_d = (_c = quad === null || quad === void 0 ? void 0 : quad.predicate) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.match(regex)) ||
        ((_f = (_e = quad === null || quad === void 0 ? void 0 : quad.subject) === null || _e === void 0 ? void 0 : _e.value) === null || _f === void 0 ? void 0 : _f.match(regex)));
});
const encodeCharacter = (char) => '%' + char.charCodeAt(0).toString(16);
/**
 * Custom encodeURIComponent
 * @param str
 */
const fixedEncodeURIComponent = (str) => encodeURIComponent(str).replace(/[!'()*]/g, encodeCharacter);
exports.fixedEncodeURIComponent = fixedEncodeURIComponent;
/**
 * Formatta un'oggetto trasformandolo un una stringa per URL
 * @param {{}} x Oggetto con i parametri della URI
 * @returns {string} i parametri convertiti in query
 */
const formUrlEncoded = (x) => Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');
exports.formUrlEncoded = formUrlEncoded;
/**
 * Verifica se l'URI passata come parametro è una risorsa LOD.
 * Il controllo avviene controllando il content-type della risposta alla chiamata alla risorsa. Si è utilizzato il
 * metodo HEAD per risparmiare banda e tempo nella risposta visto che del contenuto non occorre
 * @param uri URI da cui controllare
 * @return se l'uri identifica una risorsa LOD
 */
const isLodURI = async (uri) => {
    return axios_1.default.head(changeUri_1.allCheck(uri), {
        headers: {
            Accept: 'application/rdf+xml'
        }
    }).then(response => {
        return Boolean(ramda_1.hasPath(['headers', 'content-type'], response) &&
            (response.headers['content-type'].includes('xml') ||
                response.headers['content-type'].includes('rdf')));
    });
};
exports.isLodURI = isLodURI;
