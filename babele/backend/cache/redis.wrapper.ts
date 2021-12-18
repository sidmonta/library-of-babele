import { promisify } from 'util'
import { RedisClient } from 'redis'
import {fromPromise} from "rxjs/internal-compatibility";
import {from} from "rxjs";
import {mergeMap} from "rxjs/operators";

/*
 * Rendo le operazioni di redis come Promise invece che con l'uso di callback
 */

export const smembers = (cache: RedisClient) => (value: string) => promisify(cache.smembers).bind(cache)(value)
export const allitem = (cache: RedisClient) => (key: string) => promisify(cache.lrange).bind(cache)(key, 0, -1)
export const pagination = (cache: RedisClient) => (value: string, page: number, limit: number) =>
  fromPromise(promisify(cache.smembers).bind(cache)(value)).pipe(mergeMap((list: string[]) => {
    let totItems = list.length
    list = list.slice(page * limit, page * limit + limit)
    return from(list.map(value => ({ value, totItems })))
  }))
