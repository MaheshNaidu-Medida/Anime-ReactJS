import {Redirect, Route} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = props => {
  const {path, component} = props
  const token = Cookies.get('ani_token')
  if (token === null || token === undefined) {
    return <Redirect to="/login" />
  }

  return <Route exact path={path} component={component} />
}

export default ProtectedRoute
