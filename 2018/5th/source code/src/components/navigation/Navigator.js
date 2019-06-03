import React, { Component } from 'react';

import {
  View,
  StatusBar
} from 'react-native';

import {
  BottomNavigation,
} from 'react-native-material-ui';

import { StackNavigator } from 'react-navigation';

// Things to navigate to
import Catalog from '../catalog/Catalog';
import CheckOut from '../catalog/CheckOut';
import Library from '../library/Library';
import Map from '../map/Map';
import Login from '../profile/Login';
import Register from '../profile/Register';

// Things that are nice and help
import Container from '../helpers/Container';
import easyAsync from '../helpers/easyAsync';


// Renderes content based upon which button is selected
class ContentRenderer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.state.buttons[this.props.state.active].content}
      </View>
    );
  }
}


class Navigator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // the default button to start with
      active: "0",

      // each of the buttons and their data/where they correspond to
      buttons: [
        {
          key: "0",
          label: "Browse",
          icon: "local-library",
          // pass navigation so that it's able to navigate to the check out
          // screen
          content: <Catalog
            navigation={this.props.navigation}
          />
        },
        {
          key: "1",
          label: "Yours",
          icon: "playlist-add-check",
          // pass navigation so that it's able to navigate to the check out
          // screen
          content: <Library
            navigation={this.props.navigation}
          />
        },
        {
          key: "2",
          label: "Map",
          icon: "map",
          content: <Map />
        },
        {
          key: "3",
          label: "Profile",
          icon: "account-circle",
          content: <Login
            navigation={this.props.navigation}
          />
        },
      ]
    };

    // Iterate through the buttons above and parse them into actual buttons,
    // icons, and actions
    this.buttons = this.state.buttons.map((button) => {
      return (
        <BottomNavigation.Action
          key={button.key}
          icon={button.icon}
          label={button.label}
          onPress={() => {
            this.setState({active: button.key});
          }}
        />
      );
    });

    // A fix in case the status of the user being logged in is lost, meaning if
    // it finds the async "loggedIn" value to be null rather than false, it
    // resets it to false.
    easyAsync.getItem("loggedIn").then((value) => {
      if (value == null) {
        easyAsync.setItem("loggedIn", false);
      }
    });

  }

  render() {
    return (
      <Container>
        <StatusBar hidden={true} />

        <ContentRenderer state={this.state} />

        <BottomNavigation active={this.state.active} >

          {this.buttons}

        </BottomNavigation>
      </Container>
    );
  }
}

// The RootStack navigator, which allows the navigation into the CheckOutScreen
const RootStack = StackNavigator(
  {
    NavigatorScreen: {
      screen: Navigator,
    },
    CheckOutScreen: {
      screen: CheckOut,
    },
    RegisterScreen: {
      screen: Register,
    },
  },
  {
    initialRouteName: 'NavigatorScreen',
    navigationOptions: {
      header: null
    }
  },
);

export default RootStack;
