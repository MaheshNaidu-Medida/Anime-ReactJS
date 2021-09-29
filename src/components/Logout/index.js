import './index.css'

const Logout = props => {
  const {onClickLogout} = props
  return (
    <button className="btn" type="button" onClick={onClickLogout}>
      Logout
    </button>
  )
}
export default Logout
