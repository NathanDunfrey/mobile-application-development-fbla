const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  imageContainer: {
    flex: 1,
    width: null,
    height: null
  },
  logoContainer: {
    flex: 1,
    marginTop: deviceHeight / 15
  },
  logo: {
    position: "absolute",
    left: Platform.OS === "android" ? 40 : 50,
    top: Platform.OS === "android" ? 35 : 60,
    width: deviceWidth / 1.18,
    height: 200
  },
  text: {
    color: "white",
    fontFamily: "Cochin",
    marginBottom: 6,
    marginTop: 20,
    fontSize: 40,
    fontWeight: "bold"
  },
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  gridContainer: {
    flex: 1,
    alignSelf: "stretch",
    marginBottom: 20
  },
  gridItem: {
    flex: 1,
    alignSelf: "stretch",
    padding: 5,
    width: "100%",
    justifyContent: "center"
  },
  gridContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  gridText: {
    color: "white",
    fontSize: 14,
    textAlign: "justify"
  }
};
