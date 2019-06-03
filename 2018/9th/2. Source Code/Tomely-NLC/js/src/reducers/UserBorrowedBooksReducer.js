import {
  USER_BORROWED_BOOKS_FETCH_SUCCESS
} from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_BORROWED_BOOKS_FETCH_SUCCESS:
      console.log("USER_BORROWED_BOOKS_FETCH_SUCCESS: action.payload");
      console.log(action.payload);
      return action.payload;
    default:
      return state;
  }
};
