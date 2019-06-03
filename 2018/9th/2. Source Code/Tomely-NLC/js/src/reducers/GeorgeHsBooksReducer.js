import { ALL_GEORGEHS_BOOKS_FETCH_SUCCESS } from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ALL_GEORGEHS_BOOKS_FETCH_SUCCESS:
      console.log("ALL_GEORGEHS_BOOKS_FETCH_SUCCESS: " + action.payload);
      console.log(action.payload);
      return action.payload;

    default:
      return state;
  }
};
