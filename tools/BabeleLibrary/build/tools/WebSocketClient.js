"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketClient = void 0;
/**
 * Strumento per la gestione di un WebSocket lato browser
 *
 * La classe wrappa l'oggetto WebSocket di sistema implementando metodi per facilitarne l'utilizzo
 * @class
 */
class WebSocketClient {
    constructor(opts) {
        var _a, _b;
        /**
         * Indirizzo al websocket.
         * Di default 'localhost'
         * @private
         */
        this.address = 'ws://localhost';
        /**
         * Porta utilizzata dal websocket.
         * Di default '80'
         * @private
         */
        this.port = '80';
        /**
         * Registro contenente tutte le callback associate ad ogni evento del WebSocket.
         *
         * @typedef Map<type, Map<identify, WebSocketCallback>>
         * @private
         */
        this.eventsRegistry = new Map();
        this.address = (_a = opts === null || opts === void 0 ? void 0 : opts.address) !== null && _a !== void 0 ? _a : this.address;
        this.port = (_b = opts === null || opts === void 0 ? void 0 : opts.port) !== null && _b !== void 0 ? _b : this.port;
        const connectionPath = `${this.address}:${this.port}`;
        this.webSocket = new WebSocket(connectionPath);
        // Gestione della ricezione di un evento da parte del WS
        this.webSocket.onmessage = (event) => {
            // Trasformo il messaggio in un oggetto
            const data = JSON.parse(event.data);
            if (!data.type || !data.payload) {
                throw Error('Data recived is invalid');
            }
            // Se è definita qualche callback per il tipo di evento trasmesso
            if (this.eventsRegistry.has(data.type)) {
                const callbacks = this.eventsRegistry.get(data.type);
                if (callbacks && callbacks.size) {
                    // Lancio la callback passando il payload come paramentro
                    callbacks.forEach(callback => callback(data.payload));
                }
            }
        };
    }
    /**
     * Permette di definire una callback associata ad un particolare evento
     * @param type evento a cui associare la callback
     * @param callback callback da associare
     * @return Identificativo della callback appena registrata
     */
    on(type, callback) {
        const callbacks = this.eventsRegistry.get(type) || new Map();
        const identify = WebSocketClient.countIdentify++;
        callbacks.set(identify, callback);
        this.eventsRegistry.set(type, callbacks);
        return identify;
    }
    /**
     * Permette di rimuovere una callback associata ad un evento
     * @param type evento da cui si vuole rimuovere una callback
     * @param callbackIdentify identificativo della callback da eliminare
     */
    removeListener(type, callbackIdentify) {
        if (callbackIdentify) {
            let callbacks = this.eventsRegistry.get(type) || new Map();
            callbacks.delete(callbackIdentify);
            this.eventsRegistry.set(type, callbacks);
        }
        else {
            this.eventsRegistry.delete(type);
        }
    }
    /**
     * Permette di inviare un messaggio al WS
     * @param message messaggio da inviare al WS
     */
    send(message) {
        // Converto il messaggio in stringa
        const strMessage = JSON.stringify(message);
        // L'intervallo serve per garantire che il WS sia pronto a ricevere messaggi
        let interval = setInterval(() => {
            if (this.webSocket.readyState === 1) { // Se WS è pronto
                this.webSocket.send(strMessage);
                clearInterval(interval);
            }
        }, 400);
    }
    /**
     * Emette un messaggio di un particolare tipo al WebSocket
     * @param eventType tipo di messaggio da inviare
     * @param payload contenuto del messaggio da inviare
     */
    emit(eventType, payload) {
        const message = {
            type: eventType, payload
        };
        this.send(message);
    }
    /**
     * Evento lanciato appena il WebSocket si è connesso
     * @param callback
     */
    onOpenConnection(callback) {
        this.webSocket.onopen = callback;
    }
    /**
     * Evento lanciato appena la connessione al WebSocket è stata chiusa
     * @param callback
     */
    onCloseConnection(callback) {
        this.webSocket.onclose = callback;
    }
    /**
     * Evento lanciato ogni qualvolta il WebSocket ha dato errore
     * @param callback
     */
    onError(callback) {
        this.webSocket.onerror = callback;
    }
}
exports.WebSocketClient = WebSocketClient;
/**
 * Conteggia le callback dichiarate e serve come identificativo di quest'ultime
 */
WebSocketClient.countIdentify = 1;
