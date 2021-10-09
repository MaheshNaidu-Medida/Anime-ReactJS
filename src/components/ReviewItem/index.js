import {AiFillStar} from 'react-icons/ai'
import {MdDelete} from 'react-icons/md'

import './index.css'

const ReviewItem = props => {
  const {onDeleteReview, pin, each, fetchedData} = props

  const onClickDelete = () => onDeleteReview(pin)
  return (
    <li
      className="specific-anime-review-item-desktop"
      style={{
        borderColor: `${
          fetchedData.cover_color === undefined ||
          fetchedData.cover_color === ''
            ? 'violet'
            : fetchedData.cover_color
        }`,
      }}
    >
      <div className="specific-anime-review-item-first-desktop">
        <div className="specific-anime-review-item-detail-desktop">
          <AiFillStar className="specific-anime-review-rating-icon-desktop" />
          <p className="specific-anime-review-item-text-desktop">
            : {each.rating}
          </p>
        </div>
        <p className="specific-anime-review-item-text-desktop">
          <span
            className="specific-anime-review-item-spl-text-desktop"
            style={{
              color: `${
                fetchedData.cover_color === undefined ||
                fetchedData.cover_color === ''
                  ? 'violet'
                  : fetchedData.cover_color
              }`,
            }}
          >
            Review:{' '}
          </span>
          {each.review}
        </p>
      </div>
      <button
        type="button"
        onClick={onClickDelete}
        className="specific-anime-delete-button-desktop"
      >
        <MdDelete className="specific-anime-delete-icon-desktop" />
      </button>
    </li>
  )
}
export default ReviewItem
