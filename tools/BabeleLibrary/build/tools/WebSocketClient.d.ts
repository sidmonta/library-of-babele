/**
 * Definisce la configurazione accettata dal WebSocket
 */
export declare type WebSocketConfig = {
    address?: string;
    port?: string;
};
export declare type EventType = string;
/**
 * Definisce la struttura di un dato passato da un WebSocket
 *
 * @type E tipologia dell'evento
 * @type P tipologia del payload da passare al WebSocket
 */
export declare type WebSocketData<E extends EventType, P> = {
    type: E;
    payload: P;
};
/**
 * Tipologia di funzione callback da eseguire all'avvento di un evento
 *
 * @type P tipologia di payload ritornato dalla chiamata WebSocket
 */
export declare type WebSocketCallback<P> = (payload: P) => void;
/**
 * Strumento per la gestione di un WebSocket lato browser
 *
 * La classe wrappa l'oggetto WebSocket di sistema implementando metodi per facilitarne l'utilizzo
 * @class
 */
export declare class WebSocketClient<E extends EventType> {
    /**
     * Indirizzo al websocket.
     * Di default 'localhost'
     * @private
     */
    private readonly address;
    /**
     * Porta utilizzata dal websocket.
     * Di default '80'
     * @private
     */
    private readonly port;
    /**
     * Istanza del websocket
     * @private
     */
    private webSocket;
    /**
     * Registro contenente tutte le callback associate ad ogni evento del WebSocket.
     *
     * @typedef Map<type, Map<identify, WebSocketCallback>>
     * @private
     */
    private eventsRegistry;
    /**
     * Conteggia le callback dichiarate e serve come identificativo di quest'ultime
     */
    static countIdentify: number;
    constructor(opts?: WebSocketConfig);
    /**
     * Permette di definire una callback associata ad un particolare evento
     * @param type evento a cui associare la callback
     * @param callback callback da associare
     * @return Identificativo della callback appena registrata
     */
    on<P>(type: E, callback: WebSocketCallback<P>): number;
    /**
     * Permette di rimuovere una callback associata ad un evento
     * @param type evento da cui si vuole rimuovere una callback
     * @param callbackIdentify identificativo della callback da eliminare
     */
    removeListener<P>(type: E, callbackIdentify?: number): void;
    /**
     * Permette di inviare un messaggio al WS
     * @param message messaggio da inviare al WS
     */
    send<P>(message: WebSocketData<E, P>): void;
    /**
     * Emette un messaggio di un particolare tipo al WebSocket
     * @param eventType tipo di messaggio da inviare
     * @param payload contenuto del messaggio da inviare
     */
    emit<P>(eventType: E, payload: P): void;
    /**
     * Evento lanciato appena il WebSocket si è connesso
     * @param callback
     */
    onOpenConnection(callback: () => void): void;
    /**
     * Evento lanciato appena la connessione al WebSocket è stata chiusa
     * @param callback
     */
    onCloseConnection(callback: () => void): void;
    /**
     * Evento lanciato ogni qualvolta il WebSocket ha dato errore
     * @param callback
     */
    onError(callback: (event: any) => void): void;
}
