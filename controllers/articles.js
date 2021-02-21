const router = require('express').Router()
const db = require('../models')

// POST /articles - CREATE a new article
router.post('/', async (req, res) => {
  try {
    const article = await db.article.create({
      title: req.body.title,
      content: req.body.content,
      authorId: req.body.authorId
    })
    res.redirect(`/articles/${article.id}`)
  } catch(error) {
    res.status(400).json({ message: 'bad request' })
  }
})

// GET /articles/:id - READ a specific article and include its author
router.get('/:id', async (req, res) => {
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


module.exports = router