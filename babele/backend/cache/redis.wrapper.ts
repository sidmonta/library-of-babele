import { promisify } from 'util'
import { RedisClient } from 'redis'

/*
 * Rendo le operazioni di redis come Promise invece che con l'uso di callback
 */

export const smembers = (cache: RedisClient) => (value: string) => promisify(cache.smembers).bind(cache)(value)
export const allitem = (cache: RedisClient) => (key: string) => promisify(cache.lrange).bind(cache)(key, 0, -1)
