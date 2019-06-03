import React, { Component, TouchableHighlight } from "react";
import { Alert, View, StyleSheet, ScrollView } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Icon,
  Card,
  CardItem,
  Text,
  Label,
  Item,
  Thumbnail,
  Left,
  Right,
  Body,
  Separator,
  ListItem,
  Button
} from "native-base";

import t from "tcomb-form-native"; // 0.6.9
import styles from "./styles";
import { getDatabase } from "../../../firebase";
import moment from "moment";

const Form = t.form.Form;

// clone the default stylesheet
const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

// overriding the text color
stylesheet.textbox.normal.height = 200;

// here we are: define your domain model
var ContactUsModel = t.struct({
  name: t.String, // a required string
  email: t.String, // a required number
  message: t.String // a String
});

var TcombOptions = {
  fields: {
    message: {
      placeholder: "Enter your message here....",
      multiline: true,
      numberOfLines: 5,
      stylesheet: stylesheet // overriding the style of the textbox
    }
  }
}; // optional rendering options (see documentation)

export default class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      options: TcombOptions
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.goToHomePage = this.goToHomePage.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  handleSubmit() {
    const value = this.refs.form.getValue(); // use that ref to get the form value
    console.log("value: ", value);

    const currentDate = new Date();
    const formattedCurrDate = moment(currentDate).format("MM/DD/YYYY");

    if (value === null) {
      Alert.alert("Info", "Please enter all information");
      this.clearForm();
      return;
    }

    if (value) {
      this.setState({ value: value });
      getDatabase()
        .ref(`/middletonhighschool/requests`)
        .push({
          name: value.name,
          email: value.email,
          message: value.message,
          status: "NEW",
          created: formattedCurrDate,
          updated: formattedCurrDate
        })
        .then(() => {
          Alert.alert(
            "Info",
            "Thank you contacting Tomely. Your request will be processed within the next 24 hours"
          );
        })
        .catch(error => {
          // Handle Errors here.
          var errorMessage = error.code + " -- " + error.message;
          console.log("Error: " + errorMessage);
          Alert.alert("Error", error);
        });
    }
  }

  goToHomePage() {
    this.props.navigation.navigate("Home");
  }

  clearForm() {
    this.setState({
      value: "",
      options: TcombOptions
    });
  }

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "dodgerblue" }}>
          <Left />
          <Body>
            <Title>Contact Us</Title>
          </Body>
          <Right>
            <Button iconRight transparent onPress={this.goToHomePage}>
              <Icon active name="home" />
            </Button>
          </Right>
        </Header>

        <Content keyboardShouldPersistTaps="always">
          <View style={styles.container}>
            <View>
              <Form ref="form" type={ContactUsModel} options={TcombOptions} />
            </View>

            <View style={styles.buttons}>
              <Button
                style={{ backgroundColor: "dodgerblue" }}
                rounded
                onPress={this.handleSubmit}
              >
                <Text style={{ color: "black" }}>Send</Text>
              </Button>

              <Button
                style={{ backgroundColor: "dodgerblue" }}
                rounded
                onPress={this.clearForm}
              >
                <Text style={{ color: "black" }}>Clear</Text>
              </Button>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}
