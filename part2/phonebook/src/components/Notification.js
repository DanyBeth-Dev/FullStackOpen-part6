const Notification = ({ message, error }) => {
  if (!message) {
    return null
  }

  return (
    <div className={error ? 'error' : 'success'}>
      {message}
    </div>
  )
}

export default Notification;