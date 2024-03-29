import { of } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import assert from 'assert'
import { describe, sampleTrain } from './utility'
import Classifier from '../src/Classifier'
import classify from '../src/stream'

import { resolve } from 'path'

(async function (): Promise<void> {
  const classy = new Classifier({
    database: {
      dbPath: resolve(__dirname, './test.db')
    }
  })

  for (let i = 0; i < 20; i++) {
    await sampleTrain(classy)
  }
})()

describe('Check stream good', () => {
  const classify$ = classify<string>({
    dbPath: resolve(__dirname, './test.db'),
    algorithm: 'Fisher',
    featureFun: 'getWords'
  })

  classify$('id', 'quick rabbit').subscribe(data => {
    assert.deepEqual(data, ['id', 'good'])
  }).unsubscribe()
})

describe('Check stream bad', () => {
  const classify$ = classify<string>({
    dbPath: resolve(__dirname, './test.db'),
    algorithm: 'Fisher',
    featureFun: 'getWords'
  })

  classify$('idrrrr', 'quick money').subscribe(data => {
    assert.deepEqual(data, ['idrrrr', 'bad'])
  }).unsubscribe()
})

describe('Check stream from stream',  () => {
  const classify$ = classify<string>({
    dbPath: resolve(__dirname, './test.db'),
    algorithm: 'Fisher',
    featureFun: 'getWords'
  })

  const map = {
    id: 'good',
    id2: 'bad',
    id3: 'good',
    id4: 'bad',
    id5: 'bad',
    id6: 'good'
  }

  of(
    ['id', 'quick rabbit'],
    ['id2', 'quick money'],
    ['id3', 'rabbit rabbit'],
    ['id4', 'money money'],
    ['id5', 'money'],
    ['id6', 'rabbit']
  ).pipe(
    mergeMap(([id, item]) => {
      return classify$(id, item)
    })
  ).subscribe(result => {
    const [id, res] = result
    assert.equal(res, map[id])
  })
})
