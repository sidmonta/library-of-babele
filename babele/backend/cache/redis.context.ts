import { createClient, RedisClient } from 'redis'
import { createContextToken, EffectContext, HttpServer, reader } from '@marblejs/core'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Reader'
import * as O from 'fp-ts/lib/Option'
import { WebSocketClientConnection } from '@marblejs/websockets'

/**
 * Create redis client instance
 */
export const redisClient: RedisClient = createClient()

/* Create MarbleJS Context for get redis client */
export const cacheToken = createContextToken('cache')
export const c = pipe(
  reader,
  R.map(() => redisClient)
)

/**
 * Function for get redis client from EffectContext
 * @param ctx EffectContext
 */
export const getCacheFromContext: (ctx: EffectContext<HttpServer | WebSocketClientConnection>) => RedisClient | null = (
  ctx: EffectContext<HttpServer | WebSocketClientConnection>
) =>
  pipe(
    ctx.ask(cacheToken),
    O.getOrElse(() => null)
  )
