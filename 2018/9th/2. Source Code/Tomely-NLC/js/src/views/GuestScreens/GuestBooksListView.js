import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";

import {
  ListView,
  View,
  Alert,
  TextInput,
  ScrollView,
  Modal,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView
} from "react-native";

import moment from "moment";

import LinearGradient from "react-native-linear-gradient";
import Carousel, { Pagination } from "react-native-snap-carousel";
import {
  sliderWidth,
  itemWidth,
  itemHeight,
  slideWidth,
  sliderHeight
} from "../common/SliderEntry.style";
import SliderEntry from "../common/SliderEntry";
import styles, { colors } from "../common/BooksCarousel.style";
import tomelystyles from "./styles";

const IS_ANDROID = Platform.OS === "android";
const SLIDER_1_FIRST_ITEM = 1;

const width = Dimensions.get("window").width;

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

class GuestBooksListView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ModalVisibleStatus: false,
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      selectedBook: null,
      highSchool: "",

      bookCoverImage:
        "https://heidicvlach.files.wordpress.com/2012/11/notfound.png",

      bookReviews: null,
      books: null,
      query: ""
    };

    this.goToHomePage = this.goToHomePage.bind(this);
  }

  componentWillMount() {
    console.log("componentWillMount");
    console.log(this.props.navigation.state.params);

    this.setState({
      highSchool: this.props.navigation.state.params.highSchool,
      books: this.props.navigation.state.params.books
    });

    this.createDataSource(this.props.navigation.state.params.books);
  }

  createDataSource(books) {
    console.log("Inside createDataSource");
    console.log(books);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(books);

    console.log("this.dataSource");
    console.log(this.dataSource);
  }

  goToHomePage() {
    this.props.navigation.navigate("Home");
  }

  _renderItem({ item, index }) {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        navigation={this.props.navigation}
        accountType={"GUEST"}
      />
    );
  }

  renderBook(books_arr) {
    console.log("Inside renderBook");
    console.log(books_arr);

    return (
      <View>
        <Carousel
          data={books_arr}
          renderItem={this._renderItem.bind(this)}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          inactiveSlideScale={0.95}
          inactiveSlideOpacity={1}
          enableMomentum={true}
          activeSlideAlignment={"start"}
          containerCustomStyle={styles.sliderListView}
          contentContainerCustomStyle={styles.sliderContentContainer}
          activeAnimationType={"spring"}
          removeClippedSubviews={true}
          // vertical={true}
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
    console.log("Inside GuestBooksListView render");

    var all_books_arr = [];
    this.state.books.map(function(data, i) {
      all_books_arr.push({
        data
      });
    });

    var booksGridViews = [];
    while (all_books_arr.length) {
      booksGridViews.push(this.renderBook(all_books_arr.splice(0, 3)));
    }

    return (
      <Container style={tomelystyles.container}>
        <Header style={{ backgroundColor: "dodgerblue", marginTop: 10 }}>
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
            <Subtitle> Welcome Guest</Subtitle>
          </Body>

          <Right style={{ borderBottomWidth: 0 }}>
            <Button
              iconRight
              transparent
              style={styles.mb15}
              onPress={this.goToHomePage}
            >
              <Icon active name="home" />
            </Button>
          </Right>
        </Header>

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
              {booksGridViews}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Container>
    );
  }
}

export default GuestBooksListView;
