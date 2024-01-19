import http from 'node:http'
import { env } from 'node:process'
import { DEFAULT_HEADER } from './util/utils.js'
import { json } from './middlewares/json.js'

const tasks = []

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  if (method === 'GET' && url === '/tasks') {
    return res.end(JSON.stringify(tasks))
  }

  if (method === 'POST' && url === '/tasks') {
    console.log(req.body)
  }

  res.writeHead(404)
  res.write(JSON.stringify('oops, not found!'))
  return res.end()
})

server.listen(3333, () => {
  console.log(`server is running at port: ${env.PORT}`)
})
