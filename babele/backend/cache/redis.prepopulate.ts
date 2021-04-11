import { database } from '../database/database.context'
import { redisClient } from './redis.context'
import { CACHE_KEY_ENDPOINT_LIST, getEndpoints } from '../search/endpoint-list'

/**
 * Funzione per la popolazione delle informazioni dewey nella cache per
 * velocizzare l'accesso
 */
export function populateDeweyCache(): void {
  // Database -> Record<URI, Dewey>[] -> Cache
  database
    .prepare('SELECT data_id, dewey_id FROM data_x_dewey dxd') // query db
    .all() // prelevo tutti i record
    .forEach(({ data_id, dewey_id }) => {
      redisClient.sadd(dewey_id, data_id) // Salvo nella cache
    })
}

/**
 * Funzione per la popolazione nella cache degli endpoint LOD per la ricerca
 */
export async function populateEndpointList(): Promise<void> {
  // Verifico se ho già inserito gli endpoint nella cache
  redisClient.lrange(CACHE_KEY_ENDPOINT_LIST, 0, -1, async (err, data) => {
    let endpoints: string[]
    if (err || !data) {
      // Se nella cache non sono presenti li inserisco
      endpoints = await getEndpoints()

      redisClient.del(CACHE_KEY_ENDPOINT_LIST)
      redisClient.lpush(CACHE_KEY_ENDPOINT_LIST, ...endpoints, () => {})
    } else {
      endpoints = data
    }
    return endpoints
  })
}
