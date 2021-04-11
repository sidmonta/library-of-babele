import { Quad } from 'n3';
/**
 * Estrapola l'identificativo dall'URI di un elemento
 * @param uri URL dell'elemento
 */
export declare const getID: (uri: string) => string | undefined;
/**
 * Controlla la presenza di una Regex all'interno di una tripla
 */
export declare const checkQuad: import("Function/Curry").Curry<(fil: string, quad: Quad) => boolean>;
/**
 * Custom encodeURIComponent
 * @param str
 */
export declare const fixedEncodeURIComponent: (str: string) => string;
/**
 * Formatta un'oggetto trasformandolo un una stringa per URL
 * @param {{}} x Oggetto con i parametri della URI
 * @returns {string} i parametri convertiti in query
 */
export declare const formUrlEncoded: (x: {}) => string;
/**
 * Verifica se l'URI passata come parametro è una risorsa LOD.
 * Il controllo avviene controllando il content-type della risposta alla chiamata alla risorsa. Si è utilizzato il
 * metodo HEAD per risparmiare banda e tempo nella risposta visto che del contenuto non occorre
 * @param uri URI da cui controllare
 * @return se l'uri identifica una risorsa LOD
 */
export declare const isLodURI: (uri: string) => Promise<boolean>;
