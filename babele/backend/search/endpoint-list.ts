import { Rx, Lod, Tools } from '@sidmonta/babelelibrary'
import { URLSearchParams } from 'url'
import generalSearchQuery from './sparql.queries'
import { map, mergeMap } from 'rxjs/operators'
import { from, Observable, onErrorResumeNext } from 'rxjs'

type Method = 'GET'

export const CACHE_KEY_ENDPOINT_LIST = process.env.CACHE_KEY_ENDPOINT_LIST

/**
 * Filtra gli endpoint che sono ancora raggiungibili
 * @param endpoints lista degli endpoint
 */
const filterEndpoint = async (endpoints: string[]): Promise<string[]> => {
  const filteredEndpoint = []
  for (let endpoint of endpoints) {
    try {
      if (await Tools.pingEndpoint(endpoint)) {
        console.log(`Add Endpoint ${endpoint}`)
        filteredEndpoint.push(endpoint)
      }
    } catch (err) {
      console.error(`Endpoint ${endpoint} not available`)
    }
  }
  return filteredEndpoint
}

/**
 * Ritorna la lista degli endpoint
 */
export function getEndpoints() {
  const endpointList: string[] = [
    'https://vocab.nerc.ac.uk/sparql/',
    'http://registry.it.csiro.au/system/query',
    'http://agrovoc.uniroma2.it/sparql',
    'http://www.imagesnippets.com/sparql/images',
    'https://lov.linkeddata.es/dataset/lov/sparql',
    'https://sparql.uniprot.org/sparql',
    'http://lod.openlinksw.com/sparql',
    'http://ma-graph.org/sparql',
    'http://sparql.europeana.eu',
    'https://www.foodie-cloud.org/sparql',
    'http://dbpedia.org/sparql',
    'http://bio2rdf.org/sparql',
    'http://bioportal.bio2rdf.org/sparql/',
    'https://publications.europa.eu/en/advanced-sparql-query-editor',
    'http://publications.europa.eu/webapi/rdf/sparql',
    'https://jpsearch.go.jp/rdf/sparql',
    'https://covid19.i3s.unice.fr/sparql',
    'https://morph.oeg.fi.upm.es/sparql',
    'https://dati.cobis.to.it/sparql',
    'http://data.bibliotheken.nl/sparql',
    'http://data.muziekschatten.nl/sparql',
  ]
  //TODO: The endpoint list get from source and not statical added
  return filterEndpoint(endpointList)
}

/**
 * Recupero i subject dai risultati della ricerca
 * @param endpointResult
 */
const extractSubjectFromResult = (endpointResult: Lod.SPARQL.EndpointResult[]): Observable<string> =>
  from(endpointResult.map((subjects) => subjects.subject.value))

/**
 * Effettua la ricerca per un determinato endpoit
 * @param query
 */
export function callEndpoint(query: string) {
  // Genera la query SPARQL generica per la ricerca testuale
  const sparqlQuery = generalSearchQuery(query)
  // Formatta la query per la comunicazione con l'endpoint
  const fetchQueryString = new URLSearchParams({
    query: sparqlQuery,
    format: 'application/json',
  })
  return (endpoint) => {
    const fetchParams = {
      url: {
        url: endpoint,
        method: 'GET' as Method,
        headers: {
          Accept: 'application/json',
        },
        params: fetchQueryString,
      },
      params: { endpoint, query },
    }

    // Effettua la ricerca, in caso di errore passa allo stream successivo
    return onErrorResumeNext(
      Rx.fetchContent(fetchParams).pipe(map(Lod.SPARQL.getResults), mergeMap(extractSubjectFromResult))
    )
  }
}
