import React, { Component } from 'react';

import {
  Text,
  Image,
  View,
  StyleSheet,
  FlatList,
} from 'react-native';

import {
  Toolbar,
  ListItem,
} from 'react-native-material-ui';

import easyAsync from '../helpers/easyAsync';


// Styles for this file
const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    margin: 10,
  }
});

// Booklist that can parse a book catalog dictionary
class BookList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.catalog.length > 0) {
      return (
        <View>
          <Text style={styles.text}>{this.props.text}</Text>
          <FlatList
            data={this.props.catalog}
            renderItem={({item}) => {
              return (
                <ListItem
                  divider
                  centerElement={item.title}
                  onPress={() => this.props.onPress(item)}
                />
              );
            }}
          />
        </View>
      );
    } else {
      return(<View></View>);
    }
  }
}


class Library extends Component {
  constructor(props) {
    super(props);

    // Set data into state
    this.state = {
      user: false,
      height: 400,
      catalog: require('../../../assets/data/catalog.json'),
      checkedOut: [],
      reserved: [],
    };

    // Function definitions
    this.getUser = this.getUser.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.updateMyBooks = this.updateMyBooks.bind(this);
    this.renderer = this.renderer.bind(this);

    this.getUser();
    this.updateMyBooks();
  }

  // sets user into state
  getUser = () => {
    easyAsync.getItem("loggedIn").then((value) => {
      this.setState({user: value});
    });
  };

  // Navigates to the check out screen for the book pressed
  handlePress = (item) => {
    this.props.navigation.navigate('CheckOutScreen', {
      navigation: this.props.navigation,
      item: item
    });
  };

  updateMyBooks = () => {
    // Evade a warning with this handy code
    if (this.refs.default) {
      this.setState({checkedOut: []});
      this.setState({reserved: []});
    }

    // Iterate through the complete catalog and check which ones are checked
    // out or reserved in the current user's name
    for (var i = 0; i < this.state.catalog.length; i++) {
      let item = this.state.catalog[i];

      easyAsync.getItem("checkedOut:" + item.title).then((value) => {
        if (value == this.state.user) {
          this.setState({
            checkedOut: this.state.checkedOut.concat([item])
          });
        }
      });

      easyAsync.getItem("reserved:" + item.title).then((value) => {
        if (value == this.state.user) {
          this.setState({
            reserved: this.state.reserved.concat([item])
          });
        }
      });
    }

  };

  // Renders booklists for reserved and checked out
  renderer = () => {
    // If you're logged in
    if (this.state.user != false) {
      // If you have any books checked out or reserved
      if (this.state.checkedOut.length > 0 || this.state.reserved.length > 0) {
        return (
          <View>
            <BookList
              catalog={this.state.checkedOut}
              text="Checked Out"
              onPress={this.handlePress}
            />
            <BookList
              catalog={this.state.reserved}
              text="Reserved"
              onPress={this.handlePress}
            />
          </View>
        );
      } else {
        // You don't have any books checked out or reserved
        return(
          <Text style={{
            fontSize: 20,
            textAlign: 'center',
            margin: 10,
          }}>
            (You don't have any books checked out or reserved!)
          </Text>
        );
      }
    } else {
      // You're not logged in
      return (
        <Text style={{
          fontSize: 20,
          textAlign: 'center',
          margin: 10,
        }}>
          (You're not logged in! You don't have any books!)
        </Text>
      );
    }
  };

  render() {
    // Evade a stupid warning with this ref
    return (
      <View ref="default">

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
          centerElement="My Books"
        />

        {this.renderer()}

      </View>
    );
  }
}

export default Library;
