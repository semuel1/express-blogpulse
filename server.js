// requried modules
const express = require('express')
const db = require('./models')
const rowdy = require('rowdy-logger')
const morgan = require('morgan')

// config express app
const app = express()
const rowdyResults = rowdy.begin(app)
const port = 3000


// express middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))

// GET / - display all articles and their authors
app.get('/', (req, res) => {
  db.article.findAll({
    include: [db.author]
  }).then((articles) => {
    res.render('main/index', { articles: articles })
  }).catch((error) => {
    console.log(error)
    res.status(400).render('main/404')
  })
})

// bring in authors and articles controllers
app.use('/authors', require('./controllers/authors'))
app.use('/articles', require('./controllers/articles'))

app.listen(port, () => {
  console.log(`listening on port ${port}`)
  rowdyResults.print()
})


