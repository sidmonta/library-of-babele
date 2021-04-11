import { useLocation, useHistory } from 'react-router-dom'

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

  const basePathRegex = new RegExp('^(/category/[0-9]+)')
  const match = basePathRegex.exec(location.pathname)
  const basePath = match && match[1] ? match[1] : location.pathname
  return (url: string) => {
    navigate.push(`${basePath}/book/${encodeURIComponent(url)}`)
  }
}
