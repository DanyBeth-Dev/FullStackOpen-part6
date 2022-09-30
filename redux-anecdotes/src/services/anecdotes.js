import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const vote = async (id) => {
  let response = await axios.get(`${baseUrl}/${id}`)
  const object = response.data
  response = await axios.patch(`${baseUrl}/${id}`, {votes: object.votes + 1})
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, createNew, vote }