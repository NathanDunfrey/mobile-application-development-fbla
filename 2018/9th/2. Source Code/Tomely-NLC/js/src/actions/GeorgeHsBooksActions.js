import { getDatabase, getAuth } from "../../firebase";
import { Actions } from "react-native-router-flux";

import {
  ALL_GEORGEHS_BOOKS_FETCH_SUCCESS,
  FETCH_BOOK_REVIEWS_GHS_SUCCESS
} from "./types";

export const fetchAllGeorgeHighSchoolBooks = () => {
  const { currentUser } = getAuth;

  return dispatch => {
    getDatabase()
      .ref(`/georgehighschool/all_books`)
      .on("value", snapshot => {
        console.log(snapshot.val());
        const all_georgehs_books = _.map(snapshot.val(), (val, uid) => {
          return { ...val, uid };
        });
        dispatch({
          type: ALL_GEORGEHS_BOOKS_FETCH_SUCCESS,
          payload: all_georgehs_books
        });
      });
  };
};

export const fetchAllBookReviewsGHS = () => {
  return dispatch => {
    getDatabase()
      .ref(`/georgehighschool/book_reviews`)
      .on("value", snapshot => {
        console.log("fetchAllBookReviewsGHS()");
        console.log(snapshot.val());
        var reviewItems = [];

        snapshot.forEach(child => {
          reviewItems.push(child.val());
        });

        dispatch({
          type: FETCH_BOOK_REVIEWS_GHS_SUCCESS,
          payload: reviewItems
        });
      });
  };
};
