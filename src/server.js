import http from 'node:http'
import { env } from 'node:process'
import { DEFAULT_HEADER } from './util/utils.js'

const tasks = []

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  if (method === 'GET' && url === '/tasks') {
    return res.end(JSON.stringify(tasks))
  }

  if (method === 'POST' && url === '/tasks') {
    console.log(req.body)
  }

  res.writeHead(404, DEFAULT_HEADER)
  res.write(JSON.stringify('oops, not found!'))
  return res.end()
})

server.listen(3333, () => {
  console.log(`server is running at port: ${env.PORT}`)
})
