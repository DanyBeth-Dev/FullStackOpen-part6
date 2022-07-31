const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

//---post user---//
//successful
//error if already exits the same username
//error if password is less than 3 characters long

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if password is less thant 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Laila',
      name: 'TheQueenLaila',
      password: '00',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

//---post login---//
//successful
//error if user does not exits
//error if invalid password

describe('login', () => {
  test('succesful', async () => {
    const user = {
      username: "root",
      password: "sekret"
    }
    await api
      .post('/api/login')
      .send(user)
      .expect(200)
  })

  test('user not found', async () => {
    const user = {
      username: "Lala",
      password: "sekret"
    }
    await api
      .post('/api/login')
      .send(user)
      .expect(401)
  })

  test('invalid password', async () => {
    const user = {
      username: "root",
      password: "Lala"
    }
    await api
      .post('/api/login')
      .send(user)
      .expect(401)
  })
})

//---post blog---//
//successful
//error if invalid
//missing likes property sets to 0 by default

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const user = {
      username: "root",
      password: "sekret"
    }
    const token = await helper.token(user)
    const newBlog = {
      title: "Your design code",
      author: "Lulu",
      url: "https://www.designcodes.com",
      likes: 20
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(n => n.title)
    expect(contents).toContain('Your design code')
  })

  test('if title and url properties are missing, sould receive a 400 code', async () => {
    const user = {
      username: "root",
      password: "sekret"
    }
    const token = await helper.token(user)
    const newBlog = {
      author: "Mimi"
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('if likes property is missing it is set by default to 0', async () => {
    const user = {
      username: "root",
      password: "sekret"
    }
    const token = await helper.token(user)
    const newBlog = {
      title: "The code palace",
      author: "Mimi",
      url: "https://www.codepalace.org"
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    const index = blogsAtEnd.length - 1
    expect(blogsAtEnd[index].likes).toEqual(0)
  })
})

//---get blogs---//
//get from all
//get an specific if
//error if blog does not exist
//error if blog was deleted before

describe('consulting blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('id should match', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => expect(blog.id).toBeDefined())
  })
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

    expect(resultBlog.body).toEqual(processedBlogToView)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

//---delete blogs---//
//successful
//error if token is invalid
//error if blog does not belongs to user

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const login = {
      username: "root",
      password: "sekret"
    }
    const newBlog = {
      title: "Your design code",
      author: "Lulu",
      url: "https://www.designcodes.com",
      likes: 20
    }
    const { username } = login
    const user = await User.findOne({ username })
    const userForToken = {
      username: user.username,
      id: user._id,
    }
    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[blogsAtStart.length-1]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })

  test('fails with 401 error if token is invalid', async () => {
    const login = {
      username: "root",
      password: "sekret"
    }
    const newBlog = {
      title: "Your design code",
      author: "Lulu",
      url: "https://www.designcodes.com",
      likes: 20
    }
    const { username } = login
    const user = await User.findOne({ username })
    const userForToken = {
      username: user.username,
      id: user._id,
    }
    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[blogsAtStart.length-1]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token+1}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).toContain(blogToDelete.title)
  })

  test('fails with 401 error when blog belongs to another user', async () => {
    const passwordHash = await bcrypt.hash('sekret', 10)
    const userOneInDb = new User({ username: 'lulu', passwordHash })
    await userOneInDb.save()

    const loginOne = {
      username: "lulu",
      password: "sekret"
    }
    const usernameOne = loginOne.username
    const userOne = await User.findOne({ username: `${usernameOne}` })
    const userForTokenOne = {
      username: userOne.username,
      id: userOne._id,
    }
    const tokenOne = jwt.sign(userForTokenOne, process.env.SECRET, { expiresIn: 60*60 })
    const newBlog = {
      title: "Your design code",
      author: "Lulu",
      url: "https://www.designcodes.com",
      likes: 20
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${tokenOne}`)
      .send(newBlog)
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[blogsAtStart.length-1]
    
    const loginTwo = {
      username: "root",
      password: "sekret"
    }
    const usernameTwo = loginTwo.username
    const userTwo = await User.findOne({ username: `${usernameTwo}` })
    const userForTokenTwo = {
      username: userTwo.username,
      id: userTwo._id,
    }
    const tokenTwo = jwt.sign(userForTokenTwo, process.env.SECRET, { expiresIn: 60*60 })
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${tokenTwo}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).toContain(blogToDelete.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})