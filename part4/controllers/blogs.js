const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user
  console.log('user._id: ', user._id)

  if (!user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id
  })

  console.log('created blog: ', blog)

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  console.log('request.user: ', request.user)
  console.log('request.params.id: ', request.params.id)
  const blog = await Blog.findById(request.params.id)
  const user = request.user
  console.log('blog que en test le falta user: ', blog)
  console.log('user: ', user)
  const a = blog.user.toString()
  const b = user.id.toString()
  console.log('blog.user.toString(): ', a)
  console.log('user.id.toString(): ', b)

  if (!user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (!(blog.user.toString() === user.id.toString())) {
    return response.status(401).json({ error: 'only authors can delete their entries' })
  }
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter