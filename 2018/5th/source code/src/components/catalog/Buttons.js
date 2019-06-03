import React, { Component } from 'react';

import { Button } from 'react-native-material-ui';


const CheckOutButton = (props) => {
  return (
    <Button
      raised
      accent
      disabled={props.disabled}
      text="Check Out"
      icon="done"
      onPress={props.onPress}
    />
  );
}

const ReturnButton = (props) => {
  return (
    <Button
      raised
      accent
      disabled={props.disabled}
      text="Return"
      icon="done"
      onPress={props.onPress}
    />
  );
}

const ReserveButton = (props) => {
  return (
    <Button
      raised
      accent
      disabled={props.disabled}
      text="Reserve"
      icon="playlist-add"
      onPress={props.onPress}
    />
  );
}

const UnreserveButton = (props) => {
  return (
    <Button
      raised
      accent
      disabled={props.disabled}
      text="Unreserve"
      icon="close"
      onPress={props.onPress}
    />
  );
}

const ShareButton = (props) => {
  return (
    <Button
      raised
      text="Share"
      icon="share"
      onPress={props.onPress}
    />
  );
}

export {
  CheckOutButton,
  ReturnButton,
  ReserveButton,
  UnreserveButton,
  ShareButton
};
