import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  ListView,
  View,
  Alert,
  TextInput,
  Modal,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator
} from "react-native";
import moment from "moment";

import styles from "./styles";

import {
  Container,
  Header,
  Title,
  Subtitle,
  Content,
  Button,
  Icon,
  List,
  Text,
  Item,
  Picker,
  Left,
  Label,
  Body,
  Right
} from "native-base";

const deviceWidth = Dimensions.get("window").width;

class SchoolSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedHighSchool: "NONE"
    };

    this.goToHomePage = this.goToHomePage.bind(this);
    this.displayBooksToGuest = this.displayBooksToGuest.bind(this);
  }

  onSchoolValueChanged(value: string) {
    this.setState({
      selectedHighSchool: value
    });
  }

  displayBooksToGuest() {
    console.log("Inside displayBooksToGuest()");
    if (this.state.selectedHighSchool === "NONE") {
      Alert.alert("Info", "Please select a High School !!!");
      return;
    } else {
      console.log("Navigation to GuestBooksLongList");

      this.props.navigation.navigate("GuestBooksCarousel", {
        highSchool: this.state.selectedHighSchool
      });
    }
  }

  componentWillMount() {
    this.setState({
      selectedHighSchool: "NONE"
    });
  }

  goToHomePage() {
    this.props.navigation.navigate("Home");
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: "dodgerblue" }}>
          <Left />
          <Body
            style={{
              flex: 3
            }}
          >
            <Subtitle>Welcome Guest</Subtitle>
          </Body>

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

        <Content keyboardShouldPersistTaps="always">
          <View style={{ marginTop: 20 }}>
            <Item>
              <Icon
                active
                name="school"
                style={{ color: "dodgerblue", paddingLeft: 10 }}
              />
              <Label style={{ color: "black", width: 140 }}> High School</Label>
              <Picker
                mode="dropdown"
                style={{
                  width: Platform.OS === "ios" ? undefined : 160,
                  backgroundColor: "dodgerblue",
                  borderColor: "red"
                }}
                note={false}
                selectedValue={this.state.selectedHighSchool}
                onValueChange={this.onSchoolValueChanged.bind(this)}
              >
                <Picker.Item label="Select one..." color="black" value="NONE" />
                <Picker.Item
                  label="Middleton"
                  color="black"
                  value="Middleton"
                />
                <Picker.Item label="George" color="black" value="George" />
              </Picker>
            </Item>

            <Button
              block
              small
              bordered
              style={{
                margin: 15,
                marginBottom: 40,
                marginTop: 40,
                width: 220,
                marginLeft: 70,
                height: 40,
                backgroundColor: "dodgerblue"
              }}
              onPress={this.displayBooksToGuest}
            >
              <Text
                style={{ fontSize: 16, color: "black", alignSelf: "center" }}
              >
                Continue
              </Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

export default SchoolSelector;
