const React = require("react-native");

const { StyleSheet } = React;

export default {
  container: {
    backgroundColor: "#FFF"
  },
  text: {
    alignSelf: "center"
  },
  mb: {
    marginBottom: 15
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "black"
  },
  ModalInsideView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: 600,
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  },
  inputContainer: {
    borderLeftWidth: 4,
    borderRightWidth: 4,
    height: 70
  }
};
