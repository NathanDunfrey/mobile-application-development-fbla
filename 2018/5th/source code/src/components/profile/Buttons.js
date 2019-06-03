import React, { Component } from 'react';

import { Button } from 'react-native-material-ui';


const LoginButton = (props) => {
  return (
    <Button
      raised
      accent
      text="Login"
      icon="exit-to-app"
      onPress={props.onPress}
    />
  );
};

const LogoutButton = (props) => {
  return (
    <Button
      raised
      accent
      text="Logout"
      icon="exit-to-app"
      onPress={props.onPress}
    />
  );
};


const RegisterButton = (props) => {
  return (
    <Button
      raised
      accent
      text="New? Register here!"
      icon="account-box"
      onPress={props.onPress}
    />
  );
};

const SubmitRegisterButton = (props) => {
  return (
    <Button
      raised
      accent
      text="Register"
      icon="check-circle"
      onPress={props.onPress}
    />
  );
};

const ShareBug = (props) => {
  return (
    <Button
      raised
      text="Found a Bug? Press me!"
      icon="contact-mail"
      onPress={props.onPress}
    />
  );
};

export {
  LoginButton,
  LogoutButton,
  RegisterButton,
  SubmitRegisterButton,
  ShareBug,
};
