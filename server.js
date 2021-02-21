// requried modules
const express = require('express')
const db = require('./models')
const rowdy = require('rowdy-logger')
const morgan = require('morgan')

// config express app
const app = express()
const PORT = 3000
const rowdyResults = rowdy.begin(app)

// express middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))

/**
 * home route
 */

// GET / - READ all articles and include authors
app.get('/', async (req, res) => {
  try {
    const articles = await db.article.findAll({ include: [db.author] })
    res.json({ articles: articles })
  } catch(error) {
    console.log(error)
    res.status(400).json({ message: 'bad request' })
  }
})

/**
 * /authors routes
 */

// GET /authors - READ all authors
app.get('/authors', async (req, res) => {
  try {
    const authors = await db.author.findAll()
    res.json({ authors: authors })
  } catch(error) {
    console.log(error)
    res.status(400).json({ message: 'bad request' })
  }
})

// POST /authors - CREATE a new author
app.post('/authors', async (req, res) => {
  try {
    await db.author.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.bio
    })
    res.redirect('/authors')
  } catch(error) {
    console.log(error)
    res.status(400).json({ message: 'bad request' })
  }
})

// GET /authors/:id - READ a specific author and inlcude their posts
app.get('/authors/:id', async (req, res) => {
  try {
    const author = await db.author.findOne({
      where: {id: req.params.id},
      include: [db.article]
    })
    res.json({ author: author })
  } catch(error) {
    console.log(error)
    res.status(400).json({ message: 'bad request' })
  }
})

/**
 * /articles routes
 */

// POST /articles - CREATE a new post
app.post('/articles', async (req, res) => {
  try {
    await db.article.create({
      title: req.body.title,
      content: req.body.content,
      authorId: req.body.authorId
    })
    res.redirect('/')
  } catch(error) {
    res.status(400).json({ message: 'bad request' })
  }
})

// GET /articles/:id - READ a specific post and include its author
app.get('/articles/:id', async (req, res) => {
  try {
    const article = await db.article.findOne({
      where: { id: req.params.id },
      include: [db.author]
    })
    res.json({ article: article })
  } catch(error) {
    console.log(error)
    res.status(400).json({ message: 'bad request' })
  }
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
  rowdyResults.print()
})