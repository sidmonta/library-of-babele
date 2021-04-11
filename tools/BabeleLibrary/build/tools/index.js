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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingEndpoint = exports.generateColorFromString = exports.validURL = exports.trimCh = exports.alwaysTrue = exports.match = void 0;
const ramda_1 = require("ramda");
const url_1 = require("url");
const http = __importStar(require("http"));
/**
 * @private
 * Oggetto restituito dal metodo match, finche non si esegue l'otherwise
 * @param x qualunque valore restituito dalla funzione `fn`
 */
const matched = (x) => ({
    on: () => matched(x),
    otherwise: () => x
});
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
const match = (x) => ({
    on: (cond, fn) => cond(x) ? matched(fn(x)) : exports.match(x),
    otherwise: (fn) => fn(x)
});
exports.match = match;
/**
 * Una funzione che torna sempre TRUE indipendentemente dai parametri passati
 */
const alwaysTrue = (..._) => true;
exports.alwaysTrue = alwaysTrue;
/**
 * Rimuove un determinato carattere all'inizio o alla fine di una stringa
 */
const trimCh = (ch) => (x) => x.replace(new RegExp(`^${ch}+|${ch}+$`, 'g'), '');
exports.trimCh = trimCh;
/**
 * Controlla se una stringa è un URL valido
 * @param {string} str stringa da controllare
 * @returns {boolean} se è un URL valido
 */
const validURL = (str) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
};
exports.validURL = validURL;
/**
 * Genera un colore univoco a partire da una stringa di testo.
 * @param s stringa da cui generare un colore
 * @return colore esadecimale
 */
const generateColorFromString = (s) => {
    const hashCode = (s) => s
        .split('')
        .reduce((hash, char) => hash + char.charCodeAt(0) + ((hash << 5) - hash), 0);
    const intToRGB = (int) => {
        let c = (int & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + "00000".substring(0, 6 - c.length) + c;
    };
    return ramda_1.pipe(hashCode, intToRGB)(s);
};
exports.generateColorFromString = generateColorFromString;
/**
 * Tools contiene anche tutti gli strumenti per la gestione dei WebSocket
 */
__exportStar(require("./WebSocketClient"), exports);
/**
 * Funzione per eseguire un ping ad un endpoint qualunque.
 * Utile per sapere se la risorsa web richiesta è accessibile
 * @param endpoint endpoint da controllarne la reperibilità
 */
const pingEndpoint = async (endpoint) => {
    const options = {
        method: 'HEAD',
        host: url_1.parse(endpoint).host,
        port: 80,
        path: url_1.parse(endpoint).pathname,
        timeout: 800,
    };
    return new Promise((resolve) => {
        try {
            const req = http.request(options, function (r) {
                resolve(r.statusCode ? r.statusCode < 200 : false);
            });
            req.setTimeout(800, () => req.abort());
            req.end();
            req.on('error', function (err) {
                console.error('Error on ping ' + endpoint, err);
                resolve(false);
            });
        }
        catch (err) {
            console.error('Error on ping ' + endpoint, err);
            resolve(false);
        }
    });
};
exports.pingEndpoint = pingEndpoint;
