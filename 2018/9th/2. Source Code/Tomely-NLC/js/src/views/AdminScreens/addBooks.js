import React, { Component, TouchableHighlight } from "react";
import { View, Alert, ScrollView, StyleSheet } from "react-native";
import { createBook } from "../../actions";
import { connect } from "react-redux";
import moment from "moment";
import styles from "./styles";

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

import { BooksModelSchema, TcombOptions, Form } from "./AddBooksFormData";

const currentDate = new Date();
const formattedCurrDate = moment(currentDate).format("MM/DD/YYYY");

var defValues = {
  status: "AVAILABLE",
  created: formattedCurrDate,
  created_by: "ADMIN",
  updated: formattedCurrDate,
  updated_by: "ADMIN"
};

class AddBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: defValues,
      options: TcombOptions,
      book: {}
    };
  }

  handleSubmit() {
    const value = this.refs.form.getValue(); // use that ref to get the form value

    if (value === null) {
      Alert.alert("Error", "Enter the required fields");
      this.setState({
        value: defValues,
        options: TcombOptions
      });
    }

    if (value) {
      this.setState({ value: value });
      this.setState({ book: value });

      console.log("Inside handleSubmit() value: ", value);
      console.log("Inside handleSubmit() this.state.book: ", this.state.book);

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
              this.props.createBook({ value });
            }
          }
        ],
        { cancelable: false }
      );
    }
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
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.container}>
              <Form
                ref="form"
                type={BooksModelSchema}
                options={TcombOptions}
                value={defValues}
              />
            </View>

            <View style={styles.buttons}>
              <Button
                rounded
                style={{ backgroundColor: "dodgerblue" }}
                onPress={this.handleSubmit.bind(this)}
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
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const book = state.value;
  console.log("Inside mapStateToProps(state.book): " + state.value);
  console.log("Inside mapStateToProps: " + book);
  return { book };
};

export default connect(mapStateToProps, { createBook })(AddBooks);
