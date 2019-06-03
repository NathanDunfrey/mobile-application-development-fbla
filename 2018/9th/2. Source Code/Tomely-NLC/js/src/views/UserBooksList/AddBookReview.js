import times from "lodash/times";

import React, { Component } from "react";
import { View, Image, TextInput, Alert } from "react-native";
import moment from "moment";
import { connect } from "react-redux";
import { getDatabase, getAuth } from "../../../firebase";

import { Rating, AirbnbRating } from "react-native-ratings";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Card,
  CardItem,
  Text,
  Input,
  Label,
  Item,
  Left,
  Right,
  Body,
  Separator,
  InputGroup
} from "native-base";
import styles from "./styles";
import { userProfileFetch } from "../../actions";

// RATING IMAGES WITH STATIC BACKGROUND COLOR (white)
const STAR_IMAGE = require("../../../../img/star.png");

class AddBookReview extends Component {
  constructor(props) {
    super(props);
    console.log("Inside AddBookReview bookDate: " + this.props.bookData);
    console.log("Inside AddBookReview userData: " + this.props.userData);

    this.state = {
      reviewComments: "",
      userRating: 3
    };
  }

  componentWillMount() {
    console.log(
      "Inside BookDetails componentWillMount(): " + this.props.bookData
    );

    this.props.userProfileFetch();
  }

  ratingCompleted(rating) {
    console.log("Rating is: " + rating);

    this.setState({ userRating: rating });
  }

  handleSubmit() {
    console.log("Inside handleSubmit (userRating): " + this.state.userRating);
    console.log(
      "Inside handleSubmit (reviewComments): " + this.state.reviewComments
    );

    Alert.alert(
      "Confirm",
      "Do you wish to continue?",
      [
        {
          text: "No",
          onPress: () => {
            console.log("Cancel Pressed");
            return;
          },
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            console.log("OK Pressed");
            const currentDate = new Date();
            const formattedCurrDate = moment(currentDate).format("MM/DD/YYYY");
            const userName =
              this.props.profile.first_name +
              " " +
              this.props.profile.last_name;

            getDatabase()
              .ref()
              .child("middletonhighschool")
              .child("book_reviews")
              .push({
                book_id: this.props.bookData.uid,
                user_id: this.props.userData.uid,
                user_name: userName,
                user_rating: this.state.userRating,
                review_comments: this.state.reviewComments,
                last_activity_date: formattedCurrDate
              })
              .then(rating => {
                console.log("Book Review successful ");
                Alert.alert("Info", "Successfully submitted review comments");
              })
              .catch(error => {
                // Handle Errors here.
                var errorMessage = error.code + " -- " + error.message;
                console.log("Error: " + errorMessage);
                Alert.alert(
                  "Error",
                  "Unable to submitted review comments. Please try again later..... !!!"
                );
              });
          }
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content padder keyboardShouldPersistTaps="always">
          <Text style={{ fontSize: 25, textAlign: "center", marginTop: 20 }}>
            Review and Rate the Book
          </Text>
          <Text
            style={{
              marginTop: 20,
              fontSize: 20,
              textAlign: "center",
              fontFamily: "sans-serif",
              marginBottom: 50
            }}
          >
            {this.props.bookData.title}
          </Text>

          <TextInput
            style={{
              borderColor: "dodgerblue",
              backgroundColor: "#ffffff",
              borderRightWidth: 5,
              borderLeftWidth: 5,
              borderTopWidth: 5,
              borderBottomWidth: 5
            }}
            multiline={true}
            numberOfLines={10}
            placeholder="Add your review comments here..."
            onChangeText={reviewComments => this.setState({ reviewComments })}
          />

          <AirbnbRating
            count={5}
            reviews={["Terrible", "Bad", "OK", "Good", "Excellent"]}
            defaultRating={3}
            size={30}
            onFinishRating={this.ratingCompleted.bind(this)}
          />

          <Button
            block
            small
            style={{
              backgroundColor: "dodgerblue",
              marginTop: 10
            }}
            onPress={this.handleSubmit.bind(this)}
          >
            <Text style={{ fontSize: 14, alignSelf: "center" }}>
              Submit Review
            </Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  console.log("state after redux userProfileFetch() call: ", state);
  return {
    profile: state.profile
  };
};

export default connect(mapStateToProps, { userProfileFetch })(AddBookReview);
