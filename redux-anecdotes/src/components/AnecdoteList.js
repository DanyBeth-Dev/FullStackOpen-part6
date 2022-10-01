import React from 'react'
import { connect } from 'react-redux'
import { voteAsyncAction } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
  console.log(props)

  const voteAnecdote = async (id, content) => {
    props.voteAsyncAction(id)
    props.setNotification(`you voted '${content}'`, 10)
  }

  let anecdotesToShow = props.filter ? props.filter : props.anecdotes

  return (
    <div>
      <h2>Anecdotes</h2>
      {[...anecdotesToShow].sort((a, b) => b.votes - a.votes).map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>has {anecdote.votes}<button onClick={() => voteAnecdote(anecdote.id, anecdote.content)}>vote</button></div>
        </div>
      )}
    </div>
  )
}

// state.filter.length === 0 ? state.anecdotes : state.filter

const mapStateToProps = state => {
  if (state.filter.length === 0) {
    return { anecdotes: state.anecdotes }
  } else {
    return { filter: state.filter}
  }
}

const mapDispatchToProps = { voteAsyncAction, setNotification }

const ConnectedList = connect(mapStateToProps, mapDispatchToProps)(AnecdoteList)

export default ConnectedList