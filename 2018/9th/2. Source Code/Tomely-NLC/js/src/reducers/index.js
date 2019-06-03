import { combineReducers } from "redux";
import AdminBooksReducer from "./AdminBooksReducer";
import BooksDueForReminder from "./BooksDueForReminder";
import UserReservedBooksReducer from "./UserReservedBooksReducer";
import UserBorrowedBooksReducer from "./UserBorrowedBooksReducer";
import UserProfileReducer from "./UserProfileReducer";
import AllUsersProfileReducer from "./AllUsersProfileReducer";
import UserBooksReducer from "./UserBooksReducer";
import UserBooksOverdueReducer from "./UserBooksOverdueReducer";
import BookReviewsReducer from "./BookReviewsReducer";
import GeorgeHsBooksReducer from "./GeorgeHsBooksReducer";
import GeorgeHsBooksReviewReducer from "./GeorgeHsBooksReviewReducer";

export default combineReducers({
  borrowed_books: UserBorrowedBooksReducer,
  reserved_books: UserReservedBooksReducer,
  profile: UserProfileReducer,
  all_books: AdminBooksReducer,
  books_due_for_reminder: BooksDueForReminder,
  all_georgehs_books: GeorgeHsBooksReducer,
  ghs_book_reviews: GeorgeHsBooksReviewReducer,
  all_user_profiles: AllUsersProfileReducer,
  user_books: UserBooksReducer,
  book_reviews: BookReviewsReducer,
  user_books_overdue: UserBooksOverdueReducer
});
