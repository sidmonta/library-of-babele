const fs = require('fs')
const path = require('path')
fs.unlink(path.resolve(__dirname, '../config/rush/npm-shrinkwrap.json'), (err) => {
  console.error(err)
})
