import { BOOKS_DUE_FOR_REMINDER } from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BOOKS_DUE_FOR_REMINDER:
      console.log("BOOKS_DUE_FOR_REMINDER: action.payload");
      console.log(action.payload);
      return action.payload;
    default:
      return state;
  }
};
