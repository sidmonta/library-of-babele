import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Tools } from '@sidmonta/babelelibrary'
const socket = new Tools.WebSocketClient({
  port: process.env.REACT_APP_WS_PORT,
  address: 'ws://' + process.env.REACT_APP_WS_HOST,
})

socket.onOpenConnection(() => console.log('Open connection'))
socket.onCloseConnection(() => console.log('Close connection'))

export const WebSocketContext = createContext(socket)
export const useWebSocket = () => useContext(WebSocketContext)

export function useWSData<A>(eventType: string): [A[], Dispatch<SetStateAction<A[]>>] {
  const [elements, setElements] = useState<A[]>([])
  const webSocketClient = useWebSocket()

  useEffect(() => {
    const identify = webSocketClient.on(eventType, (elem: A) => {
      setElements((old: A[]) => [...old, elem])
    })

    return () => webSocketClient.removeListener(eventType, identify)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [elements, setElements]
}
