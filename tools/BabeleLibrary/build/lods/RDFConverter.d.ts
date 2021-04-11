declare type OutputFormat = 'rdfa' | 'microdata' | 'xml' | 'n3' | 'nt' | 'json-ld';
declare type InputFormat = OutputFormat;
/**
 * Classe statica che utilizza il servizio <http://rdf-translator.appspot.com>
 * per la conversione in vari formati LOD di una stringa.
 * Se il servizio non fosse disponibile per qualche motivo, fa un secondo
 * tentativo sul servizio <http://www.easyrdf.org>
 *
 */
export default class RDFConverter {
    /**
     * Converte utilizzando il servizio rdf-translator
     * @param str stringa da convertire
     * @param source formato della stringa da convertire
     * @param target formato delle conversione
     * @private
     */
    private static rdfTranslator;
    /**
     * Converte utilizzando il servizio Easy Rdf Converter
     * @param str stringa da convertire
     * @param source formato della stringa da convertire
     * @param target formato delle conversione
     * @private
     */
    private static easyRdfConvert;
    /**
     * Converte una stringa in formato N3 (molto diffuso) in un formato a scelta
     * @param str stringa da convertire
     * @param output formato di output
     * @returns {Promise<string>} Il testo convertito
     */
    static convert(str: string, output: OutputFormat): Promise<string>;
    /**
     * Converte una stringa in formato in un formato a scelta
     * @param str stringa da convertire
     * @param input formato di input
     * @param output formato di output
     * @returns {Promise<string>} Il testo convertito
     */
    static convertFrom(str: string, input: InputFormat, output: OutputFormat): Promise<string>;
    /**
     * Effettua la chiamata al servizio
     * @param url
     * @param form
     * @private
     */
    private static runExecution;
}
export {};
