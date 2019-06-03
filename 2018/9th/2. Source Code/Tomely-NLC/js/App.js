/* @flow */

import React, { Component } from "react";

import { Platform } from "react-native";
import { Root } from "native-base";
import { StackNavigator } from "react-navigation";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reducers from "./src/reducers";
import ReduxThunk from "redux-thunk";

import AppNavigator from "./AppNavigator";

import { getDatabase, getAuth } from "./firebase";
import { StatusBar } from "react-native";

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

class App extends Component {
  state = {
    loading: true
  };

  componentWillMount() {
    getDatabase();
  }

  /**
   * When the App component mounts, we listen for any authentication
   * state changes in Firebase.
   * Once subscribed, the 'user' parameter will either be null
   * (logged out) or an Object (logged in)
   */
  componentDidMount() {
    this.authSubscription = getAuth().onAuthStateChanged(user => {
      this.setState({
        loading: false,
        user
      });
    });

    StatusBar.setHidden(true);
  }

  /**
   * Don't forget to stop listening for authentication state changes
   * when the component unmounts.
   */
  componentWillUnmount() {
    console.log("Calling componentWillUnmount");
    this.authSubscription();
  }

  render() {
    return (
      <Provider store={store}>
        <Root>
          <AppNavigator />
        </Root>
      </Provider>
    );
  }
}

export default App;
