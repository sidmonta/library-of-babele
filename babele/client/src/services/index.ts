import { useLocation, useHistory } from 'react-router-dom'
import { createRef, Dispatch, RefObject, SetStateAction, useEffect, useState } from "react"

type Method = 'GET' | 'POST' | 'PUT'

type OptionFetch = {
  method: Method
  headers: Record<string, string>
  body?: string
}

export function fetchAPI(method: Method) {
  const baseURL = `http://${process.env.REACT_APP_HTTP_HOST}:${process.env.REACT_APP_HTTP_PORT}/api`
  return function (url: string, data = undefined) {
    let optRequest: OptionFetch = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (data) {
      optRequest.body = JSON.stringify(data)
    }

    return fetch(baseURL + url, optRequest).then((response: Response) => response.json())
  }
}

// HOOKS

export function useRedirect() {
  const navigate = useHistory()
  const location = useLocation()

  const basePathRegex = new RegExp('^(/category/[0-9]+|/search/[A-Za-z0-9+]+)')
  const match = basePathRegex.exec(location.pathname)
  const basePath = match && match[1] ? match[1] : location.pathname
  return (url: string) => {
    navigate.push(`${basePath}/book/${encodeURIComponent(url)}`)
  }
}

export function useInterceptionPagination(props?: { data: unknown[], numElem: number } | undefined): [RefObject<HTMLDivElement>, number, Dispatch<SetStateAction<number>>] {
  const loaderDom = createRef<HTMLDivElement>()
  const [page, setPage] = useState(0)

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1
    }

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5 && (!props || (props.data.length >= (props.numElem || 10) * page))) {
          setPage((prev) => prev + 1)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, options)
    if (loaderDom.current) {
      observer.observe(loaderDom.current)
    }

    return () => observer.disconnect()
    // eslint-disable-next-line
  }, [loaderDom, props])

  return [loaderDom, page, setPage]
}
