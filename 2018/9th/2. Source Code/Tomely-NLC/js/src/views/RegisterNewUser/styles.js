const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  container: {
    backgroundColor: "#FFF"
  },
  errorTextStyle: {
    fontSize: 20,
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
    height: 140,
    marginBottom: 10,
    resizeMode: "contain",
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
    borderRadius: 50
  },
  datePickerBox:{
   marginTop: 9,
   // borderColor: '#FF5722',
   borderWidth: 0.5,
   padding: 0,
   borderTopLeftRadius: 4,
   borderTopRightRadius: 4,
   borderBottomLeftRadius: 4,
   borderBottomRightRadius: 4,
   height: 50,
   justifyContent:'center'
 },
 datePickerText: {
   fontSize: 14,
   marginLeft: 5,
   borderWidth: 0,
   color: 'white',

 },
};
