import React, { Component } from 'react';

import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

import { Toolbar } from 'react-native-material-ui';

import { TextField } from 'react-native-material-textfield';

import { SubmitRegisterButton } from './Buttons';

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
});


class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      users: require('../../../assets/data/logins.json'),
    }

    this.handleUsername.bind(this);
    this.handlePassword.bind(this);
    this.handleRegister.bind(this);
  }

  handleUsername = (text) => {
    this.setState({ username: text });
  }

  handlePassword = (text) => {
    this.setState({ password: text });
  }

  handleRegister = () => {
    let user = this.state.username
    let pass = this.state.password

    // Checks if there's already a user by the requested name
    if (this.state.users[user] == null) {
      // If there isn't, writes to the asyncstorage with the new login.
      easyAsync.setItem("user:" + user, pass);

      // Logs the user in as who they just registered and go back to the
      // profile screen
      easyAsync.setItem("loggedIn", user);
      alert("Successfully logged in and registered as " + user);
      this.props.navigation.goBack();
      this.props.navigation.navigate("NavigatorScreen");

    } else {
      alert("That username is already taken.")
    }
  }


  render() {
    return (
      <View>

        <Toolbar
          leftElement="arrow-back"
          onLeftElementPress={() => this.props.navigation.goBack()}
          centerElement="Register"
        />

        <View style={styles.formContainer}>

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
            onSubmitEditing={this.handleRegister}
          />

          <View style={styles.button}>
            <SubmitRegisterButton onPress={this.handleRegister} />
          </View>

        </View>

      </View>
    );
  }
}

export default Register;
