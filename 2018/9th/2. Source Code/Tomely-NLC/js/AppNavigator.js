import { StackNavigator } from "react-navigation";

import LoginScreen from "./src/views/LoginScreen";
import AdminScreens from "./src/views/AdminScreens";
import UserProfileDetailsAdmin from "./src/views/AdminScreens/UserProfileDetailsAdmin";
import UserBooksActivity from "./src/views/AdminScreens/UserBooksActivity";
import GuestBooksLongList from "./src/views/GuestScreens/GuestBooksLongList";
import GuestBooksCarousel from "./src/views/GuestScreens/GuestBooksCarousel";
import GuestBooksListView from "./src/views/GuestScreens/GuestBooksListView";
import GuestBookDetails from "./src/views/GuestScreens/GuestBookDetails";

import SchoolSelector from "./src/views/GuestScreens/SchoolSelector";
import RegisterNewUser from "./src/views/RegisterNewUser";

import ForgotPassword from "./src/views/ForgotPassword";
import Home from "./src/views/Home/";
import Faq from "./src/views/FAQ/";
import WebPage from "./src/views/WebPage";
import AddSocialIcons from "./src/views/WebPage/AddSocialIcons";

import About from "./src/views/About/";
import ContactUs from "./src/views/ContactUs/";
import UserHomeScreenTab from "./src/views/UserHomeScreenTab/";
import UserProfileDetails from "./src/views/UserHomeScreenTab/UserProfileDetails";
import UserBookDetails from "./src/views/LibraryBooksList/userBookDetails";
import UserBooksLongListView from "./src/views/LibraryBooksList/booksLongListView";
import BookDetails from "./src/views/LibraryBooksList/bookDetails";
import BookLocator from "./src/views/LibraryBooksList/bookLocator";
import BookReviews from "./src/views/LibraryBooksList/bookReviews";
import BooksCarouselView from "./src/views/LibraryBooksList/booksCarouselView";

const AppNavigator = StackNavigator(
  {
    Home: { screen: Home },
    WebPage: { screen: WebPage },
    AddSocialIcons: { screen: AddSocialIcons },
    LoginScreen: { screen: LoginScreen },
    AdminScreens: { screen: AdminScreens },
    UserProfileDetailsAdmin: { screen: UserProfileDetailsAdmin },
    UserBooksActivity: { screen: UserBooksActivity },
    GuestBooksLongList: { screen: GuestBooksLongList },
    GuestBooksCarousel: { screen: GuestBooksCarousel },
    GuestBooksListView: { screen: GuestBooksListView },
    GuestBookDetails: { screen: GuestBookDetails },

    SchoolSelector: { screen: SchoolSelector },
    RegisterNewUser: { screen: RegisterNewUser },
    ForgotPassword: { screen: ForgotPassword },
    About: { screen: About },
    FAQ: { screen: Faq },
    ContactUs: { screen: ContactUs },
    UserHomeScreenTab: { screen: UserHomeScreenTab },
    UserProfileDetails: { screen: UserProfileDetails },

    BookDetails: { screen: BookDetails },
    UserBookDetails: { screen: UserBookDetails },
    UserBooksLongListView: { screen: UserBooksLongListView },
    BookLocator: { screen: BookLocator },
    BookReviews: { screen: BookReviews },
    BooksCarouselView: { screen: BooksCarouselView }
  },
  {
    initialRouteName: "Home",
    headerMode: "none",
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    contentComponent: props => <Home {...props} />
  }
);

export default AppNavigator;
