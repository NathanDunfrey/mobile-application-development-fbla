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
  Dimensions
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";

import { fetchAllBooks } from "../../actions";
import { fetchAllBookReviews } from "../../actions";

import styles from "./styles";
import BookDetails from "../LibraryBooksList/bookDetails";
import BookLocator from "../LibraryBooksList/bookLocator";
import BookReviews from "../LibraryBooksList/bookReviews";
import moment from "moment";
import firebase from "firebase";

import {
  Container,
  Header,
  Title,
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

class AdminBooksList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ModalVisibleStatus: false,
      selectedBook: null,
      bookReviews: [],
      query: ""
    };
  }

  ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: visible });
  }

  componentWillMount() {
    this.setState({
      bookReviews: [],
      query: ""
    });
    this.props.fetchAllBooks();
    this.createDataSource(this.props);

    this.props.fetchAllBookReviews();
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
    console.log("Book Title", book.title); //To get movie title
    console.log("Book author", book.author); //To get movie year
    this.setState({ selectedBook: book });
    console.log(this.state.selectedBook);

    this.props.navigation.navigate("BookDetails", {
      bookData: book
    });
  };

  //On Press for viewMap
  viewMap = book => () => {
    console.log("Book Title", book.title); //To get movie title
    console.log("Book author", book.author); //To get movie year
    this.setState({ selectedBook: book });

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

  viewReviews = book => () => {
    console.log("Book Title: " + book.title); //To get movie title
    console.log("Book author: " + book.author); //To get movie year
    console.log("Book ID: " + book.uid); //To get movie year
    console.log("this.props.book_reviews: ");
    console.log(this.props.book_reviews);

    this.setState({ selectedBook: book });

    var matchingReviews = [];
    this.props.book_reviews.book_reviews.forEach(function(item, i) {
      if (book.uid === item.book_id) {
        matchingReviews.push(item);
      }
    });

    console.log("Found matching Reviews for Book-ID: " + book.uid);
    console.log(matchingReviews);

    this.setState({ bookReviews: matchingReviews });

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
    console.log("Inside renderBookItem");
    console.log("RowData: ");
    console.log(data);

    return (
      <View>
        <ListItem
          thumbnail
          style={{ borderBottomWidth: 1, borderBottomColor: "black" }}
        >
          <Body>
            <Image
              style={{
                width: 100,
                height: 100,
                marginTop: isRenderItemForAutoComplete ? 30 : 0
              }}
              source={{ uri: data.image_url }}
              resizeMode="contain"
            />

            <Text>{data.title}</Text>
            <Text style={{ fontSize: 12 }} note>
              {data.author}
            </Text>
            <Text style={{ fontSize: 12 }} note>
              {data.genre}
            </Text>
            <Text style={{ fontSize: 12 }} note>
              {data.num_of_pages} pages
            </Text>
            <Text style={{ fontSize: 12 }} note>
              Age - {data.age_range}
            </Text>
          </Body>
          <Right
            style={{
              marginTop: isRenderItemForAutoComplete ? 30 : 0
            }}
          >
            <Button
              small
              dark
              transparent
              style={styles.mb}
              onPress={this.viewDetails(data)}
            >
              <Icon active name="md-list" />
              <Text>Details</Text>
            </Button>

            <Button
              small
              dark
              transparent
              style={styles.mb}
              onPress={this.viewMap(data)}
            >
              <Icon name="md-pin" style={{ color: "red" }} />
              <Text>Locate</Text>
            </Button>

            <Button
              small
              dark
              transparent
              style={styles.mb}
              onPress={this.viewReviews(data)}
            >
              <Icon active name="star" style={{ color: "yellow" }} />
              <Text>Reviews</Text>
            </Button>

            <Button
              small
              dark
              transparent
              style={styles.mb}
              onPress={this.previewBook(data)}
            >
              <Icon active name="md-play" style={{ color: "green" }} />
              <Text style={styles.text}>Preview</Text>
            </Button>
          </Right>
        </ListItem>
      </View>
    );
  };

  render() {
    console.log("AdminBooksList: " + this.props.all_books);

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
                renderRow={data => this.renderBook(data)}
              />
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  console.log("mapStateToProps AdminBooksList state: ");
  console.log(state);

  var sortedBooksByTitle = _.sortBy(state.all_books, o => o.title);

  return {
    all_books: sortedBooksByTitle,
    book_reviews: state.book_reviews
  };
};

export default connect(mapStateToProps, { fetchAllBooks, fetchAllBookReviews })(
  AdminBooksList
);
