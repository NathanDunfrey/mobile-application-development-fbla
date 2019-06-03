import React, { Component } from 'react';

import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Share,
} from 'react-native';

import { Toolbar } from 'react-native-material-ui';

import {
  CheckOutButton,
  ReturnButton,
  ReserveButton,
  UnreserveButton,
  ShareButton,
} from './Buttons';

import easyAsync from '../helpers/easyAsync';
import { setNotification } from '../helpers/notifications';


// Styles for this file
const styles = StyleSheet.create({
  rowContainer: {
    margin: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: 8,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  }
});


class CheckOut extends Component {
  constructor(props) {
    super(props);

    // Get params that are passed from CatalogList through react-navigation
    const { params } = this.props.navigation.state;

    // Set the generally default properties of state
    this.state = {
      item: params ? params.item : null,
      title: params ? params.item.title : null,
      checkedOut: null,
      reserved: null,
      user: false,
      checkedOutTime: 60, // 1 minute
    };


    // Function definitions
    this.getUser = this.getUser.bind(this);
    this.pullItemStatus = this.pullItemStatus.bind(this);
    this.handleCheckOut = this.handleCheckOut.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.handleReserve = this.handleReserve.bind(this);
    this.handleUnreserve = this.handleUnreserve.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.signedInText = this.signedInText.bind(this);

    this.getUser();
    this.pullItemStatus();
  }

  // Get the async value of who's logged in.
  getUser = () => {
    easyAsync.getItem("loggedIn").then((value) => {
      this.setState({user: value});
    });
  };

  // Set the state to the corresponding async value of this item
  pullItemStatus = () => {
    easyAsync.getItem("checkedOut:" + this.state.title).then((value) => {
      this.setState({checkedOut: value});
    });
    easyAsync.getItem("reserved:" + this.state.title).then((value) => {
      this.setState({reserved: value});
    });
  };

  // Set checked out async value and a notification for when it needs to be
  // returned.
  handleCheckOut = () => {
    easyAsync.setItem("checkedOut:" + this.state.title, this.state.user)
    .then(() => this.pullItemStatus());

    let t = setNotification(this.state.checkedOutTime,
      'Your book, "' + this.state.title + '" is due!');
    easyAsync.setItem("due:" + this.state.title, t);
    alert('Your book, "' + this.state.title + '" will be due in 1 minute!')
  };

  handleReturn = () => {
    easyAsync.setItem("checkedOut:" + this.state.title, null)
    .then(() => this.pullItemStatus());

    easyAsync.setItem("due:" + this.state.title, null);
  };

  handleReserve = () => {
    easyAsync.setItem("reserved:" + this.state.title, this.state.user)
    .then(() => this.pullItemStatus());
  };

  handleUnreserve = () => {
    easyAsync.setItem("reserved:" + this.state.title, null)
    .then(() => this.pullItemStatus());
  };

  // Share stuff through iOS's and Android's built in share methods
  handleShare = () => {
    Share.share({
      message: 'I found the book "' + this.state.title + '" through this library app! https://github.com/kepoorhampond/library-app',
      url: 'https://github.com/kepoorhampond/library-app',
      title: 'Share this book!'
    }, {
      // Android only:
      dialogTitle: 'Share "' + this.state.title + '" by ' + this.state.item.author,
    });
  };

  // If you're not logged in, tell the user
  signedInText = () => {
    if (this.state.user == false) {
      return (
        <Text style={styles.text}>
          You're not signed in, you can't check out books!
        </Text>
      );
    } else {
      return (<Text></Text>);
    }
  }


  render() {
    let checkOutButton = <Text>Something went wrong.</Text>;
    if (this.state.user == false) {
      // You're not signed in.
      checkOutButton = <CheckOutButton disabled onPress={null} />;
    } else if (this.state.checkedOut == this.state.user) {
      // You have the book and can return it.
      checkOutButton = <ReturnButton onPress={this.handleReturn} />;
    } else if (this.state.checkedOut != this.state.user && this.state.checkedOut != null) {
      // Somebody else has the book so you can't check it out/
      checkOutButton = <CheckOutButton disabled onPress={null} />;
    } else {
      // The book is free to check out.
      checkOutButton = <CheckOutButton onPress={this.handleCheckOut} />;
    }

    let reserveButton = <Text>Something went wrong.</Text>;
    if (this.state.user == false) {
      // You're not signed in.
      reserveButton = <ReserveButton disabled onPress={null} />;
    } else if (this.state.reserved == this.state.user) {
      // You have the book reserved and you can unreserve it.
      reserveButton = <UnreserveButton onPress={this.handleUnreserve} />;
    } else if (this.state.reserved != this.state.user && this.state.reserved != null) {
      // Somebody else has the book reserved so you can't.
      reserveButton = <ReserveButton disabled onPress={null} />;
    } else {
      // The book is free to reserve.
      reserveButton = <ReserveButton onPress={this.handleReserve} />;
    }

    return(
      <View>

        <Toolbar
          leftElement="arrow-back"
          onLeftElementPress={() => this.props.navigation.goBack()}
          centerElement={this.state.title}
        />

        <ScrollView>

          <Image
            source={{uri: this.state.item.cover.url}}
            resizeMode={'cover'}
            style={{ width: '100%', height: 300 }}
          />

          <Text style={styles.text}>
            <Text style={{fontWeight: 'bold'}}>{this.state.item.title}</Text>
            {' '}by{' '}
            <Text style={{fontStyle: 'italic'}}>{this.state.item.author}</Text>
          </Text>

          <View style={styles.rowContainer}>
            <View style={styles.button}>
              {checkOutButton}
            </View>

            <View style={styles.button}>
              {reserveButton}
            </View>
          </View>

          {this.signedInText()}

          <View style={styles.rowContainer}>
            <View style={styles.button}>
              <ShareButton onPress={this.handleShare} />
            </View>
          </View>

        </ScrollView>

      </View>
    );
  }
}


export default CheckOut;
