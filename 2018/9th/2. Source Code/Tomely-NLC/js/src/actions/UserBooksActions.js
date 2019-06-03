import { Actions } from "react-native-router-flux";
import Constants from "../views/Constants/constants";
import moment from "moment";
import { getDatabase, getAuth } from "../../firebase";

import {
  USER_RESERVED_BOOKS_FETCH_SUCCESS,
  USER_BORROWED_BOOKS_FETCH_SUCCESS,
  USER_BOOKS_FETCH_SUCCESS,
  USER_BOOKS_OVERDUE
} from "./types";

export const fetchBooksByUser = ({ user }) => {
  console.log("currentUser: " + user.uid);
  return dispatch => {
    getDatabase()
      .ref(`/middletonhighschool/users/${user.uid}/books`)
      .on("value", snapshot => {
        console.log(snapshot.val());
        dispatch({ type: USER_BOOKS_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const fetchReservedBooksByUser = () => {
  const { currentUser } = getAuth();
  console.log("currentUser: " + currentUser.uid);

  return dispatch => {
    getDatabase()
      .ref(`/middletonhighschool/users/${currentUser.uid}/books`)
      .orderByChild("status")
      .equalTo("RESERVED")
      .on("value", snapshot => {
        console.log(snapshot.val());
        const reserved_books = _.map(snapshot.val(), (val, uid) => {
          return { ...val, uid };
        });

        dispatch({
          type: USER_RESERVED_BOOKS_FETCH_SUCCESS,
          payload: reserved_books
        });
      });
  };
};

export const fetchBorrowedBooksByUser = () => {
  const { currentUser } = getAuth();
  console.log("currentUser: " + currentUser.uid);

  return dispatch => {
    getDatabase()
      .ref(`/middletonhighschool/users/${currentUser.uid}/books`)
      .orderByChild("status")
      .equalTo("BORROWED")
      .on("value", snapshot => {
        console.log(snapshot.val());
        const borrowed_books = _.map(snapshot.val(), (val, uid) => {
          return { ...val, uid };
        });

        dispatch({
          type: USER_BORROWED_BOOKS_FETCH_SUCCESS,
          payload: borrowed_books
        });
      });
  };
};

export const fetchOverdueBooksByUser = () => {
  console.log("Inside fetchOverdueBooksByUser");
  const { currentUser } = getAuth();

  return dispatch => {
    var booksOverDueArr = [];
    var userProfile = "";
    getDatabase()
      .ref(`/middletonhighschool/users/${currentUser.uid}/profile`)
      .once("value", snapshot => {
        console.log("Snapshot.val: " + snapshot.val());
        userProfile = snapshot.val();
      });

    getDatabase()
      .ref(`/middletonhighschool/users/${currentUser.uid}/books`)
      .orderByChild("status")
      .equalTo("BORROWED")
      .on("value", snapshot => {
        var books = snapshot.val();
        console.log(books);

        _.map(books, (book, uid) => {
          console.log(uid);
          console.log(book);

          var maxReturnByDays = Constants.MAX_CHECKOUT_DAYS_STUDENT;

          if (userProfile.member_type !== "STUDENT") {
            maxReturnByDays = Constants.MAX_CHECKOUT_DAYS_TEACHER;
          }

          var today = moment();
          var daysRemaining =
            maxReturnByDays - today.diff(book.last_activity_date, "days");

          if (daysRemaining < 0) {
            booksOverDueArr.push(book);
          }
        });
        dispatch({ type: USER_BOOKS_OVERDUE, payload: booksOverDueArr });
      });
  };
};
