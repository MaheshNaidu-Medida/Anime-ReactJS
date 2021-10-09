import Loader from 'react-loader-spinner'
import './index.css'

const LoaderMain = () => (
  <div className="loader-container">
    <Loader type="BallTriangle" color="violet" height={60} width={60} />
  </div>
)
export default LoaderMain
