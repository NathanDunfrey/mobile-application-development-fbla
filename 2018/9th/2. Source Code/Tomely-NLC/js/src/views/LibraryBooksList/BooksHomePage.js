import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Alert,
  ListView,
  View,
  ScrollView,
  TextInput,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import FastImage from "react-native-fast-image";

import { fetchAllBooks } from "../../actions";
import { fetchOverdueBooksByUser } from "../../actions";

import {
  sendCheckedOutEmail,
  sendBookReservedEmail
} from "../EmailNotifications";

import tomelystyles from "./styles";
import moment from "moment";
import { getAuth } from "../../../firebase";

import LinearGradient from "react-native-linear-gradient";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { sliderWidth, itemWidth } from "../common/SliderEntry.style";
import SliderEntry from "../common/SliderEntry";
import styles, { colors } from "../common/BooksCarousel.style";

const IS_ANDROID = Platform.OS === "android";
const SLIDER_1_FIRST_ITEM = 1;

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

class BooksHomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      searchText: "",
      selectedBook: null,

      bookCoverImage:
        "https://heidicvlach.files.wordpress.com/2012/11/notfound.png",

      query: ""
    };

    this.goToAllBooksScreen = this.goToAllBooksScreen.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillMount() {
    this.setState({
      query: ""
    });
    this.props.fetchAllBooks();
    this.createDataSource(this.props);
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

  goToAllBooksScreen() {
    console.log("Inside goToAllBooks. Navigating to UserBooksLongListView");
    this.props.navigation.navigate("UserBooksLongListView", {
      books: this.props.all_books,
      userProfile: this.props.userProfile,
      highSchool: "Middleton"
    });
  }

  logout() {
    // logout, once that is complete, return the user to the login screen.
    console.log(
      "inside BooksHomePage logout(): " + this.props.userProfile.member_type
    );

    var accountType = "STUDENT";
    if (this.props.userProfile.member_type !== "STUDENT") {
      accountType = "TEACHER";
    }

    getAuth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate("LoginScreen", {
          accountType: accountType
        });
      });
  }

  _renderItem({ item, index }) {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        navigation={this.props.navigation}
        accountType={"NON-GUEST"}
      />
    );
  }

  _renderItemWithParallax({ item, index }, parallaxProps) {
    // console.log("Inside _renderItemWithParallax");
    // console.log(index + " -- " + item);

    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
        navigation={this.props.navigation}
        accountType={"NON-GUEST"}
      />
    );
  }

  displayNewReleases(title, subtitle, books_arr) {
    const { slider1ActiveSlide } = this.state;
    console.log("Inside displayNewReleases");
    console.log(books_arr);
    return (
      <View style={styles.exampleContainer}>
        <Text style={styles.title}>{`${title}`}</Text>
        <Carousel
          ref={c => (this._slider1Ref = c)}
          data={books_arr}
          renderItem={this._renderItemWithParallax.bind(this)}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          firstItem={SLIDER_1_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          // inactiveSlideShift={20}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          loop={true}
          loopClonesPerSide={2}
          autoplay={true}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={index => this.setState({ slider1ActiveSlide: index })}
        />
        <Pagination
          dotsLength={books_arr.length}
          activeDotIndex={slider1ActiveSlide}
          containerStyle={styles.paginationContainer}
          dotColor={"rgba(255, 255, 255, 0.92)"}
          dotStyle={styles.paginationDot}
          inactiveDotColor={colors.black}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          carouselRef={this._slider1Ref}
          tappableDots={!!this._slider1Ref}
        />
      </View>
    );
  }

  displayBooksByGenre(title, subtitle, books_arr) {
    console.log("Inside displayBooksByGenre");
    console.log(books_arr);

    return (
      <View style={styles.exampleContainer}>
        <Text style={styles.title}>{`${title}`}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Carousel
          data={books_arr}
          renderItem={this._renderItem.bind(this)}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          inactiveSlideScale={0.95}
          inactiveSlideOpacity={1}
          enableMomentum={true}
          activeSlideAlignment={"start"}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          activeAnimationType={"spring"}
          activeAnimationOptions={{
            friction: 4,
            tension: 40
          }}
        />
      </View>
    );
  }

  displayAllBooks(title, subtitle, books_arr) {
    return (
      <View style={styles.exampleContainer}>
        <Text style={styles.title}>{`${title}`}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Carousel
          data={books_arr}
          renderItem={this._renderItem.bind(this)}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          inactiveSlideScale={0.95}
          inactiveSlideOpacity={1}
          enableMomentum={true}
          activeSlideAlignment={"start"}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          activeAnimationType={"spring"}
          activeAnimationOptions={{
            friction: 4,
            tension: 40
          }}
        />
      </View>
    );
  }

  get gradient() {
    return (
      <LinearGradient
        colors={[colors.background1, colors.background2]}
        startPoint={{ x: 1, y: 0 }}
        endPoint={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
    );
  }

  render() {
    console.log("Inside BooksHomePage");
    console.log(this.props.all_books);
    console.log("this.props.navigation");
    console.log(this.props.navigation);

    const newReleaseSection = this.displayNewReleases(
      "New Releases",
      "",
      this.props.new_release_arr
    );

    const fictionBookSection = this.displayBooksByGenre(
      "Fiction",
      "Youth Fiction, Dystopian Fiction",
      this.props.fiction_books_arr
    );

    const tragedyBooksSection = this.displayBooksByGenre(
      "Tragedy",
      "Tragicomedy, Tragedy",
      this.props.tragedy_books_arr
    );

    const actionBooksSection = this.displayBooksByGenre(
      "Action",
      "Action & Adventure, Survival Stories",
      this.props.action_books_arr
    );

    if (_.isEmpty(this.props.all_books)) {
      return <View />;
    }

    return (
      <Container style={tomelystyles.container}>
        <Header
          style={{
            backgroundColor: "dodgerblue"
          }}
        >
          <Left>
            <Button dark block onPress={this.goToAllBooksScreen}>
              <Text style={{ color: "white", fontSize: 12 }}>All Books</Text>
            </Button>
          </Left>

          <Body style={{ marginLeft: 20 }}>
            <Title>Welcome</Title>
            <Subtitle>
              {this.props.userProfile.first_name}{" "}
              {this.props.userProfile.last_name}
            </Subtitle>
          </Body>

          <Right>
            <Button block dark onPress={this.logout}>
              <Icon name="log-out" />
              {/*<Text style={{ fontSize: 12 }}>Log Out</Text>*/}
            </Button>
          </Right>
        </Header>

        <Content keyboardShouldPersistTaps="always">
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
              <StatusBar
                translucent={true}
                backgroundColor={"rgba(0, 0, 0, 0.3)"}
                barStyle={"light-content"}
              />
              {this.gradient}
              <ScrollView
                style={styles.scrollview}
                scrollEventThrottle={200}
                directionalLockEnabled={true}
                keyboardShouldPersistTaps="always"
              >
                {!_.isEmpty(this.props.new_release_arr) && newReleaseSection}
                {!_.isEmpty(this.props.fiction_books_arr) && fictionBookSection}
                {!_.isEmpty(this.props.action_books_arr) && tragedyBooksSection}
                {!_.isEmpty(this.props.tragedy_books_arr) && actionBooksSection}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  console.log("mapStateToProps BooksHomePage state: ");
  console.log(state);

  var new_release_arr = [];
  var fiction_books_arr = [];
  var tragedy_books_arr = [];
  var action_books_arr = [];

  if (!_.isEmpty(state.all_books)) {
    state.all_books.map(function(data, i) {
      if (data.new_arrival) {
        new_release_arr.push({
          data
        });
      }

      if (data.genre.match(/fiction/i)) {
        fiction_books_arr.push({
          data
        });
      }

      if (data.genre.match(/trag/i)) {
        tragedy_books_arr.push({
          data
        });
      }

      if (data.genre.match(/action|adventure/i)) {
        action_books_arr.push({
          data
        });
      }
    });
  }

  var new_release_arr_top6 = [];
  // Limit the new release array to 5 books
  if (!_.isEmpty(new_release_arr) && new_release_arr.length > 6) {
    new_release_arr_top6 = new_release_arr.slice(0, 6);
  }

  return {
    all_books: state.all_books,
    user_books_overdue: state.user_books_overdue,
    tragedy_books_arr: tragedy_books_arr,
    fiction_books_arr: fiction_books_arr,
    new_release_arr: !_.isEmpty(new_release_arr_top6)
      ? new_release_arr_top6
      : new_release_arr,
    action_books_arr: action_books_arr
  };
};

export default connect(mapStateToProps, {
  fetchAllBooks,
  fetchOverdueBooksByUser
})(BooksHomePage);
