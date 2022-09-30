import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: [],
  reducers: {
    setMessage(state, action) {
      const content = action.payload
      return [content]
    },
    removeNotification(state, action) {
      return []
    }
  }
})

export const { setMessage, removeNotification } = notificationSlice.actions

export const setNotification = (content, time) => {
  return async dispatch => {
    dispatch(setMessage(content))
    setTimeout(() => {
      dispatch(removeNotification())
    }, time*1000)
  }
}

export default notificationSlice.reducer