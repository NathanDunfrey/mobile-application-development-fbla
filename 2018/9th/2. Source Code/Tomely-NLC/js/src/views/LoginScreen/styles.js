const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  container: {
    backgroundColor: "#FFF"
  },
  errorTextStyle: {
    fontSize: 14,
    alignSelf: "center",
    color: "red"
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center"
    // marginTop: deviceHeight / 20,
    // marginBottom: 5
  },
  imageContainer: {
    flex: 1,
    width: null,
    height: null
  },
  logo: {
    width: deviceWidth / 1,
    height: 100,
    marginBottom: 10,
    justifyContent: "center"
  },
  socialIconStyle: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "dodgerblue",
    marginLeft: 20,
    borderRadius: 50
  },
  youtubeIconStyle: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "white",
    marginLeft: 20,
    borderRadius: 50
  }
};
