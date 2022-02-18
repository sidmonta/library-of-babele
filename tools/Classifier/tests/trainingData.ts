import NeuralNetwork from '../src/algorithms/Fisher'
import { featureWthMetadata } from '../src/Features'
import BetterSqlite3 from 'better-sqlite3'
const db = new BetterSqlite3('/Users/lucamontanera/Projects/Tesi/Babele/Training/database.db')

// Constant
const dataForTrain = 10640

const classifier = new NeuralNetwork({
  features: featureWthMetadata,
  database: {
    dbPath: '/Users/lucamontanera/Projects/Tesi/Babele/Training/train.json'
  }
})

async function train(): Promise<void> {
  const all = db.prepare(`
    SELECT td.metadata , td.description, dewey.name , dewey.id
    FROM
      TrainingData td
      INNER JOIN data_x_dewey x ON (td.id = x.data_id )
      INNER JOIN dewey  ON (x.dewey_id = dewey.id )`).all()

  console.log(`Training on ${all.length} data`)

  const count = new Map()

  for (const row of all) {
    let { metadata, description, name, id } = row
    if (count.get(id) > 1022) {
      continue
    }
    count.set(id, count.has(id) ? count.get(id) + 1 : 1)
    metadata = metadata.split('\n')
    metadata.push(name)

    description = description || ''

    await classifier.train({ metadata, content: description }, id)
    console.log('train on ' + id)
  }

  console.log('Finish training')

  classifier.refreshTrain()

  const row = all[193]
  let { metadata, description, name, id } = row
  metadata = metadata.split('\n')
  metadata.push(name)

  description = description || ''
  console.log(await classifier.classify({ metadata, content: description }), id, name)

}

train().then()
