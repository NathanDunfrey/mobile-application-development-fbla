import React, { Component } from "react";
import {
  Platform,
  View,
  ScrollView,
  Text,
  StatusBar,
  SafeAreaView
} from "react-native";

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
  Item,
  Input,
  Thumbnail,
  Left,
  Label,
  Picker,
  Body,
  Right
} from "native-base";

import LinearGradient from "react-native-linear-gradient";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { sliderWidth, itemWidth } from "../common/SliderEntry.style";
import SliderEntry from "../common/SliderEntry";
import styles, { colors } from "../common/BooksCarousel.style";

import { mhs_books } from "./static/data/mhs_book_data";
import { ghs_books } from "./static/data/ghs_book_data";

import tomelystyles from "./styles";

const IS_ANDROID = Platform.OS === "android";
const SLIDER_1_FIRST_ITEM = 1;

class GuestBooksCarousel extends Component {
  constructor(props) {
    console.log("GuestBooksCarousel constructor()");
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      books: mhs_books,
      highSchool: "Middleton",
      navigation: this.props.navigation
    };

    this.goToAllBooksScreen = this.goToAllBooksScreen.bind(this);
    this._renderItemWithParallax = this._renderItemWithParallax.bind(this);
    this._renderItem = this._renderItem.bind(this);
  }

  componentWillMount() {
    console.log("GuestBooksCarousel componentWillMount");
    console.log(this.props.navigation.state.params);

    console.log("this.props.navigation");
    console.log(this.props.navigation);

    this.setState({
      highSchool: this.props.navigation.state.params.highSchool,
      navigation: this.props.navigation
    });

    if (this.props.navigation.state.params.highSchool === "Middleton") {
      this.setState({ books: mhs_books });
    } else {
      this.setState({ books: ghs_books });
    }
  }

  goToHomePage() {
    this.props.navigation.navigate("Home");
  }

  goToAllBooksScreen() {
    console.log("Inside goToAllBooks");
    this.props.navigation.navigate("GuestBooksLongList", {
      books: this.state.books,
      highSchool: this.state.highSchool
    });
  }

  _renderItem({ item, index }) {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        navigation={this.state.navigation}
        accountType={"GUEST"}
      />
    );
  }

  _renderItemWithParallax({ item, index }, parallaxProps) {
    console.log("Inside _renderItemWithParallax");
    console.log(index + " -- " + item);

    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
        navigation={this.state.navigation}
        accountType={"GUEST"}
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
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Carousel
          ref={c => (this._slider1Ref = c)}
          data={books_arr}
          renderItem={this._renderItemWithParallax}
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
    return (
      <View style={styles.exampleContainer}>
        <Text style={styles.title}>{`${title}`}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Carousel
          data={books_arr}
          renderItem={this._renderItem}
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
          renderItem={this._renderItem}
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
        <Button
          small
          bordered
          style={{ marginLeft: 10 }}
          onPress={this.goToAllBooksScreen}
        >
          <Text style={{ color: "black", fontWeight: "bold" }}>More</Text>
          <Icon name="ios-more" color="black" />
        </Button>
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
    console.log("Inside GuestBooksCarousel");
    console.log(this.state.books);
    console.log("this.props.navigation");
    console.log(this.props.navigation);

    var new_release_arr = [];
    var fiction_books_arr = [];
    var tragedy_books_arr = [];
    var action_books_arr = [];

    this.state.books.map(function(data, i) {
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

      if (data.new_arrival) {
        new_release_arr.push({
          data
        });
      }
    });

    var new_release_arr_top6 = [];
    // Limit the new release array to 5 books
    if (!_.isEmpty(new_release_arr) && new_release_arr.length > 6) {
      new_release_arr_top6 = new_release_arr.slice(0, 6);
    }

    const newReleaseSection = this.displayNewReleases(
      "New Releases",
      "",
      !_.isEmpty(new_release_arr_top6) ? new_release_arr_top6 : new_release_arr
    );

    const fictionBookSection = this.displayBooksByGenre(
      "Fiction",
      "Youth Fiction, Dystopian Fiction",
      fiction_books_arr
    );

    const tragedyBooksSection = this.displayBooksByGenre(
      "Tragedy",
      "Tragicomedy, Tragedy",
      tragedy_books_arr
    );

    const actionBooksSection = this.displayBooksByGenre(
      "Action",
      "Action & Adventure, Survival Stories",
      action_books_arr
    );

    return (
      <Container style={tomelystyles.container}>
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
            <Button dark onPress={this.goToAllBooksScreen}>
              <Text style={{ color: "white" }}>All Books</Text>
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
                {!_.isEmpty(new_release_arr) && newReleaseSection}
                {!_.isEmpty(fiction_books_arr) && fictionBookSection}
                {!_.isEmpty(tragedy_books_arr) && tragedyBooksSection}
                {!_.isEmpty(action_books_arr) && actionBooksSection}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Content>
      </Container>
    );
  }
}

export default GuestBooksCarousel;
