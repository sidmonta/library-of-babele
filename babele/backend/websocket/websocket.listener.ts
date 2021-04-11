import { webSocketListener } from '@marblejs/websockets'
import { bookData$, bookList$, label$, search$ } from './stream.effect'

const effects = [bookList$, bookData$, label$, search$]

const middlewares = []

export const wSocketListener = webSocketListener({
  effects,
  middlewares,
})
