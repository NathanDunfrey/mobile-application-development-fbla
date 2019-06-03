import React, { Component } from "react";
import { ListView, View, Image, Dimensions, Alert } from "react-native";
import styles from "./styles";
import { connect } from "react-redux";
import { Share } from "react-native";

import {
  Container,
  Header,
  Title,
  Subtitle,
  Content,
  Button,
  Icon,
  Card,
  CardItem,
  Text,
  Label,
  Item,
  Left,
  Right,
  Body,
  Separator,
  ListItem
} from "native-base";

import FastImage from "react-native-fast-image";

import { fetchAllBookReviews } from "../../actions";
import { fetchOverdueBooksByUser } from "../../actions";

const deviceWidth = Dimensions.get("window").width;
import { getDatabase, getAuth } from "../../../firebase";
import moment from "moment";

import {
  sendCheckedOutEmail,
  sendBookReservedEmail
} from "../EmailNotifications";

class UserBookDetails extends Component {
  constructor(props) {
    super(props);
    console.log("Inside UserBookDetails ctor: ");
    console.log(this.props.navigation.state.params);
  }

  componentWillMount() {
    console.log(
      "Inside UserBookDetails componentWillMount(): " +
        this.props.navigation.state.params
    );

    this.props.fetchAllBookReviews();
    this.props.fetchOverdueBooksByUser();
  }

  goToHomePage() {
    this.props.navigation.navigate("Home");
  }

  //On Press for viewMap
  viewMap = book => () => {
    console.log("Inside viewMap");
    console.log("Book Title: " + book.title); //To get movie title
    console.log("Book author: " + book.author); //To get movie year
    console.log("Book ID: " + book.uid); //To get movie year
    this.props.navigation.navigate("BookLocator", {
      bookData: book
    });
  };

  _showShareResults(result) {
    console.log("Inside _showResult(), result: ");
    console.log(result);
  }

  previewBook = book => () => {
    console.log("Inside previewBook");
    const title = "Preview - " + book.title;
    console.log("Title: " + title);
    this.props.navigation.navigate("WebPage", {
      url: book.preview_url,
      title: title
    });
  };

  //On Press for viewMap
  shareBookDetails = book => () => {
    console.log("Inside share()");
    console.log("Book Title: " + book.title); //To get movie title
    console.log("Book author: " + book.author); //To get movie year
    console.log("Book ID: " + book.uid); //To get movie year

    const messageStr =
      "Title: " +
      `${book.title} \n` +
      "Author: " +
      `${book.author} \n` +
      "Summary: " +
      `${book.summary} \n`;
    Share.share(
      {
        message: messageStr,
        url: book.image_url,
        title: book.title
      },
      {
        dialogTitle: "Shared by Tomely",
        tintColor: "green"
      }
    )
      .then(this._showShareResults)
      .catch(err => console.log(err));
  };

  //On Press for viewReviews
  viewReviews = book => () => {
    console.log("Book Title: " + book.title); //To get movie title
    console.log("Book author: " + book.author); //To get movie year
    console.log("Book ID: " + book.uid); //To get movie year
    console.log("this.props.book_reviews: ");
    console.log(this.props.book_reviews);

    this.setState({ selectedBook: book });
    this.setState({ btnViewMapSelected: false });

    var matchingReviews = (matchingReviews = this.props.book_reviews.book_reviews.filter(
      item => book.uid === item.book_id
    ));

    console.log("Found matching Reviews for Book-ID: " + book.uid);
    console.log(matchingReviews);

    this.props.navigation.navigate("BookReviews", {
      bookData: book,
      bookReviewData: matchingReviews
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

  render() {
    const { bookData } = this.props.navigation.state.params;

    const {
      title,
      summary,
      image_url,
      author,
      isbn,
      genre,
      num_of_pages,
      age_range
    } = this.props.navigation.state.params.bookData;

    console.log("UserBookDetails: " + bookData);

    if (!bookData) {
      return <View />;
    } else {
      return (
        <Container style={styles.container}>
          <Header style={{ backgroundColor: "dodgerblue" }}>
            <Body>
              <Subtitle>{title}</Subtitle>
            </Body>
            <Right>
              <Button block dark onPress={() => this.props.navigation.goBack()}>
                <Icon
                  name="md-close-circle"
                  style={{ color: "white", fontSize: 20 }}
                />
                <Text>Close</Text>
              </Button>
            </Right>
          </Header>
          <Content padder keyboardShouldPersistTaps="always">
            <Card>
              <CardItem>
                <Body>
                  <FastImage
                    style={{
                      alignSelf: "center",
                      height: 200,
                      width: deviceWidth / 1.0,
                      marginVertical: 5,
                      marginBottom: 10
                    }}
                    source={{
                      uri: image_url,
                      priority: FastImage.priority.high
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </Body>
                <Right
                  style={{
                    borderBottomWidth: 0
                  }}
                >
                  <Button
                    small
                    block
                    dark
                    iconRight
                    style={styles.mb}
                    onPress={this.checkoutBook(bookData)}
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
                    onPress={this.reserveBook(bookData)}
                  >
                    <Text style={styles.text}>Reserve</Text>
                    <Icon name="md-bookmark" />
                  </Button>

                  <Button
                    small
                    dark
                    block
                    style={styles.mb}
                    onPress={this.viewMap(bookData)}
                  >
                    <Text style={styles.text}>Locate</Text>
                    <Icon name="md-pin" style={{ color: "red" }} />
                  </Button>

                  <Button
                    small
                    dark
                    block
                    style={styles.mb}
                    onPress={this.viewReviews(bookData)}
                  >
                    <Text style={styles.text}>Reviews</Text>
                    <Icon active name="star" style={{ color: "yellow" }} />
                  </Button>

                  <Button
                    small
                    dark
                    block
                    style={styles.mb}
                    onPress={this.shareBookDetails(bookData)}
                  >
                    <Text style={styles.text}>Share</Text>
                    <Icon active name="share" style={{ color: "dodgerblue" }} />
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
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Body>
                  <Text style={styles.label}>Book Synopsis</Text>
                  <Text style={{ fontSize: 12, fontStyle: "italic" }}>
                    {summary}
                  </Text>
                </Body>
              </CardItem>
            </Card>

            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>Title</Label>
                <Text style={{ fontSize: 14 }}>{title}</Text>
              </Item>
            </ListItem>
            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>Author</Label>
                <Text style={{ fontSize: 14 }}>{author}</Text>
              </Item>
            </ListItem>
            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>ISBN</Label>
                <Text style={{ fontSize: 14 }}>{isbn}</Text>
              </Item>
            </ListItem>
            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>Genre</Label>
                <Text style={{ fontSize: 14 }}>{genre}</Text>
              </Item>
            </ListItem>
            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>Number of Pages</Label>
                <Text style={{ fontSize: 14 }}>{num_of_pages}</Text>
              </Item>
            </ListItem>
            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>Age Range</Label>
                <Text style={{ fontSize: 14 }}>{age_range}</Text>
              </Item>
            </ListItem>
          </Content>
        </Container>
      );
    }
  }
}

const mapStateToProps = state => {
  console.log("mapStateToProps UserBookDetails state: ");
  console.log(state);

  return {
    book_reviews: state.book_reviews,
    user_books_overdue: state.user_books_overdue
  };
};

export default connect(mapStateToProps, {
  fetchAllBookReviews,
  fetchOverdueBooksByUser
})(UserBookDetails);
