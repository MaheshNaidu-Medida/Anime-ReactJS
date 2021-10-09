import {Redirect, Route} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = props => {
  const token = Cookies.get('ani_token')
  if (token === null || undefined) {
    return <Redirect to="/login" />
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Route {...props} />
}

export default ProtectedRoute
