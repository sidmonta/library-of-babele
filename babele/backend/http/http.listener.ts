import { httpListener } from '@marblejs/core'
import { logger$ } from '@marblejs/middleware-logger'
import { bodyParser$ } from '@marblejs/middleware-body'
import { cors$ } from '@marblejs/middleware-cors'
import { api$ } from './api.effects'
import { static$ } from './static.assets'

/**
 * Definizione delle middleware da eseguire per ogni richiesta server HTTP
 */
const middlewares = [
  logger$(), // Abilita i log delle richieste
  bodyParser$(), // Effettua il parser del body delle chiamate
  cors$({
    // Abilita le chiamate CORS
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 204,
    allowHeaders: '*',
    maxAge: 3600,
  }),
]

// Lista degli endpoint resi disponibili dal server http
const effects = [api$, static$]

/**
 * Istanza del server HTTP
 */
export const listener = httpListener({
  middlewares,
  effects,
})
