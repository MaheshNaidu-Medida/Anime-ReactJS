import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'

import './index.css'

const apiStatusConst = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const colorArray = [
  'violet',
  '#fbbf24',
  '#0aeaf2',
  '#6366f1',
  '#7f7bed',
  '#b14ae8',
  '#ed4ff0',
  '#f5384b',
  '#b6c5ff',
  '#ffffff',
  '#67f20a',
  '#31f738',
  '#0af282',
]

class Home extends Component {
  state = {
    apiStatus: apiStatusConst.loading,
    fetchedData: [],
    title: '',
    year: '',
    genres: [],
    description: '',
    reviewsList: [],
  }

  componentDidMount() {
    this.getAnimeApi()
  }

  getAnimeApi = async () => {
    const token = Cookies.get('ani_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const {title, description, year, genres} = this.state

    let url = `https://api.aniapi.com/v1/anime?`

    if (title !== '') {
      url += `title=${title}`
    }
    if (year !== '') {
      url += `&year=${year}`
    }
    if (genres.length !== 0) {
      url += `&genres=${genres.join('')}`
    }

    const response = await fetch(url, options)
    const responseData = await response.json()
    const reviewsList = await this.getReviewsListApi()

    if (response.ok) {
      const animeList = responseData.data.documents
      if (animeList !== undefined) {
        const finalList = animeList.filter(each => {
          if (
            each.descriptions.en !== undefined &&
            each.descriptions.en !== '' &&
            each.descriptions.en !== null &&
            each.descriptions.en
              .toLowerCase()
              .includes(description.toLowerCase())
          ) {
            return true
          }
          return false
        })
        this.setState({
          apiStatus: apiStatusConst.success,
          fetchedData: finalList,
          reviewsList,
        })
      } else {
        this.setState({
          apiStatus: apiStatusConst.success,
          fetchedData: [],
          reviewsList,
        })
      }
    } else {
      const code = response.status
      const failureMessage = this.getFailureMessage(code)

      this.setState({
        apiStatus: apiStatusConst.failure,
        failure: {code, failureMessage},
      })
    }
  }

  getReviewsListApi = async () => {
    const url = 'https://mahesh-anime.herokuapp.com/reviews'
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      return data
    }
    return []
  }

  getCurrentRating = id => {
    const {reviewsList} = this.state

    const finalList = reviewsList.filter(each => {
      if (each.id === id) {
        return true
      }
      return false
    })

    let totalRating = 0
    let avgRating = 'NA'

    if (finalList.length > 0) {
      finalList.forEach(each => {
        totalRating += each.rating
      })
      avgRating = Math.round(totalRating / reviewsList.length, 1)
    }
    return avgRating
  }

  getFailureMessage = code => {
    let msg = ''
    if (code === 404) {
      msg =
        "Sorry, seems our collection doesn't contain your requirement. Please check again"
    } else if (code === 400) {
      msg = 'Please check the details given'
    } else {
      msg = 'Sorry, the anime you requested are not found'
    }
    return msg
  }

  getFailureImageUrl = () => {
    const {failure} = this.state
    const {code} = failure
    let url = ''
    if (code === 400) {
      url = 'https://assets.ccbp.in/frontend/react-js/failure-img.png '
    } else if (code === 404) {
      url = 'https://assets.ccbp.in/frontend/react-js/no-jobs-img.png'
    } else {
      url =
        'https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png'
    }
    return url
  }

  getRandomColor = () => {
    const size = colorArray.length
    const index = Math.floor(Math.random() * size)
    const color = colorArray[index]
    return color
  }

  onClickLogout = () => {
    const {history} = this.props
    console.log(history)
    Cookies.remove('ani_token')
    history.replace('/login')
  }

  onChangeTitle = event => {
    this.setState({title: event.target.value})
  }

  onChangeYear = event => {
    this.setState({year: event.target.value})
  }

  onChangeGenre = event => {
    const array = event.target.value.split(',')
    this.setState({genres: array})
  }

  onChangeDescription = event => {
    this.setState({description: event.target.value})
  }

  onBlurInput = () => {
    this.setState({apiStatus: apiStatusConst.loading}, this.getAnimeApi)
  }

  renderFailure = () => {
    const {failure} = this.state
    const {failureMessage} = failure

    return (
      <div className="failure-container">
        <img
          src={this.getFailureImageUrl()}
          alt="failure"
          className="failure-image"
        />
        <h1 className="failure-text">{failureMessage}</h1>
      </div>
    )
  }

