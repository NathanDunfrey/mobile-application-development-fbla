import React, { Component } from "react";
import { ListView, Image, View, Dimensions } from "react-native";
import styles from "./styles";

import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  Card,
  CardItem,
  Title,
  Subtitle,
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

export const BookLocatorMapImages = {
  A1: require("../../../../img/map-a1.png"),
  A2: require("../../../../img/map-a2.png"),
  A3: require("../../../../img/map-a3.png"),
  A6: require("../../../../img/map-a6.png"),
  A9: require("../../../../img/map-a9.png"),
  A12: require("../../../../img/map-a12.png"),

  B1: require("../../../../img/map-b1.png"),
  B2: require("../../../../img/map-b2.png"),
  B3: require("../../../../img/map-b3.png"),
  B7: require("../../../../img/map-b7.png"),
  B10: require("../../../../img/map-b10.png"),
  B12: require("../../../../img/map-b12.png"),

  C1: require("../../../../img/map-c1.png"),
  C2: require("../../../../img/map-c2.png"),
  C3: require("../../../../img/map-c3.png"),
  C6: require("../../../../img/map-c6.png"),

  D1: require("../../../../img/map-d1.png"),
  D2: require("../../../../img/map-d2.png"),
  D3: require("../../../../img/map-d3.png"),

  E1: require("../../../../img/map-e1.png"),
  E2: require("../../../../img/map-e2.png"),
  E3: require("../../../../img/map-e3.png"),

  F1: require("../../../../img/map-f1.png"),
  F2: require("../../../../img/map-f2.png"),
  F3: require("../../../../img/map-f3.png"),

  G1: require("../../../../img/map-g1.png"),
  G2: require("../../../../img/map-g2.png"),
  G3: require("../../../../img/map-g3.png"),

  H1: require("../../../../img/map-h1.png"),
  H2: require("../../../../img/map-h2.png"),
  H3: require("../../../../img/map-h3.png"),

  I1: require("../../../../img/map-i1.png"),
  I2: require("../../../../img/map-i2.png"),
  I3: require("../../../../img/map-i3.png"),

  A91: require("../../../../img/map-a91.jpg"),
  A92: require("../../../../img/map-a92.jpg"),
  A93: require("../../../../img/map-a93.jpg"),
  A94: require("../../../../img/map-a94.jpg"),
  A95: require("../../../../img/map-a95.jpg"),
  A96: require("../../../../img/map-a96.jpg"),
  A97: require("../../../../img/map-a97.jpg"),
  A98: require("../../../../img/map-a98.jpg"),
  A99: require("../../../../img/map-a99.jpg"),
  A910: require("../../../../img/map-a910.jpg"),
  A911: require("../../../../img/map-a911.jpg"),
  A912: require("../../../../img/map-a912.jpg"),
  A913: require("../../../../img/map-a913.jpg"),
  A914: require("../../../../img/map-a914.jpg"),
  A915: require("../../../../img/map-a915.jpg"),
  A916: require("../../../../img/map-a916.jpg"),
  A917: require("../../../../img/map-a917.jpg"),
  A918: require("../../../../img/map-a918.jpg"),
  A919: require("../../../../img/map-a919.jpg"),
  A920: require("../../../../img/map-a920.jpg")
};

class BookLocator extends Component {
  constructor(props) {
    super(props);
    console.log("Inside BookLocator ctor: " + this.props.bookData);
  }

  componentWillMount() {
    console.log(
      "Inside BookLocator componentWillMount(): " + this.props.bookData
    );
  }

