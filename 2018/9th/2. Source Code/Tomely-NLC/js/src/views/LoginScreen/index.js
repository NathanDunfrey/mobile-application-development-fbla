import React, { Component } from "react";
import firebase from "firebase";
import {
  Image,
  ImageBackground,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  Keyboard
} from "react-native";
import FastImage from "react-native-fast-image";

import { getDatabase, getAuth } from "../../../firebase";

import {
  Container,
  Header,
  Button,
  Card,
  Item,
  Input,
  Body,
  Left,
  Right,
  Icon,
  Form,
  Text
} from "native-base";

import styles from "./styles";
import AddSocialIcons from "../WebPage/AddSocialIcons";
import Constants from "../Constants/constants";

const deviceWidth = Dimensions.get("window").width;

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: "",
      loading: false,
      accountType: "",
      isAdminAccount: false
    };

    this.goToHomePage = this.goToHomePage.bind(this);
    this.goToSignup = this.goToSignup.bind(this);
    this.continueAsGuest = this.continueAsGuest.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    console.log("Inside StudentLogin componentDidMount() ");
    console.log(this.props.navigation.state.params);
    this.setState({
      accountType: this.props.navigation.state.params.accountType
    });

    if (this.props.navigation.state.params.accountType === "ADMIN") {
      this.setState({ isAdminAccount: true });
    }
  }

  goToForgotPassword() {
    this.props.navigation.navigate("ForgotPassword");
  }

  goToHomePage() {
    this.props.navigation.navigate("Home");
  }

  continueAsGuest() {
    console.log("Navigation to Browse Books as Guest");
    this.props.navigation.navigate("SchoolSelector");
  }

  goToSignup() {
    console.log("Navigation to RegisterNewUser");
    this.props.navigation.navigate("RegisterNewUser");
  }

  async login() {
    try {
      console.log("inside login()");
      const { email, password } = this.state;

      this.setState({ error: "", loading: true });

      await getAuth()
        .signInWithEmailAndPassword(email, password)
        .then(userData => {
          this.setState({ loading: false, error: "" });

          console.log("userData: " + userData.uid);

          getDatabase()
            .ref(`/middletonhighschool/users/${userData.uid}/profile`)
            .once("value", snapshot => {
              var profileData = snapshot.val();
              console.log(profileData);
              if (profileData.member_type !== this.state.accountType) {
                Alert.alert(
                  "Login Error",
                  "The login credentials provided does not belong to the " +
                    this.state.accountType +
                    " account. Please retry login with correct account type."
                );
                this.props.navigation.navigate("Home");
              } else {
                // Dismiss keyboard after successful login
                Keyboard.dismiss();

                if (this.state.accountType === "ADMIN") {
                  this.props.navigation.navigate("AdminScreens");
                } else {
                  this.props.navigation.navigate("UserHomeScreenTab");
                }
              }
            })
            .catch(error => {
              // Handle Errors here.
              var errorMessage = error.code + " -- " + error.message;
              console.log("Error during authentication: " + errorMessage);
              this.setState({
                error: errorMessage,
                loading: false
              });
            });
        })
        .catch(error => {
          // Handle Errors here.
          var errorMessage = error.code + " -- " + error.message;
          console.log("Error during authentication: " + errorMessage);
          this.setState({
            error: errorMessage,
            loading: false
          });
        });
    } catch (error) {
      console.log(error.toString());
    }
  }

  render() {
    // console.log("Inside LoginScreen render() ");
    // console.log(this.props.navigation.state.params);

    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: "#1A1A1A" }}>
          <Body style={{ borderBottomWidth: 0 }} />
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

        <ImageBackground
          source={Constants.launchscreenBg}
          style={styles.imageContainer}
        >
          <FastImage
            source={Constants.launchscreenLogo}
            style={styles.logo}
            resizeMode={FastImage.resizeMode.contain}
          />
          <Form style={{ marginBottom: 15, paddingRight: 20 }}>
            <Item>
              <Icon
                active
                name="mail"
                style={{ color: "white", fontSize: 20 }}
              />
              <Input
                style={{ color: "white", fontSize: 20 }}
                placeholder="Email"
                placeholderTextColor="white"
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
              />
            </Item>
            <Item last="last">
              <Icon
                active
                name="lock"
                style={{ color: "white", marginTop: 30, fontSize: 20 }}
              />
              <Input
                style={{ color: "white", fontSize: 20, marginTop: 20 }}
                secureTextEntry
                placeholder="Password"
                placeholderTextColor="white"
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
              />
            </Item>
          </Form>
          <Text style={styles.errorTextStyle}>{this.state.error}</Text>
          {/*<Button
            transparent
            info
            style={{alignSelf: 'center'}}
            onPress={this.goToForgotPassword.bind(this)}
          >
            <Text>Forgot Password</Text>
          </Button> */}
          <Button
            block
            small
            style={{
              margin: 15,
              backgroundColor: "dodgerblue"
            }}
            //  onPress={() => this.props.navigation.navigate("BooksScreenTab")}
            onPress={this.login}
          >
            <Text style={{ fontSize: 14, alignSelf: "center" }}>Sign In</Text>
          </Button>
          {!this.state.isAdminAccount && (
            <Button
              block
              small
              transparent
              bordered
              style={{
                margin: 15,
                marginBottom: 10,
                borderColor: "dodgerblue"
              }}
              onPress={this.goToSignup}
            >
              <Text
                style={{ fontSize: 14, color: "white", alignSelf: "center" }}
              >
                Register
              </Text>
            </Button>
          )}
          {!this.state.isAdminAccount && (
            <Button
              block
              small
              transparent
              bordered
              style={{
                margin: 15,
                marginBottom: 10,
                borderColor: "dodgerblue"
              }}
              onPress={this.continueAsGuest}
            >
              <Text
                style={{ fontSize: 14, color: "white", alignSelf: "center" }}
              >
                Continue as guest
              </Text>
            </Button>
          )}

          {this.state.isAdminAccount && (
            <View
              style={{
                marginBottom: 70
              }}
            />
          )}
          <AddSocialIcons navigation={this.props.navigation} />
        </ImageBackground>
      </Container>
    );
  }
}

export default LoginScreen;
