import {createContext, Dispatch, SetStateAction, useContext, useEffect, useState} from 'react'
import { Tools } from '@sidmonta/babelelibrary'
import type {Quad} from "../services/models";
import {useRecoilState} from "recoil";
import {langAvailable} from "../store/books";
import {Subject} from "rxjs";

const socket = new Tools.WebSocketClient({
  port: process.env.REACT_APP_WS_PORT,
  address: 'ws://' + process.env.REACT_APP_WS_HOST,
})

socket.onOpenConnection(() => console.log('Open connection'))
socket.onCloseConnection(() => console.log('Close connection'))

export const WebSocketContext = createContext(socket)
export const useWebSocket = () => useContext(WebSocketContext)

export function useWSData<A>(eventType: string, lang?: string): [A[], Dispatch<SetStateAction<A[]>>] {
  const [elements, setElements] = useState<A[]>([])
  const webSocketClient = useWebSocket()
  const [, setAvailableLang] = useRecoilState(langAvailable)

  useEffect(() => {
    const identify = webSocketClient.on(eventType, (elem: A) => {
      let flag: boolean = true
      if (lang) {
        const tmp = elem as unknown as { quad: Quad }
        const elemLang = tmp.quad.object.language
        if (elemLang) {
          setAvailableLang((prev) => Array.from(new Set([...prev, elemLang])))
          if (tmp.quad.object.language !== lang) {
            flag = false
          }
        }
      }

      if (flag) {
        setElements((old: A[]) => [...old, elem])
      }
    })

    return () => webSocketClient.removeListener(eventType, identify)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [elements, setElements]
}

export function useWSDataAsStream<A>(eventType: string) {
  const [subject, setSubject] = useState<Subject<A>>(new Subject())
  const webSocketClient = useWebSocket()
  useEffect(() => {
    setSubject(new Subject())
    const identify = webSocketClient.on(eventType, (elem: A) => {
      subject.next(elem)
    })

    return () => {
      webSocketClient.removeListener(eventType, identify)
      subject.complete()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventType])

  return subject.asObservable()
}
