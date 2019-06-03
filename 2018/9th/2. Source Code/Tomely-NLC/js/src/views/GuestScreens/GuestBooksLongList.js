import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";

import {
  ListView,
  View,
  Alert,
  TextInput,
  Modal,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Platform
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import FastImage from "react-native-fast-image";

import styles from "./styles";
import BookDetails from "../LibraryBooksList/bookDetails";
import BookLocator from "../LibraryBooksList/bookLocator";
import BookReviews from "../LibraryBooksList/bookReviews";
import UserProfilePage from "../UserProfilePage";
import moment from "moment";
import firebase from "firebase";
import { fetchAllBookReviewsGHS } from "../../actions";
import { fetchAllBookReviews } from "../../actions";

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
  Label,
  Picker,
  Body,
  Right
} from "native-base";

const deviceWidth = Dimensions.get("window").width;

class GuestBooksLongList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedBook: null,
      highSchool: "",

      bookCoverImage:
        "https://heidicvlach.files.wordpress.com/2012/11/notfound.png",

      bookReviews: null,
      books: null,
      query: ""
    };
  }

  componentWillMount() {
    console.log("componentWillMount");
    console.log(this.props.navigation.state.params);

    this.setState({
      query: ""
    });

    this.props.fetchAllBookReviewsGHS();
    this.props.fetchAllBookReviews();

    var sortedBooksByTitle = _.sortBy(
      this.props.navigation.state.params.books,
      o => o.title
    );

    this.setState({
      highSchool: this.props.navigation.state.params.highSchool,
      books: sortedBooksByTitle
    });

    console.log("calling createDataSource");
    this.createDataSource(sortedBooksByTitle);
  }

  createDataSource(books) {
    console.log("Inside createDataSource");
    console.log(books);
    const ds = new ListView.DataSource({
      rowHasChanged: this._rowHasChanged
    });

    this.dataSource = ds.cloneWithRows(books);

    console.log("this.dataSource");
    console.log(this.dataSource);
  }

  _rowHasChanged(r1, r2) {
    return (
      r1.title !== r2.title ||
      r1.summary !== r2.summary ||
      r1.image_url !== r2.image_url
    );
  }

  findBook(query) {
    if (query === "") {
      return [];
    }

    const regex = new RegExp(`${query.trim()}`, "i");
    return this.props.navigation.state.params.books.filter(
      book => book.title.search(regex) >= 0
    );
  }

  renderHeader() {
    console.log("inside renderHeader()");
    return (
      <View style={{ marginBottom: 30 }}>
        <Text />
      </View>
    );
  }

  navigateToUserBookDetails = book => () => {
    this.props.navigation.navigate("GuestBookDetails", {
      bookData: book
    });
  };

  renderBook = (data, isRenderItemForAutoComplete = false) => {
    return (
      <View>
        <TouchableOpacity
          key={data.title}
          activeOpacity={0.3}
          onPress={this.navigateToUserBookDetails(data)}
        >
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              paddingTop: 10,
              paddingBottom: 10
            }}
          >
            <FastImage
              style={{
                width: 100,
                height: 120,
                marginTop: isRenderItemForAutoComplete ? 30 : 0
              }}
              source={{
                uri: data.image_url,
                priority: FastImage.priority.high
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View
              style={{
                flex: 2,
                flexDirection: "column",
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 10
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "dodgerblue",
                  marginTop: isRenderItemForAutoComplete ? 30 : 0
                }}
              >
                {data.title}
              </Text>
              <Text style={{ fontSize: 9 }} numberOfLines={10}>
                {data.summary}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    console.log("Inside GuestBooksLongList render");

    const { query } = this.state;
    const matchedBooks = this.findBook(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    const isRenderItemForAutoComplete = true;

    if (!this.dataSource) return null;
    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: "dodgerblue" }}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body
            style={{
              flex: 3
            }}
          >
            <Subtitle>Welcome Guest</Subtitle>
          </Body>

          <Right style={{ borderBottomWidth: 0 }}>
            <Button
              iconRight
              transparent
              style={styles.mb15}
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon active name="home" />
            </Button>
          </Right>
        </Header>

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
              <TouchableOpacity onPress={() => this.setState({ query: title })}>
                <Text style={styles.itemText}>{title}</Text>
              </TouchableOpacity>
            )}
          />

          <Content keyboardShouldPersistTaps="always">
            {matchedBooks.length > 0 ? (
              this.renderBook(matchedBooks[0], isRenderItemForAutoComplete)
            ) : (
              <ListView
                keyboardShouldPersistTaps="always"
                enableEmptySections
                dataSource={this.dataSource}
                renderRow={data => this.renderBook(data)}
                renderHeader={this.renderHeader}
                renderSeparator={(sectionId, rowId) => (
                  <View key={rowId} style={styles.separator} />
                )}
              />
            )}
          </Content>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  console.log("mapStateToProps GuestBooksLongList state: ");
  console.log(state);

  return {
    ghs_book_reviews: state.ghs_book_reviews,
    book_reviews: state.book_reviews.book_reviews
  };
};

export default connect(mapStateToProps, {
  fetchAllBookReviewsGHS,
  fetchAllBookReviews
})(GuestBooksLongList);
