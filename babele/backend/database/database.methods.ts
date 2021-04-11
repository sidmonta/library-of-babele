import { EffectContext, HttpServer } from '@marblejs/core'
import { getDatabaseFromContext } from './database.context'
import { DeweyCategory } from '@sidmonta/babelelibrary/build/types'
import { map, mergeMap } from 'rxjs/operators'
import { of, pipe, throwError } from 'rxjs'
import { sqlGetDeweyInfo, sqlWhereDeweyId, sqlWhereParent, sqlWhereParentNull } from './database.queries'

export type From = 'fromParent' | 'fromId'

// Creazione di un generatore di query SQL
const sqlGenerator = sqlGetDeweyInfo('d')

/**
 * Funzione che genera una lista di dewey figli a partire dal risultato della
 * query.
 *
 * Il formato di hierarchy è il seguente:
 *
 * `dewey_idN;dewey_parentN,dewey_idN-1;dewey_parentN-1,...,dewey_idRoot;dewey_parentRoot`
 * @param hierarchy
 */
function formatHierarchyDewey(hierarchy) {
  return hierarchy
    ? hierarchy.split(',').map((hierarchy) => {
        const [dewey, parent, name] = hierarchy.split(';')
        return {
          dewey,
          parent,
          name,
        }
      })
    : []
}

/**
 * Create DeweyCategory from SQL row
 * @param row
 */
function createDeweyCategory(row: any): DeweyCategory {
  return {
    dewey: row.dewey,
    name: row.name,
    parent: row.name,
    hierarchy: formatHierarchyDewey(row.hierarchy),
    haveChildren: row.haveChild > 0,
  }
}

/**
 * Recupera i record dal database
 * @param database istanza del database
 * @param from determina su che base richiedere i record
 */
const getRecord = (database, from: From) => (identity: string) => {
  try {
    const whereParentCondition =
      from === 'fromParent'
        ? identity
          ? sqlWhereParent(identity) // Recupero le dewey conoscendo il padre
          : sqlWhereParentNull() // Recupero le dewey root
        : sqlWhereDeweyId(identity) // Recupero la dewey conoscendo il suo identificativo
    const response: DeweyCategory[] = database
      .prepare(sqlGenerator(whereParentCondition))
      .all()
      .map(createDeweyCategory)
    return of(response)
  } catch (err) {
    return throwError('Error on Database ' + err)
  }
}

/**
 * Processa la richiesta del server per ottenere le dewey richieste
 * @param ctx EffectContext dalla richiesta del server
 * @param from determina quale informazione utilizzare le la richiesta
 */
const process = (ctx: EffectContext<HttpServer>, from: From) => {
  const database = getDatabaseFromContext(ctx)
  const get = getRecord(database, from)

  return mergeMap(get)
}

/**
 * Recupera tutte le Dewey appartenenti ad un determinata categoria padre
 * @param ctx EffectContext della richiesta del server
 */
export function getCategory(ctx: EffectContext<HttpServer>) {
  return process(ctx, 'fromParent')
}

/**
 * Recupera la dewey con un determinato ID
 * @param ctx EffectContext della richiesta del server
 */
export function getDeweyElement(ctx: EffectContext<HttpServer>) {
  return process(ctx, 'fromId')
}

/**
 * Recupera la label di una determinata dewey
 * @param ctx EffectContext della richiesta del server
 */
export function getDeweyLabel(ctx: EffectContext<HttpServer>) {
  return pipe(
    process(ctx, 'fromId'),
    map((dewey: DeweyCategory[]) => ({ label: dewey[0].name }))
  )
}
