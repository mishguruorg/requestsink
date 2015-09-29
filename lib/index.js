import express from 'express'
import Promise from 'bluebird'
import { v4 as createGuid } from 'uuid'
import busboy from 'connect-busboy'

const fs = Promise.promisifyAll(require('fs'))

const startServer = () => {
  const app = express()

  app.use(busboy())

  app.get('/', (req, res) => {
    res.send('done')
  })

  app.post('/zip', (req, res) => {
    req.pipe(req.busboy)

    req.busboy.on('file',(fieldname, file, filename) => {
      console.log(`new file at ${new Date()}`)
      let bufs = []

      file.on('data', data => {
        bufs.push(data)
      })

      file.on('end', () => {
        const fileName = `files/${createGuid()}.zip`
        fs.writeFileAsync(fileName, Buffer.concat(bufs))
          .then(() => {
            res.send(`saved to ${fileName}`)
          })
          .catch(res.send)
      })
    })
  })

  const server = app.listen(3000, () => {
    console.log(`server listening on ${server.address().address}:${server.address().port}`)
  })
}

startServer()
