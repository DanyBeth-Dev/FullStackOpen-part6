import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: 'filter',
  initialState: [],
  reducers: {
    filterContent(state, action) {
      const {content, anecdotes} = action.payload
      let toPrint = anecdotes.filter(a => a.content.toUpperCase().includes(content))
      return toPrint.length > 0 ? toPrint : anecdotes
    }
  }
})

export const { filterContent } = filterSlice.actions
export default filterSlice.reducer