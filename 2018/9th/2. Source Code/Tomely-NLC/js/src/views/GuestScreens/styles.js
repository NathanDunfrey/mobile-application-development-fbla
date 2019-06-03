const React = require("react-native");

const { StyleSheet } = React;

export default {
  container: {
    backgroundColor: "#FFF",
    flex: 1,
    justifyContent: "center"
  },
  text: {
    alignSelf: "center",
    marginTop: 3,
    marginBottom: 3,
    fontSize: 12
  },
  label: {
    fontWeight: "bold",
    fontSize: 12
  },
  mb15: {
    marginBottom: 5
  },
  radioStyle: {
    borderRightWidth: 1,
    borderColor: "#2196f3",
    paddingRight: 10
  },
  radioButtonWrap: {
    marginRight: 5
  },
  dialogContentView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#8E8E8E"
  },

  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
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

  TextStyle: {
    fontSize: 20,
    marginBottom: 20,
    color: "#fff",
    padding: 20,
    textAlign: "center"
  },
  searchContainer: {
    flex: 1,
    paddingTop: 5,
    marginBottom: 5
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1
  },
  itemText: {
    fontSize: 12,
    margin: 2
  }
};
