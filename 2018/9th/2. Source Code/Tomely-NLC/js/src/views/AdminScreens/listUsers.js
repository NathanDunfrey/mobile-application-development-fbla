import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  ListView,
  Alert,
  View,
  Item,
  TextInput,
  Modal,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";

import styles from "./styles";
import { getDatabase } from "../../../firebase";

import { fetchAllUsers } from "../../actions";
import { fetchBooksToSendReminders } from "../../actions";

import { sendAdminReminders } from "../Utils";

import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  List,
  ListItem,
  Text,
  Thumbnail,
  Left,
  Body,
  Right,
  InputGroup,
  Input
} from "native-base";
import moment from "moment";
import FastImage from "react-native-fast-image";
import { StatusBar } from "react-native";

import AdminBooksList from "./listBooks";

const deviceWidth = Dimensions.get("window").width;

class AdminUsersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedUser: null,
      searchedUsers: [],
      userBooks: [],
      query: "",
      dataSource: null
    };

    this.sendRemindersForBooksDueInAWeek = this.sendRemindersForBooksDueInAWeek.bind(
      this
    );
  }

  componentWillMount() {
    this.setState({
      searchedUsers: [],
      searchTypeValue: 0,
      searchTypeIndex: 0,
      searchText: "",
      userBooks: []
    });
    this.props.fetchAllUsers();
    this.createDataSource(this.props);

    StatusBar.setHidden(true);
    this.props.fetchBooksToSendReminders();
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log("Inside componentWillReceiveProps: nextProps");
    console.log(nextProps);
    this.createDataSource(nextProps);
  }

  createDataSource({ all_user_profiles }) {
    console.log("Inside createDataSource");

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    console.log("ds from createDataSource");
    console.log(ds);

    this.setState({
      dataSource: ds.cloneWithRows(all_user_profiles)
    });

    console.log(this.state.dataSource);
  }

  findUser(query) {
    if (query === "") {
      return [];
    }

    const regex = new RegExp(`${query.trim()}`, "i");
    return this.props.all_user_profiles.filter(
      profile => profile.last_name.search(regex) >= 0
    );
  }

  //On Press for checkoutBook
  viewUserBooksActivity = user => () => {
    console.log("User first_name", user.first_name);
    console.log("User last_name", user.last_name);
    console.log("User ID", user.user_id);
    this.setState({ selectedUser: user });

    getDatabase()
      .ref(`/middletonhighschool/users/${user.user_id}/books`)
      .on("value", snapshot => {
        console.log(snapshot.val());
        var items = [];

        snapshot.forEach(child => {
          items.push({
            book_data: child.val(),
            key: child.key
          });
        });

        if (snapshot.val() !== null) {
          this.setState({ userBooks: items });
          this.props.navigation.navigate("UserBooksActivity", {
            userBooks: items,
            userProfile: user
          });
        } else {
          this.setState({ userBooks: null });
          Alert.alert("Info", "The selected user has no Books activity");
        }
      });
  };

  //On Press for checkoutBook
  viewUserProfileDetails = user => () => {
    console.log("User first_name", user.first_name);
    console.log("User last_name", user.last_name);
    console.log("User ID", user.user_id);
    this.setState({ selectedUser: user });
    this.props.navigation.navigate("UserProfileDetailsAdmin", {
      userProfile: user
    });
  };

  sendRemindersForBooksDueInAWeek() {
    console.log("Inside sendRemindersForBooksDueInAWeek");

    Alert.alert(
      "Confirm",
      "Do you wish to send reminders for all books due within a week?",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Cancel Pressed");
            return;
          },
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            console.log("OK Pressed");
            sendAdminReminders(this.props.books_due_for_reminder);
            Alert.alert("Success", "Email reminders sent successfully");
          }
        }
      ],
      { cancelable: false }
    );
  }

  renderHeader() {
    console.log("inside renderHeader()");
    return (
      <View style={{ marginBottom: 30 }}>
        <Text />
      </View>
    );
  }

  renderSingleUser = (data, isRenderItemForAutoComplete = false) => {
    console.log("Inside renderSingleUser");
    console.log("RowData: ");
    console.log(data);
    console.log("this.state.dataSource: ");
    console.log(this.state.dataSource);
    return (
      <ListItem
        thumbnail
        style={{ borderBottomWidth: 1, borderBottomColor: "black" }}
      >
        <Body>
          <FastImage
            style={{
              width: 100,
              height: 100,
              marginTop: isRenderItemForAutoComplete ? 30 : 0
            }}
            source={{
              uri: data.image_url,
              priority: FastImage.priority.high
            }}
            resizeMode={FastImage.resizeMode.contain}
          />

          <Text>
            {data.first_name} {""} {data.last_name}
          </Text>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Icon
              active
              name="person"
              style={{ color: "black", paddingRight: 5, fontSize: 12 }}
            />
            <Text note style={{ fontSize: 12 }}>
              {data.member_type}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Icon
              active
              name="barcode"
              style={{ color: "black", paddingRight: 5, fontSize: 12 }}
            />
            <Text note style={{ fontSize: 12 }}>
              ID: {data.id_number}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Icon
              active
              name="mail"
              style={{ color: "black", paddingRight: 5, fontSize: 12 }}
            />
            <Text note style={{ fontSize: 12 }}>
              {data.email}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Icon
              active
              name="call"
              style={{ color: "black", paddingRight: 5, fontSize: 12 }}
            />
            <Text note style={{ fontSize: 12 }}>
              {data.phone}
            </Text>
          </View>
        </Body>
        <Right>
          <Button
            small
            dark
            block
            style={styles.mb}
            onPress={this.viewUserBooksActivity(data)}
          >
            <Text style={styles.text}>Books</Text>
          </Button>

          <Button
            small
            dark
            block
            style={styles.mb}
            onPress={this.viewUserProfileDetails(data)}
          >
            <Text style={styles.text}>Details</Text>
          </Button>
        </Right>
      </ListItem>
    );
  };

  render() {
    console.log("UsersList: " + this.props.all_user_profiles);

    const { query } = this.state;
    const matchedUsers = this.findUser(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    var isRenderItemForAutoComplete = true;

    return (
      <Container style={styles.container}>
        <Content keyboardShouldPersistTaps="always">
          <Button
            small
            dark
            block
            style={styles.mb}
            onPress={this.sendRemindersForBooksDueInAWeek}
          >
            <Icon name="ios-notifications" />
            <Text style={styles.text}>Send Reminders</Text>
          </Button>

          <View style={styles.searchContainer}>
            <Autocomplete
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.autocompleteContainer}
              data={
                matchedUsers.length === 1 &&
                comp(query, matchedUsers[0].last_name)
                  ? []
                  : matchedUsers
              }
              defaultValue={query}
              onChangeText={text => this.setState({ query: text })}
              placeholder="Enter the last name to search"
              renderItem={({ last_name }) => (
                <TouchableOpacity
                  onPress={() => this.setState({ query: last_name })}
                >
                  <Text style={styles.itemText}>{last_name}</Text>
                </TouchableOpacity>
              )}
            />

            {matchedUsers.length > 0 ? (
              this.renderSingleUser(
                matchedUsers[0],
                isRenderItemForAutoComplete
              )
            ) : (
              <ListView
                enableEmptySections
                keyboardShouldPersistTaps="always"
                dataSource={this.state.dataSource}
                renderHeader={this.renderHeader}
                renderRow={data => this.renderSingleUser(data)}
              />
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  console.log("mapStateToProps AdminListUsers");
  console.log(state);
  const all_user_profiles = _.map(state.all_user_profiles, (val, uid) => {
    return { ...val, uid };
  });

  return {
    all_user_profiles: all_user_profiles,
    books_due_for_reminder: state.books_due_for_reminder
  };
};

export default connect(mapStateToProps, {
  fetchAllUsers,
  fetchBooksToSendReminders
})(AdminUsersList);
