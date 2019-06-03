import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Alert,
  ListView,
  View,
  ScrollView,
  TextInput,
  Modal,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import FastImage from "react-native-fast-image";

import { fetchAllBooks } from "../../actions";
import { fetchAllBookReviews } from "../../actions";
import { fetchOverdueBooksByUser } from "../../actions";

import {
  sendCheckedOutEmail,
  sendBookReservedEmail
} from "../EmailNotifications";

import styles from "./styles";
import BookDetails from "./bookDetails";
import BookLocator from "./bookLocator";
import BookReviews from "./bookReviews";

import moment from "moment";
import { getDatabase, getAuth } from "../../../firebase";

import {
  Container,
  Header,
  Title,
  Subtitle,
  Content,
  Button,
  Icon,
  List,
  Card,
  CardItem,
  ListItem,
  Text,
  Item,
  Input,
  Thumbnail,
  Left,
  Body,
  Right,
  InputGroup,
  StyleProvider
} from "native-base";

const deviceWidth = Dimensions.get("window").width;

class LibraryBooksList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      ModalVisibleStatus: false,
      selectedBook: null,
      btnViewMapSelected: false,

      bookReviews: [],

      bookCoverImage:
        "https://heidicvlach.files.wordpress.com/2012/11/notfound.png",

      query: ""
    };
  }

  ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: visible });
  }

  componentWillMount() {
    this.setState({
      query: ""
    });
    this.props.fetchAllBooks();
    this.createDataSource(this.props);
    this.props.fetchAllBookReviews();
    this.props.fetchOverdueBooksByUser();
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    this.createDataSource(nextProps);
  }

  createDataSource({ all_books }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(all_books);
  }

  findBook(query) {
    if (query === "") {
      return [];
    }

    const regex = new RegExp(`${query.trim()}`, "i");
    return this.props.all_books.filter(book => book.title.search(regex) >= 0);
  }

  //On Press for viewDetails
  viewDetails = book => () => {
    console.log("Inside viewDetails");
    console.log("Book Title: " + book.title);
    console.log("Book author: " + book.author);
    this.setState({ selectedBook: book });
    this.setState({ bookCoverImage: book.image_url });
    this.setState({ btnViewMapSelected: false });

    console.log(book);
    // this.ShowModalFunction(true);

    this.props.navigation.navigate("BookDetails", {
      bookData: book
    });
  };

  //On Press for viewMap
  viewMap = book => () => {
    console.log("Inside viewMap");
    console.log("Book Title: " + book.title);
    console.log("Book author: " + book.author);
    this.setState({ selectedBook: book });
    this.setState({ btnViewMapSelected: true });

    // this.ShowModalFunction(true);
    this.props.navigation.navigate("BookLocator", {
      bookData: book
    });
  };

  previewBook = book => () => {
    console.log("Inside previewBook");
    const title = "Preview - " + book.title;
    console.log("Title: " + title);
    this.props.navigation.navigate("WebPage", {
      url: book.preview_url,
      title: title
    });
  };

  //On Press for reserveBook
  reserveBook = book => () => {
    console.log("Inside reserveBook");
    console.log("Book Title: " + book.title);
    console.log("Book author: " + book.author);
    this.props.fetchOverdueBooksByUser();

    Alert.alert(
      "Confirm",
      "Do you wish to continue?",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Cancel Pressed");
            return;
          },
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            console.log("OK Pressed");

            console.log(this.props.user_books_overdue);

            if (this.props.user_books_overdue.length > 0) {
              console.log(
                "You have one or more books overdue. " +
                  " Until you check-in the overdue books, you will not be permitted to CHECK-OUT/RESERVE books!"
              );
              Alert.alert(
                "Error",
                "You have one or more books overdue. Until you check-in the overdue books, " +
                  " you will not be permitted to CHECK-OUT/RESERVE books!"
              );
              return;
            }

            this.setState({ selectedBook: book });
            this.updateBookStatus(book, "RESERVED");
          }
        }
      ],
      { cancelable: false }
    );
  };

  //On Press for checkoutBook
  checkoutBook = book => () => {
    console.log("Inside checkoutBook");
    console.log("Book Title", book.title);
    console.log("Book author", book.author);
    const { currentUser } = getAuth();

    this.props.fetchOverdueBooksByUser();

    Alert.alert(
      "Confirm",
      "Do you wish to continue?",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Cancel Pressed");
            return;
          },
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            console.log("OK Pressed");

            console.log(this.props.user_books_overdue);

            if (this.props.user_books_overdue.length > 0) {
              console.log(
                "You have one or more books overdue. " +
                  " Until you check-in the overdue books, you will not be permitted to CHECK-OUT/RESERVE books!"
              );
              Alert.alert(
                "Error",
                "You have one or more books overdue. Until you check-in the overdue books, " +
                  " you will not be permitted to CHECK-OUT/RESERVE books!"
              );
              return;
            }

            this.setState({ selectedBook: book });
            this.updateBookStatus(book, "BORROWED");
          }
        }
      ],
      { cancelable: false }
    );
  };

  updateBookStatus(bookData, bookStatus) {
    const { currentUser } = getAuth();

    const { uid, title, author, isbn, image_url } = bookData;

    const currentDate = new Date();
    const formattedCurrDate = moment(currentDate).format("MM/DD/YYYY");

    var bookAlreadyWithUser = false;
    var matchedBookStatus = "";
    getDatabase()
      .ref(`/middletonhighschool/users/${currentUser.uid}/books/${uid}`)
      .on("value", snapshot => {
        console.log("Inside updateBookStatus: ");
        console.log(snapshot.val());

        var data = snapshot.val();

        if (
          data !== null &&
          (data.status === "RESERVED" || data.status === "BORROWED")
        ) {
          bookAlreadyWithUser = true;
          console.log("bookAlreadyWithUser: " + bookAlreadyWithUser);
          matchedBookStatus = data.status;
        }
      });

    if (bookAlreadyWithUser) {
      Alert.alert(
        "Error",
        "The selected book is already " + matchedBookStatus + " by you"
      );
    } else {
      getDatabase()
        .ref()
        .child("middletonhighschool")
        .child("users")
        .child(currentUser.uid)
        .child("books")
        .child(uid)
        .set(
          {
            title: title,
            author: author,
            status: bookStatus,
            isbn: isbn,
            image_url: image_url,
            last_activity_date: formattedCurrDate
          },
          function(error) {
            if (error) {
              Alert.alert(
                "Error",
                "Failed to " + bookStatus.toLowerCase + " Book: " + error
              );
            } else {
              if (bookStatus === "BORROWED") {
                Alert.alert("Info", "Checked out successfully");
              } else {
                Alert.alert("Info", "Reserved successfully");
              }
            }
          }
        )
        .then(user => {
          console.log("USER BOOK " + bookStatus + " successful");
          // Send email notification to the user
          // after successful reservation/check-out transaction
          if (bookStatus === "BORROWED") {
            sendCheckedOutEmail(bookData, this.props.userProfile);
          } else {
            sendBookReservedEmail(bookData, this.props.userProfile);
          }
        })
        .catch(error => {
          // Handle Errors here.
          var errorMessage = error.code + " -- " + error.message;
          console.log("Error: " + errorMessage);
        });
    }
  }

  //On Press for viewMap
  viewReviews = book => () => {
    console.log("Book Title: " + book.title); //To get movie title
    console.log("Book author: " + book.author); //To get movie year
    console.log("Book ID: " + book.uid); //To get movie year
    console.log("this.props.book_reviews: " + this.props.book_reviews);

    this.setState({ selectedBook: book });
    this.setState({ btnViewMapSelected: false });

    var matchingReviews = [];
    this.props.book_reviews.book_reviews.map(function(item, i) {
      if (book.uid === item.book_id) {
        matchingReviews.push(item);
      }
    });

    console.log("Found matching Reviews for Book-ID: " + book.uid);
    console.log(matchingReviews);

    this.setState({ bookReviews: matchingReviews });
    //  this.ShowModalFunction(true);

    this.props.navigation.navigate("BookReviews", {
      bookData: book,
      bookReviewData: matchingReviews
    });
  };

  renderHeader() {
    console.log("inside renderHeader()");
    return (
      <View style={{ marginBottom: 30 }}>
        <Text />
      </View>
    );
  }

  renderBook = (data, isRenderItemForAutoComplete = false) => {
    console.log("Inside renderBook");
    console.log("RowData: ");
    console.log(data);
    console.log("isRenderItemForAutoComplete: ");
    console.log(isRenderItemForAutoComplete);
    return (
      <View>
        <ListItem
          thumbnail
          style={{ borderBottomWidth: 1, borderBottomColor: "black" }}
        >
          <Body style={{ borderBottomWidth: 0 }}>
            <FastImage
              style={{
                width: 100,
                height: 100,
                marginTop: isRenderItemForAutoComplete ? 30 : 0
              }}
              source={{
                uri: data.image_url,
                priority: FastImage.priority.high
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <Text />
            <Text>{data.title}</Text>
            <Text style={{ fontSize: 12 }} note>
              {data.author}
            </Text>
            <Text style={{ fontSize: 12 }} note>
              {data.num_of_pages} pages, Age - {data.age_range}
            </Text>
            <Text style={{ fontSize: 12 }} note>
              Genre - {data.genre}
            </Text>
          </Body>
          <Right
            style={{
              borderBottomWidth: 0,
              marginTop: isRenderItemForAutoComplete ? 30 : 0
            }}
          >
            <Button
              small
              dark
              block
              iconRight
              style={styles.mb}
              onPress={this.viewDetails(data)}
            >
              <Text style={styles.text}>Details</Text>
              <Icon name="md-more" />
            </Button>

            <Button
              small
              block
              dark
              iconRight
              style={styles.mb}
              onPress={this.checkoutBook(data)}
            >
              <Text style={styles.text}>Check Out</Text>
              <Icon name="md-exit" />
            </Button>

            <Button
              small
              dark
              block
              iconRight
              style={styles.mb}
              onPress={this.reserveBook(data)}
            >
              <Text style={styles.text}>Reserve</Text>
              <Icon name="md-bookmark" />
            </Button>

            <Button
              small
              dark
              block
              iconRight
              style={styles.mb}
              onPress={this.viewMap(data)}
            >
              <Text style={styles.text}>Locate</Text>
              <Icon name="md-pin" style={{ color: "red" }} />
            </Button>

            <Button
              small
              dark
              block
              iconRight
              style={styles.mb}
              onPress={this.viewReviews(data)}
            >
              <Text style={styles.text}>Reviews</Text>
              <Icon active name="star" style={{ color: "yellow" }} />
            </Button>

            <Button
              small
              dark
              block
              style={styles.mb}
              onPress={this.previewBook(bookData)}
            >
              <Text style={styles.text}>Preview</Text>
              <Icon active name="md-play" style={{ color: "white" }} />
            </Button>
          </Right>
        </ListItem>
      </View>
    );
  };

  render() {
    console.log("LibraryBooksList: " + this.props.all_books);

    const { query } = this.state;
    const matchedBooks = this.findBook(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    var isRenderItemForAutoComplete = true;

    return (
      <Container style={styles.container}>
        <Content keyboardShouldPersistTaps="always">
          <View style={styles.searchContainer}>
            <Autocomplete
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.autocompleteContainer}
              data={
                matchedBooks.length === 1 && comp(query, matchedBooks[0].title)
                  ? []
                  : matchedBooks
              }
              defaultValue={query}
              onChangeText={text => this.setState({ query: text })}
              placeholder="Enter the book title to search"
              renderItem={({ title }) => (
                <TouchableOpacity
                  onPress={() => this.setState({ query: title })}
                >
                  <Text style={styles.itemText}>{title}</Text>
                </TouchableOpacity>
              )}
            />

            {matchedBooks.length > 0 ? (
              this.renderBook(matchedBooks[0], isRenderItemForAutoComplete)
            ) : (
              <ListView
                keyboardShouldPersistTaps="always"
                enableEmptySections
                dataSource={this.dataSource}
                renderHeader={this.renderHeader}
                renderRow={item => this.renderBook(item)}
              />
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  console.log("mapStateToProps LibraryBooksList state: ");
  console.log(state);

  return {
    all_books: state.all_books,
    book_reviews: state.book_reviews,
    user_books_overdue: state.user_books_overdue
  };
};

export default connect(mapStateToProps, {
  fetchAllBooks,
  fetchAllBookReviews,
  fetchOverdueBooksByUser
})(LibraryBooksList);
