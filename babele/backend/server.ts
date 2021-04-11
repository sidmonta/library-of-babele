import { bindTo, createServer } from '@marblejs/core'
import { IO } from 'fp-ts/lib/IO'
import { listener } from './http/http.listener'
import { wSocketListener } from './websocket/websocket.listener'
import { createWebSocketServer } from '@marblejs/websockets'
import { d, databaseToken } from './database/database.context'
import { c, cacheToken } from './cache/redis.context'
import { populateDeweyCache, populateEndpointList } from './cache/redis.prepopulate'

const server = createServer({
  port: Number(process.env.REACT_APP_HTTP_PORT),
  hostname: process.env.REACT_APP_HTTP_HOST,
  listener,
  dependencies: [bindTo(databaseToken)(d), bindTo(cacheToken)(c)],
})

const webSocketServer = createWebSocketServer({
  options: {
    port: Number(process.env.REACT_APP_WS_PORT),
    host: process.env.REACT_APP_WS_HOST,
  },
  listener: wSocketListener,
  dependencies: [bindTo(databaseToken)(d), bindTo(cacheToken)(c)],
})

const main: IO<void> = async () => {
  populateDeweyCache()
  await populateEndpointList()

  // @ts-ignore
  await (await server)()
  // @ts-ignore
  await (await webSocketServer)()
}

main()
