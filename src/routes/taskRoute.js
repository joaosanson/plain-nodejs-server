import { Database } from '../database.js'
import { randomUUID } from 'node:crypto'

const database = new Database()

const currentDate = new Date()

export const routes = [
  {
    method: 'GET',
    path: '/tasks',
    handler: (req, res) => {
      const tasks = database.select('tasks')
      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: 'POST',
    path: '/tasks',
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: currentDate,
        updated_at: currentDate,
      }

      database.insert('tasks', task)
      return res.writeHead(201).end()
    },
  },
  {
    method: 'DELETE',
    path: '/tasks/',
    handler: (req, res) => {
      return res.writeHead(201).end()
    },
  },
]
