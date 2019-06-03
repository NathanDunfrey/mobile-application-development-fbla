const React = require("react-native");

const { StyleSheet } = React;

export default {
  text: {
    alignSelf: "center"
  },
  mb: {
    marginBottom: 15
  },
  container: {
    justifyContent: "center",
    marginTop: 5,
    padding: 15,
    backgroundColor: "#ffffff",
    flex: 1
  },
  buttons: {
    justifyContent: "space-between",
    marginTop: 5,
    padding: 10,
    backgroundColor: "#ffffff",
    flex: 1,
    flexDirection: "row"
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
  datePickerBox: {
    marginTop: 9,
    // borderColor: '#FF5722',
    borderWidth: 0.5,
    padding: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 50,
    justifyContent: "center"
  },
  datePickerText: {
    fontSize: 14,
    marginLeft: 5,
    borderWidth: 0,
    color: "white"
  },
  searchContainer: {
    flex: 1,
    paddingTop: 5,
    borderWidth: 0
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
    fontSize: 15,
    margin: 2
  }
};
