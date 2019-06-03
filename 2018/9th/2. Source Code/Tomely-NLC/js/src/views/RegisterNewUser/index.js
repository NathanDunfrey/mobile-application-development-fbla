import React, { Component } from "react";
import { getDatabase, getAuth, getStorage } from "../../../firebase";
import {
  Image,
  ImageBackground,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  Alert
} from "react-native";

import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Card,
  CardItem,
  Item,
  Picker,
  IconNB,
  Label,
  Input,
  Body,
  Left,
  Right,
  Icon,
  Form,
  Text,
  Toast
} from "native-base";

import PropTypes from "react";
import styles from "./styles";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import { DatePickerDialog } from "react-native-datepicker-dialog";
import ValidationComponent from "react-native-form-validator";
import moment from "moment";

import AddSocialIcons from "../WebPage/AddSocialIcons";

const launchscreenLogo = require("../../../../img/tomely-home.png");
const launchscreenBg = require("../../../../img/tomely_black_background.png");

const deviceWidth = Dimensions.get("window").width;

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

// More info on all the options is below in the README...just some common use cases shown here
var options = {
  title: "Select Avatar",
  // customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};

const uploadImage = (uri, mime = "application/octet-stream") => {
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
    const sessionId = new Date().getTime();
    let uploadBlob = null;
    const imageRef = getStorage()
      .ref("images")
      .child(`${sessionId}`);

    fs
      .readFile(uploadUri, "base64")
      .then(data => {
        return Blob.build(data, { type: `${mime};BASE64` });
      })
      .then(blob => {
        uploadBlob = blob;
        return imageRef.put(blob, { contentType: mime });
      })
      .then(() => {
        uploadBlob.close();
        return imageRef.getDownloadURL();
      })
      .then(url => {
        resolve(url);
      })
      .catch(error => {
        reject(error);
      });
  });
};

