import { connect } from "react-redux"
import { filterContent } from "../reducers/filterReducer"

const Filter = (props) => {
  console.log(props)
  let anecdotes = [...props.anecdotes]

  const handleChange = (event) => {
    const content = event.target.value.toUpperCase()
    props.filterContent({content, anecdotes})
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input id="myInput" onChange={handleChange} />
    </div>
  )
}

const mapStateToProps = state => {
  return { anecdotes: state.anecdotes }
}

const mapDispatchToProps = { filterContent }

const ConnectedFilter = connect(mapStateToProps, mapDispatchToProps)(Filter)

export default ConnectedFilter