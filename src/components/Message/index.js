import './index.css'

const Message = props => {
  const {isLoggedIn} = props
  return isLoggedIn ? (
    <h1 className="heading">Welcome User</h1>
  ) : (
    <h1 className="heading">Please Login</h1>
  )
}

export default Message
