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
    if (await Tools.pingEndpoint(endpoint)) {
      filteredEndpoint.push(endpoint)
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
    'https://3cixty.eurecom.fr/sparql',
    'https://3cixty.eurecom.fr/sparql',
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
    'http://dbpedia-live.openlinksw.com/sparql ',
    'https://opendata.aragon.es/sparql',
    'https://isidore.science/sparql',
    'https://data.bnf.fr/current/sparql.html',
    'http://data.plan4all.eu/sparql',
    'https://sparql.omabrowser.org/sparql',
    'http://dati.camera.it/sparql',
    'http://dati.beniculturali.it/sparql',
    'http://uriburner.com/sparql',
    'https://www.europeandataportal.eu/sparql',
    'https://hub-rnsr.idref.fr/sparql',
    'http://sparql.archives-ouvertes.fr/sparql',
    'http://dbkwik.webdatacommons.org/sparql',
    'https://data.idref.fr/endpoint.html',
    'http://sparql.southgreen.fr/',
    'http://data.doremus.org/sparql',
    'http://dati.senato.it/sparql',
    'http://data.persee.fr/explorer/sparql-endpoint/',
    'https://id.ndl.go.jp/auth/ndla/sparql',
    'http://host.geolink.org/sparql',
    'https://data.gov.cz/sparql',
    'http://datos.bcn.cl/sparql',
    'http://digital-agenda-data.eu/sparql',
    'https://www.nakala.fr/sparql',
    'http://data.legilux.public.lu/sparql',
    'https://sparql.dl.itc.u-tokyo.ac.jp/',
    'https://sparql.rhea-db.org/sparql',
    'http://lod.knps.or.kr/main/sparql.do',
    'https://www.orpha.net/sparql',
    'http://ariadne-registry.dcu.gr:8890/sparql',
    'http://patho.phenomebrowser.net/sparql/',
    'https://datos.gob.es/en/sparql',
    'https://sparql.geo.admin.ch/sparql',
    'http://sparql.lynx-project.eu/',
    'https://joinup.ec.europa.eu/sparql/',
    'https://openpark.jp/sparql',
    'https://landportal.org/sparql#this',
    'http://www.scholarlydata.org/sparql',
    'https://opendata1.opendata.u-psud.fr/sparql',
    'https://linkeddata1.calcul.u-psud.fr/sparql',
    'https://io.datascience-paris-saclay.fr/sparql',
    'https://www.ebi.ac.uk/rdf/services/sparql',
    'http://sparql.wikipathways.org/',
    'https://sparql.lri.fr/sparql',
    'https://babelnet.org/sparql/',
    'http://data.allie.dbcls.jp/sparql/',
    'http://lod.kaist.ac.kr/sparql',
    'https://semantic.eea.europa.eu/sparql',
    'http://linkedgeodata.org/sparql',
    'http://srvgal78.deri.ie:8004/sparql/',
    'https://data.gesis.org/claimskg/sparql',
    'http://sparql.datao.net/sparql',
    'http://caligraph.org/sparql',
    'https://bmrbpub.pdbj.org/search/rdf',
    'http://sparql.wikipathways.org/',
    'https://slovník.gov.cz/sparql',
    'https://data.idref.fr/sparql',
    'http://vocabs.ands.org.au/repository/api/sparql/csiro_international-chronostratigraphic-chart_2018-revised-corrected',
    'https://lindas-data.ch/sparql-ui/',
    'http://data.e-stat.go.jp/lod/sparql/',
    'http://opencitations.net/index/sparql',
    'http://opencitations.net/sparql',
    'https://api.parliament.uk/sparql',
    'https://data.pdok.nl/sparql',
    'http://vocab.getty.edu/sparql',
    'http://collection.britishart.yale.edu/sparql',
    'http://www.linkedlifedata.com/sparql',
    'http://factforge.net/sparql',
    'http://data.americanartcollaborative.org/sparql',
    'https://idsm.elixir-czech.cz/sparql/endpoint/idsm',
    'https://data.cssz.cz/sparql',
    'http://agrold.southgreen.fr/sparql',
    'http://dbkwik.webdatacommons.org/sparql',
    'http://webisa.webdatacommons.org/sparql',
    'http://dati.beniculturali.it/sparql',
    'https://covid-19ds.data.dice-research.org/sparql',
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
