import { Quad } from 'n3'
import { Event } from '@marblejs/core'

/**
 * Definizione dei possibili eventi gestiti dal WebSocket server
 */
export enum Type {
  BOOKLIST = 'BOOKLIST',
  LABEL = 'LABEL',
  BOOKDATA = 'BOOKDATA',
  BOOKSEARCH = 'BOOKSEARCH',
  BOOKDATASERVICE = 'BOOKDATASERVICE',
  NEWBOOK = 'NEWBOOK',
}

/**
 * Definisce il tipo per l'evento di tipo BOOKLIST
 *
 * L'evento viene generato quando si richiede la lista di libri
 */
export interface WSBookList extends Event {
  type: Type.BOOKLIST
  payload: { id: string }
}

/**
 * Definisce il tipo per l'evento di tipo LABEL
 *
 * Non usato
 */
export interface WSLabel extends Event {
  type: Type.LABEL
  payload: string | string[]
}

/**
 * Definisce il tipo per l'evento di tipo BOOKDATA in entrata (nel server)
 *
 * L'evento viene evocato quando il client seleziona un libro di cui vuole sapere le informazioni
 */
export interface WSBookDataIn extends Event {
  type: Type.BOOKDATA
  payload: {
    uri: string
  }
}

/**
 * Definisce il tipo per l'evento di tipo BOOKSEARCH
 *
 * L'evento viene evocato quando il client effettua una ricerca libera
 */
export interface WSBookSearch extends Event {
  type: Type.BOOKSEARCH
  payload: { query: string }
}

export interface WSBookDataOut extends Event {}

/**
 * Definisce il tipo per l'evento di tipo BOOKDATA in uscita (dal server)
 *
 * L'evento viene lanciato dal server con i dati ricavati dal Crawler
 */
export interface WSBookData extends WSBookDataOut {
  type: string
  payload: {
    quad: Quad
  }
}

/**
 * Definisce il tipo per l'evento di tipo BOOKDATASERVICE
 *
 * L'evento viene lanciato dal server ogni qualvolta si ritrova un nuovo servizio
 * quando il Crawler scansiona un nuovo servizio
 */
export interface WSBookDataService extends WSBookDataOut {
  type: string
  payload: {
    service: string
  }
}

/**
 * Definisce il tipo per l'evento di tipo NEWBOOK
 *
 * L'evento viene lanciato dal server ogni volta il classificatore classifica un
 * nuovo documento
 */
export interface WSNewBookClassified extends WSBookDataOut {
  type: Type.NEWBOOK
  payload: {
    bookUri: string
    dewey: string
  }
}
