import React, { Component, TouchableHighlight } from "react";
import { Alert, View, ScrollView, StyleSheet } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Label,
  Item,
  Left,
  Right,
  ListItem,
  Button,
  Body
} from "native-base";
import moment from "moment";
import { getDatabase, getAuth } from "../../../firebase";

import t from "tcomb-form-native"; // 0.6.9
import styles from "./styles";
import {
  GradeLevelEnum,
  GenderEnum,
  MemberTypeEnum,
  SchoolEnum,
  UserProfileSchema,
  TcombOptions
} from "./AddUserFormData";

const Form = t.form.Form;

const currentDate = new Date();
const formattedCurrDate = moment(currentDate).format("MM/DD/YYYY");

var defValues = {};

class AddUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: defValues,
      options: TcombOptions
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const value = this.refs.form.getValue(); // use that ref to get the form value

    if (value === null) {
      Alert.alert("Error", "Enter the required fields");
      this.setState({
        value: defValues,
        options: TcombOptions
      });

      console.log(this.state.options);
    }

    if (value) {
      console.log("value: ", value);
      const { currentUser } = getAuth();

      this.setState({ value: value });

      console.log("Inside handleSubmit (first_name): " + value.first_name);
      console.log("Inside handleSubmit (last_name): " + value.last_name);
      console.log("Inside handleSubmit (email): " + value.email);

      const displayName = value.first_name + " " + value.last_name;

      Alert.alert(
        "Confirm",
        "Do you wish to continue?",
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
              getAuth()
                .createUserWithEmailAndPassword(value.email, value.password)
                .then(user => {
                  this.createUserProfile(user.uid);
                })
                .catch(error => {
                  // Handle Errors here.
                  var errorMessage = error.code + " -- " + error.message;
                  console.log("Error: " + errorMessage);
                  Alert.alert("Error", error);
                });
            }
          }
        ],
        { cancelable: false }
      );
    }
  }

  createUserProfile(userid) {
    console.log("Inside createUserProfile (userid): " + userid);
    console.log(
      "Inside createUserProfile (this.state.value): " + this.state.value
    );

    const currentDate = new Date();
    const formattedCurrDate = moment(currentDate).format("MM/DD/YYYY");

    const {
      email,
      phone,
      id_number,
      first_name,
      last_name,
      school,
      gender,
      birth_date,
      member_type,
      grade_level,
      image_url,
      created,
      created_by,
      updated,
      updated_by
    } = this.state.value;

    getDatabase()
      .ref()
      .child("middletonhighschool")
      .child("users")
      .child(userid)
      .child("profile")
      .set(
        {
          user_id: userid,
          email: email,
          phone: phone,
          id_number: id_number,
          first_name: first_name,
          last_name: last_name,
          school: school,
          gender: gender,
          birth_date: moment(birth_date).format("MM/DD/YYYY"),
          member_type: member_type,
          grade_level: grade_level,
          image_url: image_url,
          created: formattedCurrDate,
          created_by: "ADMIN",
          updated: formattedCurrDate,
          updated_by: "ADMIN"
        },
        function(error) {
          if (error) {
            Alert.alert("Error", "Failed to create User Profile: " + error);
          } else {
            Alert.alert("Success", "User Profile created successfully !!!");
          }
        }
      )
      .then(user => {
        console.log("CREATE_USER_PROFILE successful");
        this.clearForm();
      })
      .catch(error => {
        // Handle Errors here.
        var errorMessage = error.code + " -- " + error.message;
        console.log("Error: " + errorMessage);
        Alert.alert("Error", errorMessage);
      });
  }

  clearForm() {
    this.setState({
      value: defValues,
      options: TcombOptions
    });
  }

  render() {
    return (
      <Container>
        <Content keyboardShouldPersistTaps="always">
          <View style={styles.container}>
            <ScrollView>
              <View style={styles.container}>
                <Form
                  ref="form"
                  type={UserProfileSchema}
                  options={this.state.options}
                  value={this.state.value}
                />
              </View>

              <View style={styles.buttons}>
                <Button
                  rounded
                  style={{ backgroundColor: "dodgerblue" }}
                  onPress={this.handleSubmit}
                >
                  <Text>Save</Text>
                </Button>

                <Button
                  rounded
                  style={{ backgroundColor: "dodgerblue" }}
                  onPress={this.clearForm.bind(this)}
                >
                  <Text>Clear</Text>
                </Button>
              </View>
            </ScrollView>
          </View>
        </Content>
      </Container>
    );
  }
}

export default AddUsers;
