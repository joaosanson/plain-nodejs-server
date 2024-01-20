import http from 'node:http'
import { env } from 'node:process'
import { json } from './middlewares/json.js'
import { Database } from './database.js'

const database = new Database()

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  if (method === 'GET' && url === '/tasks') {
    const tasks = database.select('tasks')
    return res.end(JSON.stringify(tasks))
  }

  if (method === 'POST' && url === '/tasks') {
    const { title, description, completed_at, created_at, updated_at } =
      req.body

    const task = {
      id: 1,
      title,
      description,
      completed_at,
      created_at,
      updated_at,
    }

    database.insert('tasks', task)
    return res.writeHead(201).end()
  }

  res.writeHead(404)
  res.write(JSON.stringify('oops, not found!'))
  return res.end()
})

server.listen(3333, () => {
  console.log(`server is running at port: ${env.PORT}`)
})