class RegisterNewUser extends ValidationComponent {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      gender: "",
      highSchool: "",
      gradeLevel: "",
      memberType: "",
      phoneNum: "",
      idNumber: "",
      imageUrl: "",
      dateOfBirth: "Date",
      DateHolder: null
    };

    this.goToHomePage = this.goToHomePage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    console.log("Inside StudentLogin componentDidMount() ");
  }

  /**
   * Textbox click listener
   */
  DatePickerMainFunctionCall = () => {
    let DateHolder = this.state.DateHolder;

    if (!DateHolder || DateHolder == null) {
      DateHolder = new Date();
      this.setState({
        DateHolder: DateHolder
      });
    }

    //To open the dialog
    this.refs.DatePickerDialog.open({
      date: DateHolder
    });
  };

  /**
   * Call back for dob date picked event
   *
   */
  onDatePickedFunction = date => {
    this.setState({
      dateOfBirth: moment(date).format("MM/DD/YYYY")
    });
  };

  onGenderValueChange(value: string) {
    this.setState({
      gender: value
    });
  }

  onSchoolValueChanged(value: string) {
    this.setState({
      highSchool: value
    });
  }

  onGradeLevelChanged(value: string) {
    this.setState({
      gradeLevel: value
    });
  }

  _pickImage() {
    this.setState({ imageUrl: "" });
    console.log("Inside _pickImage");
    ImagePicker.launchImageLibrary({}, response => {
      uploadImage(response.uri)
        .then(url => this.setState({ imageUrl: url }))
        .catch(error => console.log(error));
    });

    console.log("Inside _pickImage: " + this.state.imageUrl);
  }

  getImage() {
    this.setState({ imageUrl: "" });
    console.log("Inside getImage");
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        // let source = { uri: response.uri };
        // this.setState({image_uri: response.uri})

        // You can also display the image using data:
        // let image_uri = { uri: 'data:image/jpeg;base64,' + response.data };

        this.uploadImage(response.uri)
          .then(url => {
            alert("uploaded");
            this.setState({ image_uri: url });
          })
          .catch(error => console.log(error));
      }
    });
  }

  onMemberTypeChanged(value: string) {
    this.setState({
      memberType: value
    });
  }

  goToHomePage() {
    this.props.navigation.navigate("Home");
  }

  handleSubmit() {
    this.validate({
      firstName: { required: true },
      lastName: { required: true },
      email: { email: true },
      idNumber: { numbers: true },
      dateOfBirth: { date: "MM/DD/YYYY" }
    });

    if (!this.isFormValid()) {
      Alert.alert("Error", this.getErrorMessages());
      return;
    }

    console.log("Inside handleSubmit (first_name): " + this.state.firstName);
    console.log("Inside handleSubmit (last_name): " + this.state.lastName);
    console.log("Inside handleSubmit (email): " + this.state.email);

    getAuth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        this.createUserProfile(user.uid);
      })
      .catch(error => {
        // Handle Errors here.
        var errorMessage = error.code + " -- " + error.message;
        console.log("Error: " + errorMessage);
        Alert.alert("Error", errorMessage);
      });
  }

  createUserProfile(userid) {
    console.log("Inside createUserProfile (userid): " + userid);

    const currentDate = new Date();
    const formattedCurrDate = moment(currentDate).format("MM/DD/YYYY");

    getDatabase()
      .ref()
      .child("middletonhighschool")
      .child("users")
      .child(userid)
      .child("profile")
      .set(
        {
          user_id: userid,
          email: this.state.email,
          phone: this.state.phoneNum,
          id_number: this.state.idNumber,
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          school: this.state.highSchool,
          gender: this.state.gender,
          birth_date: moment(this.state.dateOfBirth).format("MM/DD/YYYY"),
          member_type: this.state.memberType,
          grade_level: this.state.gradeLevel,
          image_url: this.state.imageUrl,
          created: formattedCurrDate,
          created_by: "ADMIN",
          updated: formattedCurrDate,
          updated_by: "ADMIN"
        },
        function(error) {
          if (error) {
            Alert.alert("Error", "Failed to create User Profile: " + error);
          } else {
            Alert.alert(
              "Success",
              "User Registered successfully. You can now login with your email/password!!!"
            );
          }
        }
      )
      .then(user => {
        console.log(
          "User Registered successfully. You can now login with your email/password!!!"
        );
      })
      .catch(error => {
        // Handle Errors here.
        var errorMessage = error.code + " -- " + error.message;
        console.log("Error: " + errorMessage);
        Alert.alert("Error", errorMessage);
      });
  }

  render() {
    console.log("Inside RegisterNewUser render() ");

    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: "dodgerblue" }}>
          <Left />
          <Body style={{ borderBottomWidth: 0 }}>
            <Title>Register User</Title>
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
          <ImageBackground
            source={launchscreenBg}
            style={styles.imageContainer}
          >
            <ScrollView>
              <Form style={{ marginBottom: 20, paddingRight: 20 }}>
                <Item>
                  <Icon
                    active
                    name="mail"
                    style={{ color: "white", paddingLeft: 10 }}
                  />
                  <Label style={{ color: "white" }}> Email </Label>
                  <Input
                    style={{ color: "white" }}
                    placeholderTextColor="white"
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                  />
                </Item>
                <Item>
                  <Icon
                    active
                    name="lock"
                    style={{ color: "white", paddingLeft: 10 }}
                  />
                  <Label style={{ color: "white" }}> Password </Label>
                  <Input
                    style={{ color: "white" }}
                    secureTextEntry
                    placeholderTextColor="white"
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })}
                  />
                </Item>
                <Item>
                  <Icon
                    active
                    name="md-person"
                    style={{ color: "white", paddingLeft: 10 }}
                  />
                  <Label style={{ color: "white" }}> First Name </Label>
                  <Input
                    style={{ color: "white" }}
                    placeholderTextColor="white"
                    value={this.state.firstName}
                    onChangeText={firstName => this.setState({ firstName })}
                  />
                </Item>

                <Item>
                  <Icon
                    active
                    name="md-person"
                    style={{ color: "white", paddingLeft: 10 }}
                  />
                  <Label style={{ color: "white" }}> Last Name </Label>
                  <Input
                    style={{ color: "white" }}
                    placeholderTextColor="white"
                    value={this.state.lastName}
                    onChangeText={lastName => this.setState({ lastName })}
                  />
                </Item>

                <Item>
                  <Icon
                    active
                    name="calendar"
                    style={{ color: "white", paddingLeft: 10 }}
                  />
                  <Label style={{ width: 140, color: "white" }}>
                    Date of Birth
                  </Label>
                  <View style={styles.datePickerBox}>
                    <Button
                      block
                      info
                      rounded
                      style={{
                        width: 120,
                        backgroundColor: "dodgerblue"
                      }}
                      onPress={this.DatePickerMainFunctionCall.bind(this)}
                    >
                      <Text style={styles.datePickerText}>
                        {this.state.dateOfBirth}
                      </Text>
                    </Button>
                  </View>
                </Item>

                <DatePickerDialog
                  ref="DatePickerDialog"
                  onDatePicked={this.onDatePickedFunction.bind(this)}
                />

                <Item style={{ marginTop: 10 }}>
                  <Icon
                    active
                    name="male"
                    style={{ color: "white", paddingLeft: 10 }}
                  />
                  <Icon active name="female" style={{ color: "white" }} />
                  <Label style={{ width: 120, color: "white" }}> Gender </Label>
                  <Picker
                    mode="dropdown"
                    style={{
                      width: Platform.OS === "ios" ? undefined : 120,
                      height: 40,
                      backgroundColor: "dodgerblue",
                      borderColor: "red"
                    }}
                    note={false}
                    selectedValue={this.state.gender}
                    onValueChange={this.onGenderValueChange.bind(this)}
                    itemStyle={{
                      backgroundColor: "white",
                      marginLeft: 30,
                      borderColor: "red",
                      paddingLeft: 15
                    }}
                    itemTextStyle={{ fontSize: 18, color: "white" }}
                  >
                    <Picker.Item
                      label="Select one..."
                      color="black"
                      value="NONE"
                    />
                    <Picker.Item label="Male" color="black" value="Male" />
                    <Picker.Item label="Female" color="black" value="Female" />
                  </Picker>
                </Item>

                <Item style={{ marginTop: 10 }}>
                  <Icon
                    active
                    name="school"
                    style={{ color: "white", paddingLeft: 10 }}
                  />
                  <Label style={{ width: 140, color: "white" }}>School</Label>
                  <Picker
                    mode="dropdown"
                    style={{
                      width: Platform.OS === "ios" ? undefined : 120,
                      height: 40,
                      backgroundColor: "dodgerblue",
                      borderColor: "red"
                    }}
                    note={false}
                    selectedValue={this.state.highSchool}
                    onValueChange={this.onSchoolValueChanged.bind(this)}
                  >
                    <Picker.Item
                      label="Select one..."
                      color="black"
                      value="NONE"
                    />
                    <Picker.Item
                      label="Middleton"
                      color="black"
                      value="Middleton"
                    />
                  </Picker>
                </Item>

                <Item style={{ marginTop: 10 }}>
                  <Icon
                    active
                    name="person"
                    style={{ color: "white", paddingLeft: 10 }}
                  />
                  <Label style={{ width: 142, color: "white" }}>
                    Account Type
                  </Label>
                  <Picker
                    mode="dropdown"
                    style={{
                      width: Platform.OS === "ios" ? undefined : 120,
                      height: 40,
                      backgroundColor: "dodgerblue",
                      borderColor: "red"
                    }}
                    note={false}
                    selectedValue={this.state.memberType}
                    onValueChange={this.onMemberTypeChanged.bind(this)}
                  >
                    <Picker.Item
                      label="Select one..."
                      color="black"
                      value="NONE"
                    />
                    <Picker.Item
                      label="Student"
                      color="black"
                      value="STUDENT"
                    />
                    <Picker.Item
                      label="Teacher"
                      color="black"
                      value="TEACHER"
                    />
                  </Picker>
                </Item>

                {this.state.memberType === "STUDENT" && (
                  <Item style={{ marginTop: 10 }}>
                    <Icon
                      active
                      name="create"
                      style={{ color: "white", paddingLeft: 10 }}
                    />
                    <Label style={{ width: 140, color: "white" }}>
                      Grade Level
                    </Label>
                    <Picker
                      mode="dropdown"
                      style={{
                        width: Platform.OS === "ios" ? undefined : 120,
                        height: 40,
                        backgroundColor: "dodgerblue",
                        borderColor: "red"
                      }}
                      note={false}
                      selectedValue={this.state.gradeLevel}
                      onValueChange={this.onGradeLevelChanged.bind(this)}
                    >
                      <Picker.Item
                        label="Select one..."
                        color="black"
                        value="NONE"
                      />
                      <Picker.Item label="9th Grade" color="black" value="9" />
                      <Picker.Item
                        label="10th Grade"
                        color="black"
                        value="10"
                      />
                      <Picker.Item
                        label="11th Grade"
                        color="black"
                        value="11"
                      />
                      <Picker.Item
                        label="12th Grade"
                        color="black"
                        value="12"
                      />
                    </Picker>
                  </Item>
                )}

                <Item>
                  <Icon
                    active
                    name="call"
                    style={{ color: "white", paddingLeft: 10 }}
                  />
                  <Label style={{ color: "white" }}> Phone </Label>
                  <Input
                    style={{ color: "white" }}
                    placeholderTextColor="white"
                    keyboardType={"phone-pad"}
                    value={this.state.phoneNum}
                    onChangeText={phoneNum => this.setState({ phoneNum })}
                  />
                </Item>

                <Item>
                  <Icon
                    active
                    name="barcode"
                    style={{ color: "white", paddingLeft: 10 }}
                  />
                  <Label style={{ color: "white" }}> ID Number </Label>
                  <Input
                    style={{ color: "white" }}
                    placeholderTextColor="white"
                    keyboardType={"phone-pad"}
                    value={this.state.idNumber}
                    onChangeText={idNumber => this.setState({ idNumber })}
                  />
                </Item>

                <Item style={{ marginTop: 30 }}>
                  <Icon
                    active
                    name="image"
                    style={{ color: "white", paddingLeft: 10 }}
                  />
                  <Label style={{ width: 140, color: "white" }}>
                    Profile Picture
                  </Label>
                  <Button
                    block
                    info
                    rounded
                    style={{
                      width: 120,
                      backgroundColor: "dodgerblue"
                    }}
                    onPress={this.getImage.bind(this)}
                  >
                    <Text style={{ color: "white", fontSize: 14 }}>Upload</Text>
                  </Button>
                </Item>
              </Form>

              <Button
                block
                style={{
                  margin: 15,
                  backgroundColor: "dodgerblue"
                }}
                onPress={this.handleSubmit}
              >
                <Text style={{ fontSize: 14, alignSelf: "center" }}>
                  Create Account
                </Text>
              </Button>

              <Button
                block
                transparent
                bordered
                style={{
                  margin: 15,
                  marginBottom: 10,
                  borderColor: "dodgerblue"
                }}
                onPress={() => this.props.navigation.goBack()}
              >
                <Text
                  style={{ fontSize: 14, color: "white", alignSelf: "center" }}
                >
                  Cancel
                </Text>
              </Button>

              <AddSocialIcons navigation={this.props.navigation} />
            </ScrollView>
          </ImageBackground>
        </Content>
      </Container>
    );
  }
}

export default RegisterNewUser;
