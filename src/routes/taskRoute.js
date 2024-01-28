import { Database } from '../database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from '../utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select(
        'tasks',
        search
          ? {
              title: search,
              description: search,
            }
          : null,
      )
      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      try {
        const { title, description } = req.body

        const task = {
          id: randomUUID(),
          title,
          description,
        }

        database.insert('tasks', task)
      } catch ({ name, message }) {
        if (name === 'TypeError') {
          res.writeHead(404)
          res.write(JSON.stringify('oops, missing title or description'))
          return res.end()
        }
        console.log(name)
        console.log(message)
        res.writeHead(404)
        return res.end()
      }

      return res.writeHead(201).end()
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      try {
        const { title, description } = req.body

        const task = {
          id,
          title,
          description,
        }

        try {
          database.update('tasks', id, task)
        } catch ({ name, message }) {
          if (message === 'Id not found') {
            res.writeHead(404)
            res.write(JSON.stringify('oops, id not found'))
            return res.end()
          } else {
            throw new Error(name, message)
          }
        }

        return res.writeHead(204).end()
      } catch ({ name, message }) {
        if (name === 'TypeError') {
          res.writeHead(404)
          res.write(JSON.stringify('oops, title or description'))
          res.end()
        } else {
          throw new Error(name, message)
        }
      }
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      try {
        database.patch('tasks', id)
      } catch ({ name, message }) {
        if (message === 'Id not found') {
          res.writeHead(404)
          res.write(JSON.stringify('oops, id not found'))
          return res.end()
        } else {
          throw new Error(name, message)
        }
      }

      return res.writeHead(204).end()
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      try {
        database.delete('tasks', id)
      } catch ({ name, message }) {
        if (message === 'Id not found') {
          res.writeHead(404)
          res.write(JSON.stringify('oops, id not found'))
          return res.end()
        } else {
          throw new Error(name, message)
        }
      }

      return res.writeHead(204).end()
    },
  },
]
