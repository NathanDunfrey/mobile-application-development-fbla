import { FETCH_BOOK_REVIEWS_SUCCESS } from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_BOOK_REVIEWS_SUCCESS:
      console.log("FETCH_BOOK_REVIEWS_SUCCESS: action.payload");
      return { book_reviews: action.payload };

    default:
      return state;
  }
};
