import React, { Component } from "react";
import {
  ListView,
  View,
  Image,
  Dimensions,
  FlatList,
  List,
  ScrollView
} from "react-native";
import styles from "./styles";
import firebase from "firebase";
import moment from "moment";
import { Rating, AirbnbRating } from "react-native-ratings";
import FastImage from "react-native-fast-image";

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
  Label,
  Item,
  Left,
  Right,
  Body,
  Separator,
  ListItem
} from "native-base";

const deviceWidth = Dimensions.get("window").width;

class BookReviews extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log("----Inside BookReviews componentWillMount()----");
    console.log(this.props.navigation.state.params.bookReviewData);
    console.log("------------------------------------------");
  }

  displayReviews = bookReviewData => {
    return bookReviewData.map(function(item, i) {
      return (
        <View key={i}>
          <Card>
            <CardItem>
              <Body>
                <AirbnbRating
                  count={5}
                  readonly
                  showRating
                  reviews={["Terrible", "Bad", "OK", "Good", "Excellent"]}
                  defaultRating={item.user_rating}
                  size={10}
                  style={{ fontSize: 12 }}
                />

                <Text style={{ marginTop: 5 }}>{item.review_comments}</Text>
                <Text
                  note
                  style={{
                    fontWeight: "bold",
                    fontStyle: "italic",
                    paddingLeft: 180
                  }}
                >
                  {"--"} {item.user_name}
                </Text>
                <Text
                  note
                  style={{
                    fontWeight: "bold",
                    fontStyle: "italic",
                    paddingLeft: 180
                  }}
                >
                  {item.last_activity_date}
                </Text>
              </Body>
            </CardItem>
          </Card>
        </View>
      );
    });
  };

  render() {
    console.log("Inside BookReviews render(), bookReviewData: ");
    const { bookReviewData } = this.props.navigation.state.params;

    console.log(bookReviewData);

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

    return (
      <Container style={{ width: "100%" }}>
        <Header style={{ backgroundColor: "dodgerblue"}}>
          <Left />
          <Body>
            <Title style={{ justifyContent: "center" }}>Book Reviews</Title>
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

        <Content keyboardShouldPersistTaps="always">
          <ScrollView>
            <Card>
              <CardItem>
                <Body>
                  <Text style={{ fontSize: 25, alignSelf: "center" }}>
                    {title}
                  </Text>
                  <Text style={{ fontSize: 20, alignSelf: "center" }}>
                    {"--"} {author}
                  </Text>
                  <FastImage
                    style={{
                      alignSelf: "center",
                      height: 200,
                      width: deviceWidth / 0.5,
                      marginVertical: 5
                    }}
                    source={{
                      uri: image_url,
                      priority: FastImage.priority.high
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </Body>
              </CardItem>
            </Card>
            {bookReviewData.length === 0 ? (
              <View
                style={{
                  marginTop: 50,
                  marginBottom: 50,
                  paddingLeft: 10
                }}
              >
                <Text>
                  The book has not been reviewed yet. Please check back later...{" "}
                </Text>
              </View>
            ) : (
              this.displayReviews(bookReviewData)
            )}
          </ScrollView>
        </Content>
      </Container>
    );
  }
}

export default BookReviews;
