const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')

const app = express()

app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(express.json()) //config para pegar o body em json

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/books/insertbook', (req, res) => {

  const title = req.body.title
  const pagesqty = req.body.pagesqty
  const autor = req.body.autor
  const resume = req.body.resume
  const date = req.body.date
  const rating = req.body.rating

  const query = `INSERT INTO books (??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?)`
  const data = [
    'title', 'autor', 'pageqty', 'resume', 'date', 'rating', 
    title, autor, pagesqty, resume, date, rating
  ]

  pool.query(query, data, function (err) {
    if (err) {
      console.log(err)
    }

    res.redirect('/books')
  })
})

app.get('/books', (req, res) => {

  const sql = 'SELECT * FROM books'

  pool.query(sql, function (err, data) {
    if (err) {
      console.log(err)
      return
    }

    const books = data

    res.render('books', { books })
  })
})

app.get('/books/:id', (req, res) => {
  const id = req.params.id

  const query = `SELECT * FROM books WHERE ?? = ?`
  const data = ['id', id]

  pool.query(query, data, function (err, data) {
    if (err) {
      console.log(err)
      return
    }

    const book = data[0]

    res.render('book', { book })
  })
})

app.get('/books/edit/:id', (req, res) => {
  const id = req.params.id

  const sql = `SELECT * FROM books WHERE ?? = ?`
  const data = ['id', id]

  pool.query(sql, data, function (err, data) {
    if (err) {
      console.log(err)
      return
    }
    const book = data[0]

    res.render('editbook', { book })
  })
})

app.post('/books/updatebook', (req, res) => {
  const id = req.body.id
  const title = req.body.title
  const pagesqty = req.body.pagesqty
  const autor = req.body.autor
  const resume = req.body.resume
  const date = req.body.date
  const rating = req.body.rating

  const sql = `UPDATE books SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?`
  const data = [
    'title', title, 
    'autor', autor, 
    'pageqty', pagesqty,
    'resume', resume,
    'date', date,
    'id', id,
    'rating', rating,
  ]

  pool.query(sql, data, function(err, data){
    if (err) {
      console.log(err)
      return
    }

    res.redirect(`/books/${id}`)
  })

})


app.post('/books/remove/:id', (req, res) => {
  const id = req.params.id

  const sql = `DELETE FROM books WHERE ?? = ?`
  const data = ['id', id]

  pool.query(sql, data, function(err){
    if (err) {
      console.log(err)
      return
    }

    res.redirect('/books')

  })
})

app.listen(3000)


