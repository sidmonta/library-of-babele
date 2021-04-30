import { useEffect, useState } from 'react'
import { __, prefetch } from '@sidmonta/babelelabeler'

// export const LabelerContext = createContext(Labeler)
// export const useLabelerContext = () => useContext(LabelerContext)

prefetch([
  'http://purl.org/dc/terms',
  'http://purl.org/vocab/frbr/core',
  'http://www.w3.org/1999/02/22-rdf-syntax-ns'
], undefined, process.env.REACT_APP_PROXY)

export const useLabel = (uri: string, lang?: string | undefined) => {
  const [label, setLabel] = useState<string>(uri)

  useEffect(() => {
    const getLabel = async (uri: string) => {
      const l: string = await __(uri, lang, process.env.REACT_APP_PROXY)
      setLabel(l)
    }
    if (uri) {
      getLabel(uri).then()
    }
  }, [uri, lang])

  return [label, setLabel]
}
