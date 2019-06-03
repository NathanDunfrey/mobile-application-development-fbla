import React, { Component } from "react";
import { ListView, View, Image, Dimensions } from "react-native";
import styles from "./styles";
import { connect } from "react-redux";
import { Share, WebView } from "react-native";
import FastImage from "react-native-fast-image";

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

import { book_reviews } from "./static/data/book_reviews_data";

const deviceWidth = Dimensions.get("window").width;

class GuestBookDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: "true"
    };

    console.log("Inside GuestBookDetails ctor: ");
    console.log(this.props.navigation.state.params);
  }

  componentWillMount() {
    console.log(
      "Inside GuestBookDetails componentWillMount(): " +
        this.props.navigation.state.params
    );
  }

  goToHomePage() {
    this.props.navigation.navigate("Home");
  }

  //On Press for viewMap
  viewMap = (book) => () => {
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

  previewBook = (book) => () => {
    console.log("Inside previewBook");
    const title = "Preview - " + book.title;
    console.log("Title: " + title);
    this.props.navigation.navigate("WebPage", {
      url: book.preview_url,
      title: title
    });
  };

  //On Press for viewMap
  share = (book) => () => {
    console.log("Inside share()");
    console.log("Book Title: " + book.title); //To get movie title
    console.log("Book author: " + book.author); //To get movie year
    console.log("Book ID: " + book.uid); //To get movie year
    Share.share(
      {
        message: book.summary,
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
  viewReviews = (book) => () => {
    console.log("Book Title: " + book.title); //To get movie title
    console.log("Book author: " + book.author); //To get movie year
    console.log("Book ID: " + book.uid); //To get movie year
    console.log("book_reviews: ");
    console.log(book_reviews);

    this.setState({ selectedBook: book });

    var matchingReviews = book_reviews.filter(
      item => book.uid === item.book_id
    );

    console.log("Found matching Reviews for Book-ID: " + book.uid);
    console.log(matchingReviews);

    this.props.navigation.navigate("BookReviews", {
      bookData: book,
      bookReviewData: matchingReviews
    });
  };

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

    console.log("GuestBookDetails: " + bookData);

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
                      marginVertical: 5
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
                    dark
                    block
                    style={styles.mb15}
                    onPress={this.viewMap(bookData)}
                  >
                    <Text style={styles.text}>Locate</Text>
                    <Icon name="md-pin" style={{ color: "red" }} />
                  </Button>

                  <Button
                    small
                    dark
                    block
                    style={styles.mb15}
                    onPress={this.viewReviews(bookData)}
                  >
                    <Text style={styles.text}>Reviews</Text>
                    <Icon active name="star" style={{ color: "yellow" }} />
                  </Button>

                  <Button
                    small
                    dark
                    block
                    style={styles.mb15}
                    onPress={this.share(bookData)}
                  >
                    <Text style={styles.text}>Share</Text>
                    <Icon active name="share" style={{ color: "dodgerblue" }} />
                  </Button>

                  <Button
                    small
                    dark
                    block
                    style={styles.mb15}
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
                <Text style={{ fontSize: 12 }}>{title}</Text>
              </Item>
            </ListItem>
            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>Author</Label>
                <Text style={{ fontSize: 12 }}>{author}</Text>
              </Item>
            </ListItem>
            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>ISBN</Label>
                <Text style={{ fontSize: 12 }}>{isbn}</Text>
              </Item>
            </ListItem>
            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>Genre</Label>
                <Text style={{ fontSize: 8 }}>{genre}</Text>
              </Item>
            </ListItem>
            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>Num Pages</Label>
                <Text style={{ fontSize: 12 }}>{num_of_pages}</Text>
              </Item>
            </ListItem>
            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>Age Range</Label>
                <Text style={{ fontSize: 12 }}>{age_range}</Text>
              </Item>
            </ListItem>
          </Content>
        </Container>
      );
    }
  }
}

export default GuestBookDetails;
