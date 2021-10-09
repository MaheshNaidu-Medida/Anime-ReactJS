import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {v4 as uuidv4} from 'uuid'
import Loader from 'react-loader-spinner'
import {FaCalendarDay} from 'react-icons/fa'
import {IoArrowBack} from 'react-icons/io5'
import {AiFillStar} from 'react-icons/ai'

import ReviewItem from '../ReviewItem'

import RatingStarItem from '../RatingStarItem'

import LoaderMain from '../LoaderMain'

import './index.css'

const apiStatusConst = {
  loading: 'API_LOADING',
  success: 'API_SUCCESS',
  failure: 'API_FAILURE',
}

const reviewsStatusConst = {
  initial: 'INITIAL',
  loading: 'API_LOADING',
  success: 'API_SUCCESS',
  failure: 'API_FAILURE',
}

const addReviewResultConst = {
  success: 'Review added successfully',
  failure: 'Review not added',
}

const deleteReviewResultConst = {
  success: 'Review deleted successfully',
  failure: 'Review not deleted',
}

const ratingStarList = [1, 2, 3, 4, 5]

class AnimeItem extends Component {
  state = {
    apiStatus: apiStatusConst.loading,
    fetchedData: {},
    failure: {},
    reviewsList: [],
    addReviewReview: '',
    addReviewRating: '',
    displayAddItem: false,
    errorMsg: '',
    errorMsgDisplay: false,
    reviewsDisplay: reviewsStatusConst.initial,
    addReviewResult: '',
    deleteReviewResult: '',
  }

  componentDidMount() {
    this.getSpecificAnimeApi()
  }

