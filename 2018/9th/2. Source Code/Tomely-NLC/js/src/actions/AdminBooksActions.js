import _ from "lodash";
import { Actions } from "react-native-router-flux";
import moment from "moment";
import Constants from "../views/Constants/constants";
import { getDatabase, getAuth } from "../../firebase";

import {
  ADMIN_BOOK_UPDATE,
  ADMIN_BOOK_CREATE,
  ALL_BOOKS_FETCH_SUCCESS,
  BOOKS_SAVE_SUCCESS,
  BOOKS_DUE_FOR_REMINDER
} from "./types";

export const fetchAllBooks = () => {
  const { currentUser } = getAuth();
  console.log("Inside fetchAllBooks()");

  return dispatch => {
    try {
      getDatabase()
        .ref(`/middletonhighschool/all_books`)
        .on("value", snapshot => {
          console.log(snapshot.val());
          const all_books = _.map(snapshot.val(), (val, uid) => {
            return { ...val, uid };
          });
          dispatch({ type: ALL_BOOKS_FETCH_SUCCESS, payload: all_books });
        });
    } catch (someError) {
      console.log("got some error: ", someError);
    }
  };
};

export const createBook = ({ value }) => {
  const { currentUser } = getAuth();

  console.log("Inside createBook (book): " + value);
  console.log("Inside createBook (author): " + value.author);
  console.log("Inside createBook (title): " + value.title);
  console.log("Inside createBook (created): " + value.created);

  return dispatch => {
    getDatabase()
      .ref(`/middletonhighschool/all_books`)
      .push({
        title: value.title,
        author: value.author,
        isbn: value.isbn,
        edition: value.edition,
        genre: value.genre,
        new_arrival: value.new_arrival,
        status: value.status,
        condition: value.condition,
        isle: value.isle,
        num_of_pages: value.num_of_pages,
        age_range: value.age_range,
        image_url: value.image_url,
        preview_url: value.preview_url,
        created: value.created,
        created_by: value.created_by,
        updated: value.updated,
        updated_by: value.updated_by
      })
      .then(() => {
        dispatch({ type: ADMIN_BOOK_CREATE, payload: value });
      });
  };
};

export const fetchBooksToSendReminders = () => {
  console.log("Inside fetchBooksToSendReminders");

  var userRef = getDatabase().ref("/middletonhighschool/users/");
  return dispatch => {
    userRef.on("value", snapshot => {
      var userWithBooksDue = [];
      snapshot.forEach(child => {
        var userProfile = "";
        var booksDue = [];
        child.forEach(node => {
          console.log("Node");
          if (node.key === "profile") {
            console.log("UserKey: " + child.key);
            userProfile = node.val();
            console.log(userProfile);
          }

          if (node.key === "books") {
            var books = node.val();
            console.log(books);

            _.map(books, (book, uid) => {
              console.log(uid);
              console.log(book);
              if (book.status === "BORROWED") {
                var maxReturnByDays = Constants.MAX_CHECKOUT_DAYS_STUDENT;

                if (userProfile.member_type !== "STUDENT") {
                  maxReturnByDays = Constants.MAX_CHECKOUT_DAYS_TEACHER;
                }

                var today = moment();
                var daysRemaining =
                  maxReturnByDays - today.diff(book.last_activity_date, "days");

                if (daysRemaining <= Constants.START_REMINDER_NOTIFICATIONS) {
                  booksDue.push(book);
                }
              }
            });
          }
        });

        if (booksDue.length > 0) {
          userWithBooksDue.push({
            userProfile: userProfile,
            booksDue: booksDue
          });
        }
      });

      dispatch({ type: BOOKS_DUE_FOR_REMINDER, payload: userWithBooksDue });
    });
  };
};
