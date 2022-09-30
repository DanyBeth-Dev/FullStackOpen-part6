import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteAsyncAction } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()

  let anecdotes = useSelector(({anecdotes, filter}) => filter.length === 0 ? anecdotes : filter)

  const voteAnecdote = async (id, content) => {
    dispatch(voteAsyncAction(id))
    dispatch(setNotification(`you voted '${content}'`, 10))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {[...anecdotes].sort((a, b) => b.votes - a.votes).map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>has {anecdote.votes}<button onClick={() => voteAnecdote(anecdote.id, anecdote.content)}>vote</button></div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList