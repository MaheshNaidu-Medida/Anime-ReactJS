import './index.css'

const Login = props => {
  const {onClickLogin} = props
  return (
    <button className="btn" type="button" onClick={onClickLogin}>
      Login
    </button>
  )
}
export default Login