  getSpecificAnimeApi = async () => {
    const token = Cookies.get('ani_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://api.aniapi.com/v1/anime/${id}`

    const response = await fetch(url, options)
    const fetchedData = await response.json()
    const reviewsList = await this.getReviewsListApi()

    if (response.ok) {
      if (fetchedData !== undefined) {
        this.setState({
          apiStatus: apiStatusConst.success,
          fetchedData: fetchedData.data,
          reviewsList,
        })
      } else {
        this.setState({
          apiStatus: apiStatusConst.success,
          fetchedData: {},
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

  addReviewApi = async () => {
    const {addReviewRating, addReviewReview} = this.state
    const {match} = this.props
    const {params} = match
    const {id} = params
    const pin = uuidv4()

    const reviews = {
      review: addReviewReview,
      rating: addReviewRating,
      pin,
      id,
    }

    const requestBody = {
      reviews,
    }

    const url = `https://mahesh-anime.herokuapp.com/create-review/`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
    const response = await fetch(url, options)
    const reviewsList = await this.getReviewsListApi()
    if (response.ok) {
      this.setState({
        reviewsDisplay: reviewsStatusConst.success,
        reviewsList,
        addReviewResult: addReviewResultConst.success,
      })
    } else {
      this.setState({
        reviewsDisplay: reviewsStatusConst.success,
        reviewsList,
        addReviewResult: addReviewResultConst.failure,
      })
    }
  }

  deleteReviewApi = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const {currentPin} = this.state

    const item = {
      id,
      pin: currentPin,
    }

    const requestBody = {
      item,
    }

    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
    const url = 'https://mahesh-anime.herokuapp.com/delete-review/'
    const response = await fetch(url, options)
    const reviewsList = await this.getReviewsListApi()
    console.log(reviewsList)
    if (response.ok) {
      this.setState({
        reviewsDisplay: reviewsStatusConst.success,
        reviewsList,
        deleteReviewResult: deleteReviewResultConst.success,
      })
    } else {
      this.setState({
        reviewsDisplay: reviewsStatusConst.success,
        reviewsList,
        deleteReviewResult: deleteReviewResultConst.failure,
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
    let totalRating = 0
    let avgRating = 'NA'
    if (reviewsList.length > 0) {
      reviewsList.filter(each => {
        if (each.id === id) {
          return true
        }
        return false
      })
    }
    if (reviewsList.length > 0) {
      reviewsList.forEach(each => {
        totalRating += each.rating
      })
      avgRating = Math.round(totalRating / reviewsList.length, 1)
    }
    return avgRating
  }

  getFailureMessage = code => {
    let msg = ''
    if (code === 404) {
      msg = 'Anime Not Found'
    } else if (code === 400) {
      msg = 'Anime ID is incorrect'
    } else {
      msg = 'Anime Not Found'
    }
    return msg
  }

  getFailureImageUrl = () => {
    const {failure} = this.state
    const {code} = failure
    let url = ''
    if (code === 400) {
      url = ''
    } else if (code === 404) {
      url = ''
    } else {
      url = ''
    }
    return url
  }

  getUpdatedDate = date => {
    const newDate = new Date(date)
    const year = newDate.getFullYear()
    const month = newDate.getMonth()
    const day = newDate.getDate()
    return `${day}-${month}-${year}`
  }

  onChangeAddReview = event => {
    this.setState({addReviewReview: event.target.value})
  }

  onChangeAddReviewRating = rating => {
    console.log(rating)
    this.setState({addReviewRating: rating})
  }

  onClickAddReview = () => {
    const {addReviewRating} = this.state
    if (addReviewRating >= 1 && addReviewRating <= 5) {
      this.setState(
        {
          displayAddItem: false,
          errorMsgDisplay: false,
          errorMsg: '',
          addReviewResult: '',
          deleteReviewResult: '',
          reviewsDisplay: reviewsStatusConst.loading,
        },
        this.addReviewApi,
      )
    } else {
      this.setState({
        displayAddItem: true,
        errorMsg: 'Please add valid rating',
        errorMsgDisplay: true,
      })
    }
  }

  onDeleteReview = pin => {
    this.setState(
      {
        reviewsDisplay: reviewsStatusConst.loading,
        addReviewResult: '',
        deleteReviewResult: '',
        currentPin: pin,
      },
      this.deleteReviewApi,
    )
  }

  onClickAddReviews = () => {
    this.setState(preState => ({
      displayAddItem: !preState.displayAddItem,
      addReviewResult: '',
      deleteReviewResult: '',
      errorMsgDisplay: false,
      errorMsg: '',
      addReviewRating: '',
      addReviewReview: '',
    }))
  }

  renderFailure = () => {
    const {failure} = this.state
    const {failureMessage} = failure

    return (
      <div className="specific-anime-failure-container">
        <img
          src={this.getFailureImageUrl()}
          alt="failure"
          className="specific-anime-failure-image"
        />
        <h1 className="specific-anime-failure-text">{failureMessage}</h1>
      </div>
    )
  }

  renderNoData = () => (
    <div className="specific-anime-no-data-container">
      <img src="" alt="failure" className="specific-anime-failure-image" />
      <h1 className="specific-anime-failure-text">No Anime Details Found</h1>
    </div>
  )

  renderContent = () => {
    const {
      fetchedData,
      reviewsList,
      addReviewRating,
      addReviewReview,
      displayAddItem,
      errorMsgDisplay,
      errorMsg,
      reviewsDisplay,
      addReviewResult,
      deleteReviewResult,
      currentPin,
    } = this.state

    if (fetchedData === {}) {
      return this.renderNoData()
    }
    let id = 1
    if (fetchedData.id !== undefined) {
      id = fetchedData.id
    }

    const currentRating = this.getCurrentRating(id)

    return (
      <div
        className="specific-anime-card-desktop"
        style={{
          border: `1px solid ${
            fetchedData.cover_color === undefined
              ? 'grey'
              : fetchedData.cover_color
          }`,
        }}
      >
        <div
          className="specific-anime-header-desktop"
          style={{
            backgroundImage: `url(${
              fetchedData.banner_image === undefined
                ? ''
                : fetchedData.banner_image
            })`,
            backgroundSize: 'cover',
          }}
        >
          <div className="specific-anime-header-titles-container">
            {fetchedData.titles === undefined || fetchedData.titles === '' ? (
              ''
            ) : (
              <h1 className="specific-anime-title-desktop">
                {fetchedData.titles.en === undefined ||
                fetchedData.titles.en === ''
                  ? ''
                  : fetchedData.titles.en}
              </h1>
            )}
            {fetchedData.titles === undefined || fetchedData.titles === '' ? (
              ''
            ) : (
              <h1 className="specific-anime-title-desktop">
                {fetchedData.titles.jp === undefined ||
                fetchedData.titles.jp === ''
                  ? ''
                  : fetchedData.titles.jp}
              </h1>
            )}
            {fetchedData.titles === undefined || fetchedData.titles === '' ? (
              ''
            ) : (
              <h1 className="specific-anime-title-desktop">
                {fetchedData.titles.it === undefined ||
                fetchedData.titles.it === ''
                  ? ''
                  : fetchedData.titles.it}
              </h1>
            )}
          </div>

          {fetchedData.cover_image === '' ||
          fetchedData.cover_image === undefined ? (
            <div className="specific-anime-no-cover-container-desktop">
              <img
                src="https://res.cloudinary.com/maheshnaiducloudinary/image/upload/v1633460635/Anime/anime_cover_logo_fx5oe4.png"
                alt="anime cover"
                className="specific-anime-no-image-logo-desktop"
              />
            </div>
          ) : (
            <div className="specific-anime-cover-container-desktop">
              <img
                src={fetchedData.cover_image}
                alt="anime cover"
                className="specific-anime-cover-image-desktop"
              />
            </div>
          )}
        </div>
        <div className="specific-anime-body-desktop">
          <div className="specific-anime-header-details-a-desktop">
            <div className="specific-anime-header-details-b-desktop">
              <div className="specific-anime-rating-year-desktop">
                <FaCalendarDay className="specific-anime-calendar-icon-desktop" />
                <p className="specific-anime-header-text-desktop">
                  {fetchedData.season_year === undefined ||
                  fetchedData.season_year === ''
                    ? '1995'
                    : fetchedData.season_year}
                </p>
              </div>
              <div className="specific-anime-rating-year-desktop">
                <AiFillStar className="specific-anime-rating-icon-desktop" />
                <p className="specific-anime-header-text-desktop">
                  {currentRating}
                </p>
              </div>
            </div>
            <div className="specific-anime-header-details-b-desktop">
              <p className="specific-anime-header-text-desktop">
                <span
                  className="specific-anime-header-text-spl-desktop"
                  style={{
                    color: `${
                      fetchedData.cover_color === undefined
                        ? 'violet'
                        : fetchedData.cover_color
                    }`,
                  }}
                >
                  Aired from
                </span>
                {fetchedData.start_date === undefined
                  ? ` 12 Nov 1997 `
                  : `  ${this.getUpdatedDate(fetchedData.start_date)}  `}
                <span
                  className="specific-anime-header-text-spl-desktop"
                  style={{
                    color: `${
                      fetchedData.cover_color === undefined
                        ? 'violet'
                        : fetchedData.cover_color
                    }`,
                  }}
                >
                  to
                </span>
                {fetchedData.end_date === undefined
                  ? ` 15 Sep 2001`
                  : `  ${this.getUpdatedDate(fetchedData.end_date)} `}
              </p>
            </div>
            <div className="specific-anime-header-details-b-desktop">
              <p className="specific-anime-header-text-desktop">
                <span
                  className="specific-anime-header-text-spl-desktop"
                  style={{
                    color: `${
                      fetchedData.cover_color === undefined
                        ? 'violet'
                        : fetchedData.cover_color
                    }`,
                  }}
                >
                  Episodes:{' '}
                </span>
                {fetchedData.episodes_count === undefined ||
                fetchedData.episodes_count === ''
                  ? '5'
                  : fetchedData.episodes_count}
              </p>
              <p className="specific-anime-header-text-desktop">
                <span
                  className="specific-anime-header-text-spl-desktop"
                  style={{
                    color: `${
                      fetchedData.cover_color === undefined
                        ? 'violet'
                        : fetchedData.cover_color
                    }`,
                  }}
                >
                  Episode Duration:{' '}
                </span>
                {fetchedData.episode_duration === undefined ||
                fetchedData.episode_duration === ''
                  ? '25 mins'
                  : `${fetchedData.episode_duration} mins`}
              </p>
            </div>
          </div>
          <hr className="specific-anime-rule" />
          <h1
            className="specific-anime-heading-desktop"
            style={{
              color: `${
                fetchedData.cover_color === undefined
                  ? 'violet'
                  : fetchedData.cover_color
              }`,
            }}
          >
            Description
          </h1>
          {fetchedData.descriptions === undefined ? null : (
            <p className="specific-anime-text-desktop">
              <span className="specific-anime-text-spl-desktop">English: </span>
              {fetchedData.descriptions.en === undefined ||
              fetchedData.descriptions.en === ''
                ? 'NA'
                : fetchedData.descriptions.en}
            </p>
          )}
          {fetchedData.descriptions === undefined ||
          fetchedData.descriptions === '' ? null : (
            <p className="specific-anime-text-desktop">
              <span className="specific-anime-text-spl-desktop">Italic: </span>
              {fetchedData.descriptions.it === undefined ||
              fetchedData.descriptions.it === ''
                ? 'NA'
                : fetchedData.descriptions.it}
            </p>
          )}
          <h1
            className="specific-anime-heading-desktop"
            style={{
              color: `${
                fetchedData.cover_color === undefined
                  ? 'violet'
                  : fetchedData.cover_color
              }`,
            }}
          >
            Genre
          </h1>
          {fetchedData.genres === undefined || fetchedData.genres === [] ? (
            <ul
              className="specific-anime-genre-list-desktop"
              style={{
                color: `${
                  fetchedData.cover_color === undefined
                    ? 'violet'
                    : fetchedData.cover_color
                }`,
              }}
            >
              <li key="1" className="specific-playlist-genre-item-desktop">
                Action
              </li>
              <li key="2" className="specific-playlist-genre-item-desktop">
                Thriller
              </li>
              <li key="3" className="specific-playlist-genre-item-desktop">
                Drama
              </li>
              <li key="4" className="specific-playlist-genre-item-desktop">
                Love
              </li>
              <li key="5" className="specific-playlist-genre-item-desktop">
                Mystery
              </li>
            </ul>
          ) : (
            <ul className="specific-anime-genre-list-desktop">
              {fetchedData.genres.map(each => (
                <li
                  key={each}
                  className="specific-playlist-genre-item-desktop"
                  style={{
                    color: `${
                      fetchedData.cover_color === undefined
                        ? 'violet'
                        : fetchedData.cover_color
                    }`,
                    borderColor: `${
                      fetchedData.cover_color === undefined
                        ? 'violet'
                        : fetchedData.cover_color
                    }`,
                  }}
                >
                  {each}
                </li>
              ))}
            </ul>
          )}
          <div className="specific-anime-add-review-heading-button-desktop">
            <h1
              className="specific-anime-heading-desktop"
              style={{
                color: `${
                  fetchedData.cover_color === undefined
                    ? 'violet'
                    : fetchedData.cover_color
                }`,
              }}
            >
              Reviews
            </h1>
            <button
              type="button"
              className="specific-anime-add-reviews-button-desktop"
              onClick={this.onClickAddReviews}
              style={{
                color: `${
                  fetchedData.cover_color === undefined
                    ? 'violet'
                    : fetchedData.cover_color
                }`,
                borderColor: `${
                  fetchedData.cover_color === undefined
                    ? 'violet'
                    : fetchedData.cover_color
                }`,
              }}
            >
              Add Reviews
            </button>
          </div>
          {displayAddItem ? (
            <div className="specific-anime-add-review-container-desktop">
              <div className="specific-anime-add-review-detail-desktop">
                <label
                  htmlFor="rating"
                  className="specific-anime-add-review-label-desktop"
                >
                  Rating:
                </label>
                <div className="specific-anime-add-review-input-container-desktop">
                  <ul className="specific-anime-add-review-stars-list">
                    {ratingStarList.map(each => (
                      <RatingStarItem
                        onChangeAddReviewRating={this.onChangeAddReviewRating}
                        currentRating={addReviewRating}
                        ratingItemValue={each}
                      />
                    ))}
                  </ul>
                  {errorMsgDisplay ? (
                    <span className="specific-anime-add-review-error-text-desktop">
                      *{errorMsg}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="specific-anime-add-review-detail-desktop">
                <label
                  htmlFor="review"
                  className="specific-anime-add-review-label-desktop"
                >
                  Review:
                </label>
                <textarea
                  id="review"
                  rows="10"
                  cols="70"
                  placeholder="Add Review"
                  className="specific-anime-add-review-review-input-desktop"
                  value={addReviewReview}
                  onChange={this.onChangeAddReview}
                  style={{
                    color: `${
                      fetchedData.cover_color === undefined
                        ? 'violet'
                        : fetchedData.cover_color
                    }`,
                    borderColor: `${
                      fetchedData.cover_color === undefined
                        ? 'violet'
                        : fetchedData.cover_color
                    }`,
                  }}
                />
              </div>
              <button
                type="button"
                onClick={this.onClickAddReview}
                className="specific-anime-add-review-btn-desktop"
                style={{
                  backgroundColor: `${
                    fetchedData.cover_color === undefined ||
                    fetchedData.cover_color === ''
                      ? 'violet'
                      : fetchedData.cover_color
                  }`,
                }}
              >
                Add Review
              </button>
            </div>
          ) : null}
          {reviewsDisplay === reviewsStatusConst.loading ? (
            <div className="specific-anime-loader-container-desktop">
              <Loader
                type="BallTriangle"
                color={
                  fetchedData.cover_color === undefined ||
                  fetchedData.cover_color === ''
                    ? 'violet'
                    : fetchedData.cover_color
                }
                height={30}
                width={30}
              />
            </div>
          ) : (
            <>
              {addReviewResult === '' ? null : (
                <>
                  {addReviewResult === addReviewResultConst.success ? (
                    <p
                      className="specific-anime-add-review-error-text-desktop"
                      style={{
                        textAlign: 'center',
                        width: '100%',
                        color: 'green',
                      }}
                    >
                      {addReviewResult}
                    </p>
                  ) : (
                    <p
                      className="specific-anime-add-review-error-text-desktop"
                      style={{textAlign: 'center', width: '100%'}}
                    >
                      * {addReviewResultConst.failure}
                    </p>
                  )}
                </>
              )}

              {deleteReviewResult === '' ? null : (
                <>
                  {deleteReviewResult === deleteReviewResultConst.success ? (
                    <p
                      className="specific-anime-add-review-error-text-desktop"
                      style={{
                        textAlign: 'center',
                        width: '100%',
                        color: 'green',
                      }}
                    >
                      {deleteReviewResult}
                    </p>
                  ) : (
                    <p
                      className="specific-anime-add-review-error-text-desktop"
                      style={{textAlign: 'center', width: '100%'}}
                    >
                      * {deleteReviewResultConst.failure}
                    </p>
                  )}
                </>
              )}
              <ul className="specific-anime-reviews-container-desktop">
                {reviewsList.length === 0 ? (
                  <p
                    className="specific-anime-no-reviews-text-desktop"
                    style={{
                      color: `${
                        fetchedData.cover_color === undefined ||
                        fetchedData.cover_color === ''
                          ? 'violet'
                          : fetchedData.cover_color
                      }`,
                    }}
                  >
                    No Reviews Found
                  </p>
                ) : (
                  reviewsList.reverse().map(each => {
                    const onClickDelete = () => this.onDeleteReview(each.pin)
                    return (
                      <ReviewItem
                        key={each.pin}
                        onDeleteReview={onClickDelete}
                        pin={currentPin}
                        each={each}
                        fetchedData={fetchedData}
                      />
                    )
                  })
                )}
              </ul>
            </>
          )}
        </div>
      </div>
    )
  }

  renderUI = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConst.loading:
        return <LoaderMain />
      case apiStatusConst.success:
        return this.renderContent()
      case apiStatusConst.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="specific-anime-bg-container">
        <Link to="/" className="specific-anime-back-btn">
          <IoArrowBack className="specific-anime-arrow" />
          <p className="specific-anime-back-text">Back</p>
        </Link>
        {this.renderUI()}
      </div>
    )
  }
}

export default AnimeItem
