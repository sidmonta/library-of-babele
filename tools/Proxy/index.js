const request = require('request')
const app = require('express')()
const cors = require('cors')

const port = 3007

app.use(cors())
app.use('/*', (req, res) => {
  request({
    url: req.params[0],
    method: req.method,
    headers: {
      'accept': 'application/rdf+xml'
    }
  }, (err, data) => {
    if (err || !data) {
      res.sendStatus(500)
    } else {
      res.set(data.headers)
      res.send(data.body)
    }
  })
})
app.listen(port, () => console.log(`Listening on port ${port}!`))