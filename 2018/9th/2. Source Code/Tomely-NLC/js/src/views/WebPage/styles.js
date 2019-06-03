const React = require('react-native');

const { Dimensions } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const { StyleSheet } = React;

export default {
  webview: {
    width: deviceWidth/1.1,
    height: deviceHeight
  }
};
