import http from 'node:http'
import { env } from 'node:process'
import { json } from './middlewares/json.js'
import { routes } from './routes/taskRoute.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find((route) => {
    return route.method === method && route.path === url
  })

  if (route) {
    route.handler(req, res)
  }

  res.writeHead(404)
  res.write(JSON.stringify('oops, not found!'))
  return res.end()
})

server.listen(3333, () => {
  console.log(`server is running at port: ${env.PORT}`)
})
