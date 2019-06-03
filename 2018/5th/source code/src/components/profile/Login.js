import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';

import {
  Toolbar,
} from 'react-native-material-ui';

import { TextField } from 'react-native-material-textfield';
import Communications from 'react-native-communications';

import {
  LoginButton,
  LogoutButton,
  RegisterButton,
  ShareBug,
} from './Buttons';

import easyAsync from '../helpers/easyAsync';


// styles for this file
const styles = StyleSheet.create({
  formContainer: {
    margin: 30,
    justifyContent: 'center',
  },
  button: {
    marginVertical: 15,
    marginHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  }
});


class Login extends Component {
  constructor(props) {
    super(props);

    // set data into state
    this.state = {
      loggedIn: false,
      username: '',
      password: '',
      logins: require('../../../assets/data/logins.json'),
    };

    // function definitions
    this.loggedIn = this.loggedIn.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleBug = this.handleBug.bind(this);

    // who's logged in? nobody? somebody?
    this.loggedIn();
  }

  // Finds who's logged in with async value "loggedIn" and sets it in the state
  loggedIn = () => {
    easyAsync.getItem("loggedIn").then((value) => {
      this.setState({loggedIn: value});
    });
  };

  handleLogout = () => {
    easyAsync.setItem("loggedIn", false);
    this.loggedIn(); // Updates who's logged in
  };

  handleLogin = () => {
    let username = this.state.username;
    let password = this.state.password;

    easyAsync.getItem("user:" + username).then((value) => {
      if (this.state.logins[username] == password || value == password) {

        easyAsync.setItem("loggedIn", username);
        this.loggedIn(); // Updates who's logged in
        alert("Successfully logged in as: " + username);

      } else {
        alert("Incorrect username or password.");
      }
    });
  };

  handleRegister = () => {
    this.props.navigation.navigate('RegisterScreen', {
      navigation: this.props.navigation,
    });
  }

  handleUsername = (text) => {
    this.setState({ username: text });
  };

  handlePassword = (text) => {
    this.setState({ password: text });
  };

  // Opens up the user's email client with the below draft already in place
  handleBug = () => {
    Communications.email(
      ['kepoorh@gmail.com'], // to
      null, // cc
      null, // bcc
      "Bug Report", // Subject
      // Body
      "Hey, I want to report a bug! \n\n <Psst, enter your bug here!>"
    );
  };


  render() {

    // If logged in
    let label = "Profile";
    let statusDependentData = <Text style={styles.text}>You're logged in as {this.state.loggedIn}</Text>;
    let profileButton = <LogoutButton onPress={this.handleLogout} />;
    let registerButton = <View></View>;

    if (this.state.loggedIn == false) { // If not logged in

      label = "Login";

      statusDependentData = (
        <View>
          <TextField
            label='Username'
            autofocus={true}
            keyboardType="email-address"
            onChangeText={this.handleUsername}
            onSubmitEditing={(event) => this.refs.Password.focus()}
          />
          <TextField
            ref='Password'
            label='Password'
            secureTextEntry={true}
            onChangeText={this.handlePassword}
            onSubmitEditing={this.handleLogin}
          />
        </View>
      );

      profileButton = <LoginButton onPress={this.handleLogin} />;
      registerButton = <RegisterButton onPress={this.handleRegister} />;
    }

    return (
      <View>

        <Toolbar
          leftElement={
            <Image
              style={{
                height: 35,
                width: 35
              }}
              source={require('../../../assets/img/miskatonic.png')}
            />
          }
          centerElement={label}
        />

        <View style={styles.formContainer}>

          {statusDependentData}

          <View style={styles.button}>
            {profileButton}
          </View>

          <View style={styles.button}>
            {registerButton}
          </View>

          <View style={styles.button}>
            <ShareBug onPress={this.handleBug} />
          </View>

        </View>
      </View>
    );
  }
}

export default Login;
