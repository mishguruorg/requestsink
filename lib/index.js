import express from 'express'
import Promise from 'bluebird'
import { v4 as createGuid } from 'uuid'

const fs = Promise.promisifyAll(require('fs'))

const startServer = () => {
  const app = express()

  app.get('/', (req, res) => {
    res.send('done')
  })

  app.get('/zip', (req, res) => {
    let body = ''

    req.on('data', (data) {
        body += data;
    })

    req.on('end', () => {
      const fileName = `files/${createGuid()}.zip`
      fs.writeFile(fileName, req.body)
      res.send(`saved to ${fileName}`)
    })

  })

  const server = app.listen(3000, () => {
    console.log(`server listening on ${server.address().address}:${server.address().port}`)
  })
}

startServer()
