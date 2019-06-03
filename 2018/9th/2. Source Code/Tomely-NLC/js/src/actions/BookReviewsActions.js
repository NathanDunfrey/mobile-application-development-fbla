import { getDatabase } from "../../firebase";
import { Actions } from "react-native-router-flux";

import { FETCH_BOOK_REVIEWS_SUCCESS } from "./types";

export const fetchAllBookReviews = () => {
  return dispatch => {
    getDatabase()
      .ref(`/middletonhighschool/book_reviews`)
      .on("value", snapshot => {
        console.log("FETCH_BOOK_REVIEWS_SUCCESS");
        console.log(snapshot.val());
        var reviewItems = [];

        snapshot.forEach(child => {
          reviewItems.push(child.val());
        });

        dispatch({ type: FETCH_BOOK_REVIEWS_SUCCESS, payload: reviewItems });
      });
  };
};
