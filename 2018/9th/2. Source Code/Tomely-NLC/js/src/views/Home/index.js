import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "firebase";
import moment from "moment";
import { getDatabase } from "../../../firebase";
import FastImage from "react-native-fast-image";

import {
  Image,
  ImageBackground,
  View,
  Dimensions,
  TouchableOpacity
} from "react-native";

import { Container, Button, Text } from "native-base";

import styles from "./styles";
import SquareGrid from "react-native-square-grid";
import { fetchBooksToSendReminders } from "../../actions";
import { checkAndSendAlerts } from "../Utils";
import Constants from "../Constants/constants";
import homeScreenButtonData from "./data";

// Set to zero in portrait mode to enable scrolling
var LONGER_LENGTH = 3;

// Set to zero in landscape mode to enable scrolling
var SHORTER_LENGTH = 2;

function getOrientation() {
  var dimensions = Dimensions.get("window");
  return dimensions.width > dimensions.height ? "landscape" : "portrait";
}

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orientation: getOrientation()
    };

    console.log("Inside Home.js constructor");
    this._handleLayout = this.handleLayout.bind(this);
  }

  componentDidMount() {
    console.log("Inside componentDidMount Home.js");
    this.props.fetchBooksToSendReminders();
  }

  handleLayout() {
    this.setState({
      orientation: getOrientation()
    });
  }

  render() {
    var orientation = this.state.orientation;
    var isLandscape = orientation === "landscape";

    var columns = isLandscape ? LONGER_LENGTH : SHORTER_LENGTH;
    var rows = isLandscape ? SHORTER_LENGTH : LONGER_LENGTH;
    console.log("Inside Home.js Render()");
    console.log(this.props.navigation);

    return (
      <Container style={styles.container}>
        <ImageBackground
          source={Constants.launchscreenBg}
          style={styles.imageContainer}
        >
          <View style={styles.logoContainer}>
            <FastImage
              source={Constants.launchscreenLogo}
              style={styles.logo}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>

          <View style={styles.gridContainer} onLayout={this._handleLayout}>
            <SquareGrid
              rows={2}
              columns={3}
              items={homeScreenButtonData}
              renderItem={item => (
                <View style={styles.gridItem}>
                  <View style={styles.gridContent}>
                    <TouchableOpacity
                      activeOpacity={0.3}
                      onPress={() =>
                        this.props.navigation.navigate(item.route, {
                          accountType: item.accountType
                        })
                      }
                    >
                      <Image
                        source={item.icon}
                        style={{ height: 90, width: 90 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </ImageBackground>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  console.log("mapStateToProps Home.js state: ");
  console.log(state);

  checkAndSendAlerts(state.books_due_for_reminder);

  return {
    books_due_for_reminder: state.books_due_for_reminder
  };
};

export default connect(mapStateToProps, { fetchBooksToSendReminders })(Home);
