import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const loginWallPaperURLList = [
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633768933/Anime/Anime%20Login%20Wallpapers/wallpaper1_yvhzfy.png',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633768938/Anime/Anime%20Login%20Wallpapers/wallpaper2_rmxt4c.png',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633768944/Anime/Anime%20Login%20Wallpapers/wallpaper3_nu9x5f.png',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633768949/Anime/Anime%20Login%20Wallpapers/wallpaper4_wa4u3n.png',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633768954/Anime/Anime%20Login%20Wallpapers/wallpaper5_zmved1.jpg',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633768974/Anime/Anime%20Login%20Wallpapers/wallpaper7_xpdahf.jpg',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633769303/Anime/Anime%20Login%20Wallpapers/wallpaper10_wp5udg.png',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633770291/Anime/Anime%20Login%20Wallpapers/wallpaper11_orcqha.jpg',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633770300/Anime/Anime%20Login%20Wallpapers/wallpaper12_qbbp4f.png',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633770378/Anime/Anime%20Login%20Wallpapers/wallpaper13_odogp4.png',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633770304/Anime/Anime%20Login%20Wallpapers/wallpaper14_hgzdlq.jpg',
]

const loginLogoList = [
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633768779/Anime/Anime%20Login%20Logos/anime2_pbnrzz.png',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633768781/Anime/Anime%20Login%20Logos/anime3_ky1mma.png',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633768782/Anime/Anime%20Login%20Logos/anime4_rvuh8k.png',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633768806/Anime/Anime%20Login%20Logos/anime5_rtbdqo.png',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633770795/Anime/Anime%20Login%20Logos/anime6_gjqym9.png',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633770797/Anime/Anime%20Login%20Logos/anime7_wvj3sr.png',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633770803/Anime/Anime%20Login%20Logos/anime10_g1wxgy.png',
  'https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633770809/Anime/Anime%20Login%20Logos/anime13_vgj0f8.png',
]

class Login extends Component {
  componentDidMount() {
    // NOTE: We wrote this code here because we kept redirect URL as login route, if you give a different route, make sure to move this code to the respective route or App.js

    const hashKey = this.getHashKeyFromLocationAfterLogin()

    if (hashKey.access_token) {
      this.postHashKeyAsMessage(hashKey)
    }

    this.getMessageAndsetAccessTokenInCookies()
  }

  getHashKeyFromLocationAfterLogin = () => {
    const {location} = this.props
    const {hash} = location
    const hashKey = {}
    const queryParams = new URLSearchParams(window.location.search)
    const error = queryParams.get('error')

    if (error === 'access_denied') {
      window.close()
    }

    hash
      .replace(/^#\/?/, '')
      .split('&')
      .forEach(keyValue => {
        const spl = keyValue.indexOf('=')
        if (spl !== -1) {
          hashKey[keyValue.substring(0, spl)] = keyValue.substring(spl + 1)
        }
      })
    return hashKey
  }

  postHashKeyAsMessage = hashKey => {
    window.opener.postMessage(
      JSON.stringify({
        type: 'access_token',
        access_token: hashKey.access_token,
        expires_in: hashKey.expires_in || 0,
      }),
      '*',
    )
    window.close()
  }

  getMessageAndsetAccessTokenInCookies = () => {
    window.addEventListener(
      'message',
      event => {
        const hash = JSON.parse(event.data)
        if (hash.type === 'access_token') {
          Cookies.set('ani_token', hash.access_token, {
            expires: 30,
          })
          window.location.replace('/')
        }
      },
      false,
    )
  }

  isDevelopmentEnvironment = () => {
    if (
      process.env.NODE_ENV === 'development' ||
      window.location.hostname === 'localhost'
    ) {
      return true
    }
    return false
  }

  getRedirectURL = () => {
    if (this.isDevelopmentEnvironment()) {
      /* ADD THIS URL to your Application Redirect URIs to redirect after authentication success OR failure */
      return 'http://localhost:3000/login'
    }
    /* Change this redirectURL accordingly before publishing your project and ADD THIS URL to your Application Redirect URIs to redirect after authentication success OR failure */
    return 'https://maheshanime.ccbp.tech/login'
  }

  openLoginModal = () => {
    // YOU NEED TO ADD YOUR CLIENT ID HERE
    const clientId = '6e019026-f02e-4722-9580-38abbdec02bf'

    const redirectUrl = this.getRedirectURL()

    const url = `https://api.aniapi.com/v1/oauth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUrl}&state=ANI_AUTHENTICATION`

    const width = 450
    const height = 730
    const left = window.innerWidth / 2 - width / 2
    const top = window.innerHeight / 2 - height / 2

    window.open(
      url,
      'Anime',
      `menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=${width}, height = ${height}, top = ${top}, left = ${left}`,
    )
  }

  submitForm = async event => {
    event.preventDefault()
    this.openLoginModal()
  }

  render() {
    const wallpaperIndex = Math.floor(
      Math.random() * loginWallPaperURLList.length,
    )
    const logoIndex = Math.floor(Math.random() * loginLogoList.length)

    const wallpaperURL = loginWallPaperURLList[wallpaperIndex]
    const logoURL = loginLogoList[logoIndex]

    const token = Cookies.get('ani_token')
    if (token === undefined || token === null) {
      return (
        <div
          className="login-form-container"
          style={{
            backgroundImage: `url(${wallpaperURL})`,
          }}
        >
          <form className="form-container" onSubmit={this.submitForm}>
            <img
              src={logoURL}
              className="login-website-logo-desktop-image"
              alt="website logo"
            />
            <button type="submit" className="login-button">
              LOG IN/SIGN UP
            </button>
          </form>
        </div>
      )
    }
    return <Redirect to="/" />
  }
}

export default Login
