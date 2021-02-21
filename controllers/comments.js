const router = require('express').Router()
const db = require('../models')

// POST /comments - CREATE new comment
router.post('/', async (req, res) => {
  try {
    res.json({ message: 'hello from comments' })
  } catch(error) {
    console.log(error)
    res.status(400).json({ messgae: 'OH NO! 💩 something isnt right'})
  }
})

module.exports = router