"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
/**
 * Classe statica che utilizza il servizio <http://rdf-translator.appspot.com>
 * per la conversione in vari formati LOD di una stringa.
 * Se il servizio non fosse disponibile per qualche motivo, fa un secondo
 * tentativo sul servizio <http://www.easyrdf.org>
 *
 */
class RDFConverter {
    /**
     * Converte utilizzando il servizio rdf-translator
     * @param str stringa da convertire
     * @param source formato della stringa da convertire
     * @param target formato delle conversione
     * @private
     */
    static rdfTranslator(str, source, target) {
        const url = `http://rdf-translator.appspot.com/convert/${source}/${target}/content`;
        const form = new form_data_1.default();
        form.append('content', str);
        return RDFConverter.runExecution(url, form);
    }
    /**
     * Converte utilizzando il servizio Easy Rdf Converter
     * @param str stringa da convertire
     * @param source formato della stringa da convertire
     * @param target formato delle conversione
     * @private
     */
    static easyRdfConvert(str, source, target) {
        const mapFormat = {
            xml: 'rdfxml',
            n3: 'n3',
            nt: 'ntriples',
            'json-ld': 'jsonld'
        };
        const url = 'http://www.easyrdf.org/converter';
        const form = new form_data_1.default();
        form.append('data', str);
        form.append('uri', 'http://njh.me/');
        form.append('raw', '1');
        form.append('in', mapFormat[source] || 'guess');
        form.append('out', mapFormat[target]);
        return RDFConverter.runExecution(url, form);
    }
    /**
     * Converte una stringa in formato N3 (molto diffuso) in un formato a scelta
     * @param str stringa da convertire
     * @param output formato di output
     * @returns {Promise<string>} Il testo convertito
     */
    static async convert(str, output) {
        return await RDFConverter.convertFrom(str, 'nt', output);
    }
    /**
     * Converte una stringa in formato in un formato a scelta
     * @param str stringa da convertire
     * @param input formato di input
     * @param output formato di output
     * @returns {Promise<string>} Il testo convertito
     */
    static async convertFrom(str, input, output) {
        try {
            return await RDFConverter.rdfTranslator(str, input, output);
        }
        catch (err) {
            // Uso Easy RDF Converter come fallback
            console.error(err);
            return await RDFConverter.easyRdfConvert(str, input, output);
        }
    }
    /**
     * Effettua la chiamata al servizio
     * @param url
     * @param form
     * @private
     */
    static runExecution(url, form) {
        return new Promise((resolve, reject) => {
            let data = form;
            let opt = {};
            // Nel caso si stia utilizzando form-data di nodejs e non del browser
            if (form.getBuffer) {
                data = form.getBuffer();
                opt = { headers: { ...form.getHeaders() } };
            }
            axios_1.default
                .post(url, data, opt)
                .then(response => {
                if (response.status != 200) {
                    reject(response.statusText);
                }
                else {
                    resolve(response.data);
                }
            })
                .catch((err) => reject(err))
                .finally(() => reject('Errore sconosciuto'));
        });
    }
}
exports.default = RDFConverter;
