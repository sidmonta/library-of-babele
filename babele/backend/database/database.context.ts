import BetterSqlite3, { Database } from 'better-sqlite3'
import { resolve } from 'path'
import { createContextToken, EffectContext, HttpServer, reader } from '@marblejs/core'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Reader'
import * as O from 'fp-ts/lib/Option'
import { WebSocketClientConnection } from '@marblejs/websockets'

/**
 * Creo l'istanza per il database SQLite3
 */
export const database = new BetterSqlite3(resolve(process.env.DATABASE_PATH))

/* Genero il MarbleJS Context per l'istanza del database */
export const databaseToken = createContextToken<Database>('database')
export const d = pipe(
  reader,
  R.map(() => database)
)

/**
 * Funzione per il recupero del database dal EffectContext
 * @param ctx EffectContext da cui estrarre l'istanza del database
 */
export const getDatabaseFromContext: (ctx: EffectContext<HttpServer | WebSocketClientConnection>) => Database | null = (
  ctx: EffectContext<HttpServer | WebSocketClientConnection>
) =>
  pipe(
    ctx.ask(databaseToken),
    O.getOrElse(() => null)
  )
