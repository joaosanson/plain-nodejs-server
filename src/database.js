import fs from 'node:fs/promises'

const databasePath = new URL('../database/db.json', import.meta.url)
const databaseDir = new URL('../database/', import.meta.url)

const currentDate = new Date()

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then((data) => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        fs.mkdir(databaseDir, { recursive: true })
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].includes(value)
        })
      })
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push({
        ...data,
        completed_at: null,
        created_at: currentDate,
        updated_at: currentDate,
      })
    } else {
      this.#database[table] = [
        {
          ...data,
          completed_at: null,
          created_at: currentDate,
          updated_at: currentDate,
        },
      ]
    }
    this.#persist()
    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        ...this.#database[table][rowIndex],
        updated_at: currentDate,
        ...data,
      }
      this.#persist()
    } else {
      throw new Error('Id not found')
    }
    return data
  }

  patch(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        ...this.#database[table][rowIndex],
        updated_at: currentDate,
        completed_at: currentDate,
      }
      this.#persist()
    } else {
      throw new Error('Id not found')
    }
    return table
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    } else {
      throw new Error('Id not found')
    }
    return table
  }
}
