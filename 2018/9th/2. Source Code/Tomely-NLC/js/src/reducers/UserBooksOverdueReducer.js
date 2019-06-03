import {
  USER_BOOKS_OVERDUE
} from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_BOOKS_OVERDUE:
      console.log("USER_BOOKS_OVERDUE: action.payload");
      console.log(action.payload);
      return action.payload;
    default:
      return state;
  }
};
