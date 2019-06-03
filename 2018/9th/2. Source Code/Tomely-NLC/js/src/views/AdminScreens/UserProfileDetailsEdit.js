import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Alert,
  ListView,
  View,
  Image,
  Dimensions,
  Platform
} from "react-native";
import styles from "./styles";
import FastImage from "react-native-fast-image";
import { getDatabase } from "../../../firebase";

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
  Text
} from "native-base";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import { DatePickerDialog } from "react-native-datepicker-dialog";
import ValidationComponent from "react-native-form-validator";
import moment from "moment";

const deviceWidth = Dimensions.get("window").width;

const uploadProfileImage = (uri, mime = "application/octet-stream") => {
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

class UserProfileDetailsEdit extends ValidationComponent {
  constructor(props) {
    super(props);

    this.state = {
      email: this.props.userProfile.email,
      first_name: this.props.userProfile.first_name,
      last_name: this.props.userProfile.last_name,
      gender: this.props.userProfile.gender,
      school: this.props.userProfile.school,
      grade_level: this.props.userProfile.grade_level,
      member_type: this.props.userProfile.member_type,
      phone: this.props.userProfile.phone,
      id_number: this.props.userProfile.id_number,
      image_url: this.props.userProfile.image_url,
      birth_date: this.props.userProfile.birth_date,
      DateHolder: null,
      isEditable: false
    };
  }

  componentDidMount() {
    console.log("Inside StudentLogin componentDidMount() ");
  }

  handleSubmit() {
    this.validate({
      first_name: { required: true },
      last_name: { required: true },
      email: { email: true },
      id_number: { numbers: true },
      birth_date: { date: "MM/DD/YYYY" }
    });

    if (!this.isFormValid()) {
      Alert.alert("Error", this.getErrorMessages());
      return;
    }

    console.log("Inside handleSubmit (first_name): " + this.state.first_name);
    console.log("Inside handleSubmit (last_name): " + this.state.last_name);
    console.log("Inside handleSubmit (email): " + this.state.email);

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
            const currentDate = new Date();
            const formattedCurrDate = moment(currentDate).format("MM/DD/YYYY");

            getDatabase()
              .ref()
              .child("users")
              .child(this.props.userProfile.user_id)
              .child("profile")
              .set(
                {
                  user_id: this.props.userProfile.user_id,
                  email: this.state.email,
                  phone: this.state.phone,
                  id_number: this.state.id_number,
                  first_name: this.state.first_name,
                  last_name: this.state.last_name,
                  school: this.state.school,
                  gender: this.state.gender,
                  birth_date: moment(this.state.birth_date).format(
                    "MM/DD/YYYY"
                  ),
                  member_type: this.state.member_type,
                  grade_level: this.state.grade_level,
                  image_url: this.state.image_url,
                  created: formattedCurrDate,
                  created_by: "ADMIN",
                  updated: formattedCurrDate,
                  updated_by: "ADMIN"
                },
                function(error) {
                  if (error) {
                    Alert.alert(
                      "Error",
                      "Failed to update User Profile: " + error
                    );
                  } else {
                    Alert.alert(
                      "Success",
                      "User Profile updated successfully !!!"
                    );
                  }
                }
              )
              .then(user => {
                console.log("User profile updated successful");
                this.clearForm();
              })
              .catch(error => {
                // Handle Errors here.
                var errorMessage = error.code + " -- " + error.message;
                console.log("Error: " + errorMessage);
                Alert.alert("Error", errorMessage);
              });
          }
        }
      ],
      { cancelable: false }
    );
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
      birth_date: moment(date).format("MM/DD/YYYY")
    });
  };

  onGenderValueChange(value: string) {
    this.setState({
      gender: value
    });
  }

  onSchoolValueChanged(value: string) {
    this.setState({
      school: value
    });
  }

  editProfileClicked() {
    this.setState({
      isEditable: true
    });
  }

  onGradeLevelChanged(value: string) {
    this.setState({
      grade_level: value
    });
  }

  _pickImage() {
    this.setState({ image_url: "" });
    console.log("Inside _pickImage");
    ImagePicker.launchImageLibrary({}, response => {
      uploadProfileImage(response.uri)
        .then(url => this.setState({ image_url: url }))
        .catch(error => console.log(error));
    });

    console.log("Inside _pickImage: " + this.state.image_url);
  }

  onMemberTypeChanged(value: string) {
    this.setState({
      member_type: value
    });
  }

  render() {
    console.log("UserProfileDetails render(): ");

    console.log("User Profile Data");
    console.log(this.props.userProfile);

    if (!this.props.userProfile) {
      return (
        <Container>
          <Header style={{ backgroundColor: "dodgerblue" }}>
            <Left />
            <Body>
              <Title style={{ justifyContent: "center", alignSelf: "center" }}>
                User Profile Not Found
              </Title>
            </Body>
          </Header>

          <Content padder>
            <H3 style={styles.mb10}>User Profile Not Found !!!</H3>
          </Content>
        </Container>
      );
    } else {
      var isStudent =
        this.props.userProfile.member_type === "STUDENT" ? true : false;

      return (
        <Container style={{ backgroundColor: "white" }}>
          <Header
            style={{
              backgroundColor: "dodgerblue",
              marginTop: 20
            }}
            hasTabs="hasTabs"
          >
            <Body
              style={{
                flex: 3
              }}
            >
              <Title>Welcome</Title>
              <Subtitle>
                {this.props.userProfile.first_name}{" "}
                {this.props.userProfile.last_name}
              </Subtitle>
            </Body>

            <Right>
              <Button block dark onPress={this.logout.bind(this)}>
                <Icon name="log-out" />
                <Text>Log Out</Text>
              </Button>
            </Right>
          </Header>

          <Content padder keyboardShouldPersistTaps="always">
            <Card>
              <CardItem style={{ listBorderColor: "black" }}>
                <Body style={{ borderBottomWidth: 0 }}>
                  <FastImage
                    style={{
                      alignSelf: "center",
                      height: 200,
                      width: deviceWidth / 1.18,
                      marginVertical: 5
                    }}
                    source={{
                      uri: this.state.image_url,
                      priority: FastImage.priority.high
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />

                  {/*
                  <Item style={{ marginTop: 20, borderBottomWidth: 0 }}>
                    <Icon
                      active
                      name="create"
                      style={{ color: "black", paddingLeft: 10, fontSize: 12 }}
                    />
                    <Button
                      dark
                      small
                      onPress={this.editProfileClicked.bind(this)}
                    >
                      <Text style={{ color: "white", fontSize: 12 }}>
                        Edit Profile
                      </Text>
                    </Button>
                  </Item>
                  */}
                </Body>
              </CardItem>
            </Card>

            <Form style={{ marginBottom: 20, paddingRight: 20 }}>
              <Item>
                <Icon
                  active
                  name="mail"
                  style={{ color: "black", paddingLeft: 10, fontSize: 11 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "bold"
                  }}
                >
                  {" "}
                  Email{" "}
                </Label>
                <Input
                  style={{ color: "black", fontSize: 11 }}
                  placeholderTextColor="black"
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
                  editable={this.state.isEditable}
                />
              </Item>
              <Item>
                <Icon
                  active
                  name="md-person"
                  style={{ color: "black", paddingLeft: 10, fontSize: 11 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "bold"
                  }}
                >
                  {" "}
                  First Name{" "}
                </Label>
                <Input
                  style={{ color: "black", fontSize: 11 }}
                  placeholderTextColor="black"
                  value={this.state.first_name}
                  onChangeText={first_name => this.setState({ first_name })}
                  editable={this.state.isEditable}
                />
              </Item>

              <Item>
                <Icon
                  active
                  name="md-person"
                  style={{ color: "black", paddingLeft: 10, fontSize: 11 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "bold"
                  }}
                >
                  Last Name
                </Label>
                <Input
                  style={{ color: "black", fontSize: 11 }}
                  placeholderTextColor="black"
                  value={this.state.last_name}
                  onChangeText={last_name => this.setState({ last_name })}
                  editable={this.state.isEditable}
                />
              </Item>

              <Item>
                <Icon
                  active
                  name="calendar"
                  style={{ color: "black", paddingLeft: 10, fontSize: 11 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "bold"
                  }}
                >
                  Date of Birth
                </Label>
                <View style={styles.datePickerBox}>
                  <Button
                    block
                    info
                    rounded
                    style={{
                      width: 160,
                      backgroundColor: "dodgerblue"
                    }}
                    onPress={this.DatePickerMainFunctionCall.bind(this)}
                  >
                    <Text style={styles.datePickerText}>
                      {moment(this.state.birth_date).format("MM/DD/YYYY")}
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
                  style={{ color: "black", paddingLeft: 10, fontSize: 11 }}
                />
                <Icon
                  active
                  name="female"
                  style={{ color: "black", fontSize: 11 }}
                />
                <Label
                  style={{
                    width: 90,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "bold"
                  }}
                >
                  Gender
                </Label>
                <Picker
                  mode="dropdown"
                  enabled={this.state.isEditable}
                  style={{
                    width: Platform.OS === "ios" ? undefined : 180,
                    backgroundColor: "dodgerblue",
                    borderColor: "red"
                  }}
                  note={false}
                  selectedValue={this.state.gender}
                  onValueChange={this.onGenderValueChange.bind(this)}
                  itemStyle={{
                    backgroundColor: "black",
                    marginLeft: 30,
                    borderColor: "red",
                    paddingLeft: 15,
                    fontSize: 11
                  }}
                  itemTextStyle={{ fontSize: 12, color: "black" }}
                >
                  <Picker.Item
                    label="Select one..."
                    color="black"
                    value="NONE"
                  />
                  <Picker.Item label="MALE" color="black" value="MALE" />
                  <Picker.Item label="FEMALE" color="black" value="FEMALE" />
                </Picker>
              </Item>

              <Item style={{ marginTop: 10 }}>
                <Icon
                  active
                  name="school"
                  style={{ color: "black", paddingLeft: 10, fontSize: 11 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "bold"
                  }}
                >
                  School
                </Label>
                <Picker
                  mode="dropdown"
                  enabled={this.state.isEditable}
                  style={{
                    width: Platform.OS === "ios" ? undefined : 180,
                    backgroundColor: "dodgerblue",
                    borderColor: "red"
                  }}
                  note={false}
                  selectedValue={this.state.school}
                  onValueChange={this.onSchoolValueChanged.bind(this)}
                  itemStyle={{
                    backgroundColor: "black",
                    marginLeft: 30,
                    borderColor: "red",
                    paddingLeft: 15,
                    fontSize: 11
                  }}
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
                  style={{ color: "black", paddingLeft: 10, fontSize: 11 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "bold"
                  }}
                >
                  Account Type
                </Label>
                <Picker
                  mode="dropdown"
                  enabled={this.state.isEditable}
                  style={{
                    width: Platform.OS === "ios" ? undefined : 180,
                    backgroundColor: "dodgerblue",
                    borderColor: "red"
                  }}
                  note={false}
                  selectedValue={this.state.member_type}
                  onValueChange={this.onMemberTypeChanged.bind(this)}
                  itemStyle={{
                    backgroundColor: "black",
                    marginLeft: 30,
                    borderColor: "red",
                    paddingLeft: 15,
                    fontSize: 11
                  }}
                >
                  <Picker.Item
                    label="Select one..."
                    color="black"
                    value="NONE"
                  />
                  <Picker.Item label="Admin" color="black" value="ADMIN" />
                  <Picker.Item label="Student" color="black" value="STUDENT" />
                  <Picker.Item label="Teacher" color="black" value="TEACHER" />
                </Picker>
              </Item>

              {this.state.member_type === "STUDENT" && (
                <Item style={{ marginTop: 10 }}>
                  <Icon
                    active
                    name="create"
                    style={{ color: "black", paddingLeft: 10, fontSize: 11 }}
                  />
                  <Label
                    style={{
                      width: 100,
                      color: "black",
                      fontSize: 11,
                      fontWeight: "bold"
                    }}
                  >
                    Grade Level
                  </Label>
                  <Picker
                    mode="dropdown"
                    enabled={this.state.isEditable}
                    style={{
                      width: Platform.OS === "ios" ? undefined : 200,
                      backgroundColor: "dodgerblue",
                      borderColor: "red"
                    }}
                    itemStyle={{
                      backgroundColor: "black",
                      marginLeft: 30,
                      borderColor: "red",
                      paddingLeft: 15,
                      fontSize: 11
                    }}
                    note={false}
                    selectedValue={this.state.grade_level}
                    onValueChange={this.onGradeLevelChanged.bind(this)}
                  >
                    <Picker.Item
                      label="Select one..."
                      color="black"
                      value="NONE"
                    />
                    <Picker.Item label="9th Grade" color="black" value="9" />
                    <Picker.Item label="10th Grade" color="black" value="10" />
                    <Picker.Item label="11th Grade" color="black" value="11" />
                    <Picker.Item label="12th Grade" color="black" value="12" />
                  </Picker>
                </Item>
              )}

              <Item>
                <Icon
                  active
                  name="call"
                  style={{ color: "black", paddingLeft: 10, fontSize: 11 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "bold"
                  }}
                >
                  Phone
                </Label>
                <Input
                  style={{ color: "black", fontSize: 11 }}
                  placeholderTextColor="black"
                  keyboardType={"phone-pad"}
                  value={this.state.phone}
                  onChangeText={phone => this.setState({ phone })}
                  editable={this.state.isEditable}
                />
              </Item>

              <Item>
                <Icon
                  active
                  name="barcode"
                  style={{ color: "black", paddingLeft: 10, fontSize: 11 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "bold"
                  }}
                >
                  ID Number
                </Label>
                <Input
                  style={{ color: "black", fontSize: 11 }}
                  placeholderTextColor="black"
                  keyboardType={"phone-pad"}
                  value={this.state.id_number}
                  onChangeText={id_number => this.setState({ id_number })}
                  editable={this.state.isEditable}
                />
              </Item>

              <Item style={{ marginTop: 20 }}>
                <Icon
                  active
                  name="image"
                  style={{ color: "black", paddingLeft: 10, fontSize: 11 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "bold"
                  }}
                >
                  Profile Picture
                </Label>
                <Button
                  block
                  info
                  rounded
                  style={{
                    width: 160,
                    backgroundColor: "dodgerblue"
                  }}
                  onPress={this._pickImage.bind(this)}
                >
                  <Text style={{ color: "black", fontSize: 12 }}>Upload</Text>
                </Button>
              </Item>
            </Form>

            {/*
            <Button
              block
              small
              dark
              style={{
                margin: 15
              }}
              onPress={this.handleSubmit.bind(this)}
            >
              <Text
                style={{ fontSize: 14, alignSelf: "center", color: "white" }}
              >
                Submit
              </Text>
            </Button>
            */}
          </Content>
        </Container>
      );
    }
  }
}

export default UserProfileDetailsEdit;
