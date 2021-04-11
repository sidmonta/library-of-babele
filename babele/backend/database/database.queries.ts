/**
 * Query per il recupero della gerarchia di una determinata dewey
 * @param deweyTable
 */
export const sqlGenerateHierarchy = (deweyTable: string) => `
SELECT group_concat(name) 
FROM (
  SELECT (d2.id || ';' || d2.parent || ';' || name) as name
  FROM dewey d2
  WHERE 
    d2.id = substr(d.parent, 1, 1) || '00'
    OR d2.id = substr(d.parent, 1, 2) || '0'
    OR d2.id = ${deweyTable}.parent
) as pp`

/**
 * Query per la verifica se un dewey ha dei sottoelementi
 * @param deweyTable
 */
export const sqlHaveChild = (deweyTable: string) => `SELECT COUNT(1) FROM dewey d3 WHERE d3.parent = ${deweyTable}.id`

/* Definizioni di diverse WHERE da associare alle query */
export const sqlWhereParentNull = () => (deweyTable: string) => `${deweyTable}.parent IS NULL`
export const sqlWhereParent = (parent: string) => (deweyTable: string) => `${deweyTable}.parent = '${parent}'`
export const sqlWhereDeweyId = (deweyId: string) => (deweyTable: string) => `${deweyTable}.id = '${deweyId}'`

/**
 * Funzione che genera la query per ottenere le informazioni su una o più dewey.
 *
 * La funzione combina le diverse funzioni definite sopra
 *
 * @param deweyTable
 * @return where La funzione per la generazione della WHERE della query
 */
export const sqlGetDeweyInfo = (deweyTable: string) => (where: (deweyTable: string) => string) => `
    SELECT 
      id as dewey,
      name,
      parent,
      (${sqlGenerateHierarchy(deweyTable)}) as hierarchy,
      (${sqlHaveChild(deweyTable)}) as 'haveChild'
    FROM dewey ${deweyTable} 
    WHERE ${where(deweyTable)}
`