  renderAnime = eachAnime => {
    const {titles, descriptions, genres, id} = eachAnime
    const seasonYear = eachAnime.season_year
    const episodes = eachAnime.episodes_count
    const currentRating = this.getCurrentRating(id)
    const coverImage = eachAnime.cover_image
    const bannerImage = eachAnime.banner_image
    const engTitle = titles.en
    const japanTitle = titles.jp
    const italianTitle = titles.it
    const engDesc = descriptions.en
    const italianDesc = descriptions.it

    const color = this.getRandomColor()
    return (
      <Link to={`/specific-anime/${id}`} className="anime-link-item">
        <li
          key={id}
          className="anime-item"
          style={{border: `1px solid ${color}`}}
        >
          <div
            className="anime-header"
            style={{
              backgroundImage: `url(${
                bannerImage === undefined ||
                bannerImage === null ||
                bannerImage === ''
                  ? ''
                  : bannerImage
              })`,
            }}
          >
            <div className="anime-header-image-container">
              <img
                src={
                  coverImage === undefined ||
                  coverImage === null ||
                  coverImage === ''
                    ? ''
                    : coverImage
                }
                alt={engTitle}
                className="anime-header-image"
              />
            </div>
            <div className="anime-header-details">
              <p className="anime-title">
                {engTitle === undefined || engTitle === null
                  ? ''
                  : `${engTitle}`}
              </p>
              <p className="anime-title">
                {japanTitle === undefined || japanTitle === null
                  ? '  '
                  : ` ${japanTitle}`}
              </p>

              <p className="anime-title">
                {italianTitle === undefined || italianTitle === null
                  ? ''
                  : ` ${italianTitle}`}
              </p>

              <div className="rating-container">
                <AiFillStar className="anime-star-icon" />
                <p className="anime-rating">{currentRating}</p>
              </div>
            </div>
          </div>
          <div className="anime-details">
            <p className="anime-detail-text">
              Year:{' '}
              {seasonYear === undefined ||
              seasonYear === null ||
              seasonYear === ''
                ? '1997'
                : seasonYear}
            </p>

            <p className="anime-detail-text">
              Episodes:{' '}
              {episodes === undefined || episodes === null || episodes === ''
                ? '25'
                : episodes}
            </p>
          </div>

          <hr className="anime-rule" />
          <div className="anime-description-container">
            <p className="anime-description-heading">Description</p>
            <p className="anime-description-eng">
              <span className="anime-description-bold">English:</span>
              {engDesc === undefined || engDesc === '' || engDesc === null
                ? `   -- --`
                : engDesc}
            </p>
            <p className="anime-description-it">
              <span className="anime-description-bold">Italian:</span>{' '}
              {italianDesc === undefined ||
              italianDesc === '' ||
              italianDesc === null
                ? `   -- --`
                : italianDesc}
            </p>
          </div>
          <p className="anime-genre-heading">Genres</p>
          {genres !== undefined && genres.length !== 0 && genres !== null ? (
            <ul className="anime-genres-list">
              {genres.map(each => (
                <li
                  key={each}
                  className="anime-genre-item"
                  style={{border: `1px solid ${color}`, color: `${color}`}}
                >
                  {each}
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      </Link>
    )
  }

  renderContent = () => {
    const {fetchedData} = this.state
    return (
      <>
        <div className="anime-items-count-heading">
          <span className="anime-items-count">{fetchedData.length}</span> Anime
          Found
        </div>
        <ul className="anime-list">
          {fetchedData.map(eachAnime => this.renderAnime(eachAnime))}
        </ul>
      </>
    )
  }

  renderUI = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConst.loading:
        return (
          <div className="anime-loader-container-desktop">
            <Loader type="BallTriangle" color="violet" height={35} width={35} />
          </div>
        )
      case apiStatusConst.success:
        return this.renderContent()
      case apiStatusConst.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    const {title, description, year, genre} = this.state
    return (
      <div className="home-container">
        <div className="anime-logout-container">
          <img
            src="https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633769126/Anime/Anime%20Logout%20Logo/animelogout_ekty0k.png"
            alt="Logout"
            className="anime-logout-logo"
          />
          <button
            type="button"
            className="anime-logout-button"
            onClick={this.onClickLogout}
          >
            Logout
          </button>
        </div>

        <h1 className="home-heading">Welcome! Search for your Anime here</h1>
        <form className="user-inputs">
          <div className="inputs-container">
            <div className="inputs-sub-container">
              <label htmlFor="title" className="label">
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Title"
                value={title}
                onChange={this.onChangeTitle}
                onBlur={this.onBlurInput}
                className="anime-input"
                autoComplete="off"
              />
              <span className="anime-instruction-text">Example: Naruto</span>
            </div>
            <div className="inputs-sub-container">
              <label htmlFor="description" className="label">
                Description
              </label>
              <input
                id="description"
                type="text"
                placeholder="Description"
                value={description}
                onChange={this.onChangeDescription}
                onBlur={this.onBlurInput}
                className="anime-input"
                autoComplete="off"
              />
              <span className="anime-instruction-text">
                Example: The lord of Shimigami...
              </span>
            </div>
          </div>

          <div className="inputs-container">
            <div className="inputs-sub-container">
              <label htmlFor="genre" className="label">
                Genre
              </label>
              <input
                id="genre"
                type="text"
                placeholder="Genre"
                value={genre}
                onChange={this.onChangeGenre}
                onBlur={this.onBlurInput}
                className="anime-input"
                autoComplete="off"
              />
              <span className="anime-instruction-text">
                Example: Thriller, action,...
              </span>
            </div>
            <div className="inputs-sub-container">
              <label htmlFor="year" className="label">
                Year
              </label>
              <input
                id="year"
                type="number"
                placeholder="Year"
                value={year}
                onChange={this.onChangeYear}
                onBlur={this.onBlurInput}
                className="anime-input"
                autoComplete="off"
              />
              <span className="anime-instruction-text">Example: 1990</span>
            </div>
          </div>
        </form>
        <div className="home-content-container">{this.renderUI()}</div>
      </div>
    )
  }
}
export default Home
