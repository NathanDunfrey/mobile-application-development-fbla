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

import styles from "./styles";

import moment from "moment";

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

class UserBooksLongListView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedBook: null,
      userProfile: this.props.navigation.state.params.userProfile,
      bookCoverImage:
        "https://heidicvlach.files.wordpress.com/2012/11/notfound.png",

      query: "",
      books: this.props.navigation.state.params.books
    };
  }

  componentWillMount() {
    this.setState({
      query: "",
      userProfile: this.props.navigation.state.params.userProfile,
      books: this.props.navigation.state.params.books
    });

    var sortedBooksByTitle = _.sortBy(
      this.props.navigation.state.params.books,
      o => o.title
    );

    this.createDataSource(sortedBooksByTitle);
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    this.createDataSource(nextProps);
  }

  createDataSource(books) {
    const ds = new ListView.DataSource({
      rowHasChanged: this._rowHasChanged
    });

    this.dataSource = ds.cloneWithRows(books);
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
    return this.state.books.filter(book => book.title.search(regex) >= 0);
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
    this.props.navigation.navigate("UserBookDetails", {
      bookData: book
    });
  };

  renderBook = (data, isRenderItemForAutoComplete = false) => {
    console.log("Inside renderBook");
    console.log("RowData: ");
    console.log(data);
    console.log("isRenderItemForAutoComplete: ");
    console.log(isRenderItemForAutoComplete);
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
                height: 130,
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
    console.log("UserBooksLongListView: ");
    console.log(this.props.navigation.state.params);

    const { query } = this.state;
    const matchedBooks = this.findBook(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    var isRenderItemForAutoComplete = true;

    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: "dodgerblue" }}>
          <Body>
            <Title>Welcome</Title>
            <Subtitle>
              {this.state.userProfile.first_name}{" "}
              {this.state.userProfile.last_name}
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
                renderSeparator={(sectionId, rowId) => (
                  <View key={rowId} style={styles.separator} />
                )}
              />
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

export default UserBooksLongListView;
