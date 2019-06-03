import { ALL_BOOKS_FETCH_SUCCESS, ADMIN_BOOK_CREATE } from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ALL_BOOKS_FETCH_SUCCESS:
      console.log("ALL_BOOKS_FETCH_SUCCESS: action.payload");
      console.log(action.payload);
      return action.payload;
    case ADMIN_BOOK_CREATE:
      return { ...state, book: action.payload };
    default:
      return state;
  }
};
