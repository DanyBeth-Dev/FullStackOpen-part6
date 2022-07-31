const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: "Dan Her", url: "http://www.todelete.com", likes: 5 })
  await blog.save()
  await blog.remove()
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const token = async (user) => {
  const { username, password } = user
  const userInDb = await User.findOne({ username })
  const passwordCorrect = userInDb === null
    ? false
    : await bcrypt.compare(password, userInDb.passwordHash)

  if (!(userInDb && passwordCorrect)) {
    return null
  }
  const userForToken = {
    username: userInDb.username,
    id: userInDb._id,
  }

  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })

  return token
}

module.exports = { initialBlogs, nonExistingId, blogsInDb, usersInDb, token }