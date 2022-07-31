const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  } else if (blogs.length === 1) {
    return blogs[0].likes
  } else {
    total = 0;
    blogs.forEach(blog => {
      total += blog.likes
    })
    return total
  }
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  } else if (blogs.length === 1) {
    return blogs
  } else {
    const fav = Math.max(...blogs.map(b => b.likes))
    const favBlog = blogs.find(b => b.likes === fav)
    return favBlog;
  }
}

const mostBlogs = (listOfBlogs) => {
  const ordered = _.orderBy((_.values(_.groupBy(_.map(listOfBlogs, blog => blog.author))).map(d => ({author: d[0], blogs: d.length}))), 'blogs', 'desc')
  const author = ordered[0].author
  const blogs = ordered[0].blogs
  let result = { author, blogs }
  return result
}

const mostLikes = (blogs) => {
  const ordered = _.orderBy(blogs, 'likes', 'desc')
  const author = ordered[0].author
  const likes = ordered[0].likes
  const result = { author, likes }
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}