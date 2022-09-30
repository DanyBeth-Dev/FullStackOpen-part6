import { useDispatch, useSelector } from "react-redux"
import { filterContent } from "../reducers/filterReducer"

const Filter = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)


  const handleChange = (event) => {
    const content = event.target.value.toUpperCase()
    dispatch(filterContent({content, anecdotes}))
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

export default Filter