  getImageByIsle(isle) {
    console.log("Inside getImageByIsle: " + isle);
    switch (isle) {
      case "A1":
        return BookLocatorMapImages.A1;
      case "A2":
        return BookLocatorMapImages.A2;
      case "A3":
        return BookLocatorMapImages.A3;
      case "A6":
        return BookLocatorMapImages.A6;
      case "A9":
        return BookLocatorMapImages.A9;
      case "A12":
        return BookLocatorMapImages.A12;

      case "B1":
        return BookLocatorMapImages.B1;
      case "B2":
        return BookLocatorMapImages.B2;
      case "B3":
        return BookLocatorMapImages.B3;
      case "B7":
        return BookLocatorMapImages.B7;
      case "B10":
        return BookLocatorMapImages.B10;
      case "B12":
        return BookLocatorMapImages.B12;

      case "C1":
        return BookLocatorMapImages.C1;
      case "C2":
        return BookLocatorMapImages.C2;
      case "C3":
        return BookLocatorMapImages.C3;
      case "C6":
        return BookLocatorMapImages.C6;

      case "D1":
        return BookLocatorMapImages.D1;
      case "D2":
        return BookLocatorMapImages.D2;
      case "D3":
        return BookLocatorMapImages.D3;

      case "E1":
        return BookLocatorMapImages.E1;
      case "E2":
        return BookLocatorMapImages.E2;
      case "E3":
        return BookLocatorMapImages.E3;

      case "F1":
        return BookLocatorMapImages.F1;
      case "F2":
        return BookLocatorMapImages.F2;
      case "F3":
        return BookLocatorMapImages.F3;

      case "G1":
        return BookLocatorMapImages.G1;
      case "G2":
        return BookLocatorMapImages.G2;
      case "G3":
        return BookLocatorMapImages.G3;

      case "H1":
        return BookLocatorMapImages.H1;
      case "H2":
        return BookLocatorMapImages.H2;
      case "H3":
        return BookLocatorMapImages.H3;

      case "I1":
        return BookLocatorMapImages.I1;
      case "I2":
        return BookLocatorMapImages.I2;
      case "I3":
        return BookLocatorMapImages.I3;

      case "A91":
        return BookLocatorMapImages.A91;
      case "A92":
        return BookLocatorMapImages.A92;
      case "A93":
        return BookLocatorMapImages.A93;
      case "A94":
        return BookLocatorMapImages.A94;
      case "A95":
        return BookLocatorMapImages.A95;
      case "A96":
        return BookLocatorMapImages.A96;
      case "A97":
        return BookLocatorMapImages.A97;
      case "A98":
        return BookLocatorMapImages.A98;
      case "A99":
        return BookLocatorMapImages.A99;
      case "A910":
        return BookLocatorMapImages.A910;
      case "A911":
        return BookLocatorMapImages.A911;
      case "A912":
        return BookLocatorMapImages.A912;
      case "A913":
        return BookLocatorMapImages.A913;
      case "A914":
        return BookLocatorMapImages.A914;
      case "A915":
        return BookLocatorMapImages.A915;
      case "A916":
        return BookLocatorMapImages.A916;
      case "A917":
        return BookLocatorMapImages.A917;
      case "A918":
        return BookLocatorMapImages.A918;
      case "A919":
        return BookLocatorMapImages.A919;
      case "A920":
        return BookLocatorMapImages.A920;

      default:
        return require("../../../../img/library-map.png");
    }
  }

  render() {
    console.log("BookDetails: ");
    console.log(this.props.navigation.state.params.bookData);

    const { title, isle } = this.props.navigation.state.params.bookData;

    if (!this.props.navigation.state.params.bookData) {
      <View
        style={{
          marginTop: 50,
          marginBottom: 50,
          paddingLeft: 10
        }}
      >
        <Text>
          The book cannot be located currently. Please check back later...
        </Text>
      </View>;
    } else {
      console.log("Book ISLE: " + isle);
      const mapImage = this.getImageByIsle(isle);
      return (
        <Container style={styles.container}>
          <Header style={{ backgroundColor: "dodgerblue" }}>
            <Left />
            <Body>
              <Subtitle>Book Locator</Subtitle>
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
            <View style={{ paddingRight: 10, marginTop: 10 }}>
              <Text style={{ fontSize: 20, textAlign: "center" }}>
                Follow the below MAP to locate
              </Text>
              <Text
                style={{
                  fontSize: 25,
                  textAlign: "center",
                  fontFamily: "sans-serif"
                }}
              >
                {title}
              </Text>

              <Image
                style={{
                  height: 500,
                  resizeMode: "contain",
                  width: deviceWidth / 1.1,
                  marginVertical: 5,
                  alignSelf: "center",
                  marginBottom: 20
                }}
                source={mapImage}
              />
            </View>
          </Content>
        </Container>
      );
    }
  }
}

export default BookLocator;
