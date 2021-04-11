/**
 * Formatta il valore da cerca come regex per le query SPARQL
 * @param query
 */
export const formatQuery = (query: string): string => {
  return (
    '^' +
    query
      .split(' ')
      .map((w) => `(?=.*\\b${w.trim()}\\b)`)
      .join('') +
    '.*$'
  )
}

/*const generalSearchQuery = (query) => `
  SELECT DISTINCT ?subject WHERE {
    ?subject [] ?object.
    FILTER isLiteral(?object).
    FILTER regex(?object, "${formatQuery(query)}", "i")
  }
  LIMIT 100
`*/

/**
 * Genera la query per gli endpoint di tipo Virtuoso che supporta la ricerca
 * full-text
 * @param query da ricercare
 */
const generalSearchQuery = (query: string) => `
SELECT DISTINCT ?subject WHERE {
    ?subject [] ?object.
    ?object bif:contains "'${query}'".
  }
  LIMIT 100
`
export default generalSearchQuery
