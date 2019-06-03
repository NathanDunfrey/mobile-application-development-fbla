import {
  USER_PROFILE_FETCH_SUCCESS,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
  CREATE_USER_PROFILE_FAIL
} from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case USER_PROFILE_FETCH_SUCCESS:
      return action.payload;

    case CREATE_USER_SUCCESS:
      return { ...state, ...INITIAL_STATE, profile: action.payload };
    case CREATE_USER_FAIL:
      return {
        ...state,
        error: "Failed to create Signup user with email and password",
        password: "",
        loading: false
      };
    case CREATE_USER_PROFILE_FAIL:
      return {
        ...state,
        error: "Failed to create User Profile",
        password: "",
        loading: false
      };
    default:
      return state;
  }
};
