import {AiFillStar} from 'react-icons/ai'
import './index.css'

const RatingStarItem = props => {
  const {onChangeAddReviewRating, currentRating, ratingItemValue} = props
  const onClickStarRating = () => onChangeAddReviewRating(ratingItemValue)
  const color = currentRating === ratingItemValue ? '#fbbf24' : '#181818'

  return (
    <li key={ratingItemValue} className="anime-star-rating-item">
      <button
        type="button"
        onClick={onClickStarRating}
        className="anime-star-rating-button"
      >
        <AiFillStar
          className="anime-star-rating-star"
          style={{color: `${color}`}}
        />
      </button>
    </li>
  )
}
export default RatingStarItem
