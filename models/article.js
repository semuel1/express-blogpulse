const router = require('express').Router()
const db = require('../models')

/**
 * /articles routes
 */

// GET /articles/:id - READ a specific post and include its author
router.get('/:id', async (req, res) => {
  try {
    const article = await db.article.findOne({
      where: { id: req.params.id },
      include: [db.author, db.comment]
    })
    res.json({ article: article })
  } catch(error) {
    console.log(error)
    res.status(400).json({ message: 'bad request' })
  }
})

// POST /articles/:id/comments - CREATE a new comment
router.post('/:id/comments', async (req, res) => {
  try {
    const article = await db.article.findByPk(req.params.id)
    const newComment = await article.createComment({
      name: req.body.name,
      content: req.body.content
    })

    res.redirect(`/articles/${req.params.id}`)
  } catch(error) {
    console.log(error)
    res.status(400).json({ message: 'bad request' })
  }
})

module.exports = router