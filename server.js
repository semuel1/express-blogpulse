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

/**
 * home route
 */

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

/**
 * /authors routes
 */

// GET /authors - display all authors
app.get('/', (req, res) => {
  db.author.findAll()
  .then((authors) => {
    res.render('authors/index', { authors: authors })
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// POST /authors - create a new author
app.post('/', (req, res) => {
  db.author.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bio: req.body.bio
  })
  .then((author) => {
    res.redirect('/authors')
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// GET /authors/new - display form for creating a new author
app.get('/new', (req, res) => {
  res.render('authors/new')
})

// GET /authors/:id - display a specific author and their posts
app.get('/:id', (req, res) => {
  db.author.findOne({
    include: [db.article],
    where: {id: req.params.id}
  }).then((author) => {
    res.render('authors/show', { author: author })
  }).catch((error) => {
    console.log(error)
    res.status(400).render('main/404')
  })
})

/**
 * /articles routes
 */

// POST /articles - create a new post
app.post('/', (req, res) => {
  db.article.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId
  })
  .then((post) => {
    res.redirect('/')
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// GET /articles/new - display form for creating new articles
app.get('/new', (req, res) => {
  db.author.findAll()
  .then((authors) => {
    res.render('articles/new', { authors: authors })
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// GET /articles/:id - display a specific post and its author
app.get('/:id', (req, res) => {
  db.article.findOne({
    where: { id: req.params.id },
    include: [db.author]
  })
  .then((article) => {
    if (!article) throw Error()
    console.log(article.author)
    res.render('articles/show', { article: article })
  })
  .catch((error) => {
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


