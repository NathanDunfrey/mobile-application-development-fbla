import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Alert, ListView, View, Image } from "react-native";
import styles from "./styles";
import { getDatabase } from "../../../firebase";
import { sendCheckedInEmail, sendCheckedOutEmail } from "../EmailNotifications";

import {
  Container,
  Header,
  Title,
  Subtitle,
  Content,
  Button,
  Icon,
  List,
  H3,
  ListItem,
  Text,
  Thumbnail,
  Left,
  Body,
  Right
} from "native-base";
import moment from "moment";

class UserBooksActivity extends Component {
  //On Press for checkinBook
  checkinBook = (book, user) => () => {
    console.log("Book Key: " + book.key);

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
            getDatabase()
              .ref()
              .child("middletonhighschool")
              .child("users")
              .child(user.user_id)
              .child("books")
              .child(book.key)
              .remove(function(error) {
                Alert.alert(
                  "Info",
                  error ? "Failed to check in" : "Checked in successfully"
                );
              });

            sendCheckedInEmail(book, user);
          }
        }
      ],
      { cancelable: false }
    );
  };

  //On Press for checkoutBook
  checkoutBook = (book, user) => () => {
    console.log("Book Object: ");
    console.log(book);

    console.log("user Object: ");
    console.log(user);

    console.log("Book Title: " + book.book_data.title);
    console.log("Book author: " + book.book_data.author);

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
            this.updateBookStatus(book.book_data, book.key, user);

            sendCheckedOutEmail(book.book_data, user);
          }
        }
      ],
      { cancelable: false }
    );
  };

  updateBookStatus(bookData, bookKey, user) {
    const { title, author, isbn, status, image_url } = bookData;

    const currentDate = new Date();
    const formattedCurrDate = moment(currentDate).format("MM/DD/YYYY");

    console.log("Inside updateBookStatus");
    console.log("bookData: ");
    console.log(bookData);
    console.log("bookKey: ");
    console.log(bookKey);

    console.log("user.user_id: ");
    console.log(user.user_id);

    getDatabase()
      .ref()
      .child("middletonhighschool")
      .child("users")
      .child(user.user_id)
      .child("books")
      .child(bookKey)
      .set(
        {
          title: title,
          author: author,
          status: "BORROWED",
          isbn: isbn,
          image_url: image_url,
          last_activity_date: formattedCurrDate
        },
        function(error) {
          if (error) {
            Alert.alert("Error", "Failed to check out Book: " + error);
          } else {
            Alert.alert("Info", "Checked out successfully");
          }
        }
      )
      .then(user => {
        console.log("BOOK checked out successfully");
      })
      .catch(error => {
        // Handle Errors here.
        var errorMessage = error.code + " -- " + error.message;
        console.log("Error: " + errorMessage);
      });
  }

  render() {
    console.log("UserBooksActivity render(): ");

    console.log("User Book Data");
    console.log(this.props.navigation.state.params.userBooks);

    console.log("User Profile Data");
    console.log(this.props.navigation.state.params.userProfile);

    const { userProfile, userBooks } = this.props.navigation.state.params;

    if (!userBooks) {
      return (
        <Container>
          <Header style={{ backgroundColor: "dodgerblue" }}>
            <Body>
              <Subtitle
                style={{ justifyContent: "center", alignSelf: "center" }}
              >
                {userProfile.first_name} {userProfile.last_name} Activity
              </Subtitle>
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

          <Content padder>
            <H3 style={styles.mb10}>User currently has no Book activity</H3>
          </Content>
        </Container>
      );
    } else {
      var maxReturnByDays = 14;

      if (userProfile.member_type !== "STUDENT") {
        maxReturnByDays = 28;
      }

      return (
        <Container>
          <Header style={{ backgroundColor: "dodgerblue" }}>
            <Left>
              <Subtitle style={{ justifyContent: "center" }}>
                {userProfile.first_name} {userProfile.last_name} Activity
              </Subtitle>
            </Left>

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

          <Content keyboardShouldPersistTaps="always">
            <List
              dataArray={userBooks}
              renderRow={data => (
                <ListItem thumbnail noBorder>
                  <Body>
                    <Image
                      style={{ width: 100, height: 100 }}
                      source={{ uri: data.book_data.image_url }}
                      resizeMode="contain"
                    />
                    <Text>{data.book_data.title}</Text>
                    <Text note> ISBN: {data.book_data.isbn}</Text>
                    <Text numberOfLines={1} note>
                      {data.book_data.author}
                    </Text>

                    {data.book_data === "BORROWED" && (
                      <Text
                        numberOfLines={1}
                        note
                        style={{ fontWeight: "bold", color: "blue" }}
                      >
                        Borrowed On:{" "}
                        {moment(data.book_data.last_activity_date).format(
                          "MM/DD/YYYY"
                        )}
                      </Text>
                    )}

                    {data.book_data.status === "RESERVED" && (
                      <Text
                        numberOfLines={1}
                        note
                        style={{ fontWeight: "bold", color: "blue" }}
                      >
                        Reserved On{" "}
                        {moment(data.book_data.last_activity_date).format(
                          "MM/DD/YYYY"
                        )}
                      </Text>
                    )}

                    {data.book_data.status === "BORROWED" && (
                      <Text
                        style={{ fontWeight: "bold", color: "red" }}
                        numberOfLines={1}
                        note
                      >
                        Due By:{" "}
                        {moment(data.book_data.last_activity_date)
                          .add(maxReturnByDays, "days")
                          .format("MM/DD/YYYY")}{" "}
                      </Text>
                    )}
                  </Body>

                  {data.book_data.status === "BORROWED" && (
                    <Right>
                      <Button
                        block
                        style={{
                          backgroundColor: "black"
                        }}
                        onPress={this.checkinBook(data, userProfile)}
                      >
                        <Text>Check In</Text>
                      </Button>
                    </Right>
                  )}

                  {data.book_data.status === "RESERVED" && (
                    <Right>
                      <Button
                        block
                        style={{
                          backgroundColor: "black"
                        }}
                        onPress={this.checkoutBook(data, userProfile)}
                      >
                        <Text>Check Out</Text>
                      </Button>
                    </Right>
                  )}
                </ListItem>
              )}
            />
          </Content>
        </Container>
      );
    }
  }
}

export default UserBooksActivity;
