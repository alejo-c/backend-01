import express from 'express'
import fs from 'fs'
import bodyParser from "body-parser"

const app = express()
const port = 3000
const db = './db.json'

const readData = () => {
    try {
        const data = fs.readFileSync(db)
        return JSON.parse(data)
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}

const writeData = data => {
    try {
        fs.writeFileSync(db, JSON.stringify(data))
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}

const readBook = id => {
    const books = readData().books
    return books.find(book => book.id === id)
}

app.use(bodyParser.json())

app.get('/books', (req, res) => res.json(readData()))

app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const book = readBook(id)
    res.json(book)
})

app.post('/books', (req, res) => {
    const data = readData()
    const lastBook = data.books[data.books.length - 1]

    const newId = lastBook.id + 1
    const body = req.body
    const newBook = { id: newId, ...body }

    data.books.push(newBook)
    writeData(data)
    res.json(newBook)

    res.json({ "message": `Book ${newId} created successfully` })
})

app.put('/books/:id', (req, res) => {
    const data = readData()
    const body = req.body

    const id = parseInt(req.params.id)
    const index = data.books.findIndex(book => book.id === id)
    data.books[index] = { ...data.books[index], ...body }

    writeData(data)
    res.json({ "message": `Book ${id} updated successfully` })
})

app.delete('/books/:id', (req, res) => {
    const data = readData()
    const id = parseInt(req.params.id)

    const index = data.books.findIndex(book => book.id === id)
    data.books.splice(index, 1)
    writeData(data)

    res.json({ "message": `Book ${id} deleted successfully` })
})

app.listen(port, () => console.log(`Server started at http://localhost:${port}`))
