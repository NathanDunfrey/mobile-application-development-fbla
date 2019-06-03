import { FETCH_BOOK_REVIEWS_GHS_SUCCESS } from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_BOOK_REVIEWS_GHS_SUCCESS:
      console.log("FETCH_BOOK_REVIEWS_GHS_SUCCESS: " + action.payload);
      return action.payload;

    default:
      return state;
  }
};
