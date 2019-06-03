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

import {
  Container,
  Header,
  Title,
  Subtitle,
  Content,
  Button,
  Card,
  CardItem,
  Item,
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
import ValidationComponent from "react-native-form-validator";
import moment from "moment";

const deviceWidth = Dimensions.get("window").width;

class UserProfileDetailsAdmin extends ValidationComponent {
  constructor(props) {
    super(props);

    this.state = {
      editable: false
    };
  }

  componentDidMount() {
    console.log("Inside StudentLogin componentDidMount() ");
  }

  render() {
    console.log("UserProfileDetails render(): ");

    console.log("User Profile Data");

    const { userProfile } = this.props.navigation.state.params;

    console.log(userProfile);

    if (!userProfile) {
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
      var isStudent = userProfile.member_type === "STUDENT" ? true : false;

      return (
        <Container style={{ backgroundColor: "white" }}>
          <Header
            style={{
              backgroundColor: "dodgerblue"
            }}
            hasTabs="hasTabs"
          >
            <Body
              style={{
                flex: 3
              }}
            >
              <Title>User Profile</Title>
              <Subtitle>
                {userProfile.first_name}{" "}
                {userProfile.last_name}
              </Subtitle>
            </Body>

            <Right>
              <Button block dark onPress={() => this.props.navigation.goBack()}>
                <Icon
                  name="md-close-circle"
                  style={{ color: "white", fontSize: 20 }}
                />
                <Text>Close</Text>
              </Button>
            </Right>
          </Header>

          <Content padder keyboardShouldPersistTaps="always">
            <Card>
              <CardItem>
                <Body style={{ borderBottomWidth: 0 }}>
                  <FastImage
                    style={{
                      alignSelf: "center",
                      height: 200,
                      width: deviceWidth / 1.18,
                      marginVertical: 5
                    }}
                    source={{
                      uri: userProfile.image_url,
                      priority: FastImage.priority.high
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </Body>
              </CardItem>
            </Card>

            <Form style={{ marginBottom: 20, paddingRight: 20 }}>
              <Item>
                <Icon
                  active
                  name="mail"
                  style={{ color: "black", paddingLeft: 10, fontSize: 14 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 14,
                    fontWeight: "bold"
                  }}
                >
                  Email
                </Label>
                <Input
                  style={{ color: "black", fontSize: 12 }}
                  placeholderTextColor="black"
                  value={userProfile.email}
                  editable={this.state.isEditable}
                />
              </Item>
              <Item>
                <Icon
                  active
                  name="md-person"
                  style={{ color: "black", paddingLeft: 10, fontSize: 14 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 14,
                    fontWeight: "bold"
                  }}
                >
                  First Name
                </Label>
                <Input
                  style={{ color: "black", fontSize: 14 }}
                  placeholderTextColor="black"
                  value={userProfile.first_name}
                  editable={this.state.isEditable}
                />
              </Item>
              <Item>
                <Icon
                  active
                  name="md-person"
                  style={{ color: "black", paddingLeft: 10, fontSize: 14 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 14,
                    fontWeight: "bold"
                  }}
                >
                  Last Name
                </Label>
                <Input
                  style={{ color: "black", fontSize: 14 }}
                  placeholderTextColor="black"
                  value={userProfile.last_name}
                  editable={this.state.isEditable}
                />
              </Item>
              <Item>
                <Icon
                  active
                  name="calendar"
                  style={{ color: "black", paddingLeft: 10, fontSize: 14 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 14,
                    fontWeight: "bold"
                  }}
                >
                  Date of Birth
                </Label>
                <Input
                  style={{ color: "black", fontSize: 14 }}
                  placeholderTextColor="black"
                  value={userProfile.birth_date}
                  editable={this.state.isEditable}
                />
              </Item>
              <Item style={{ marginTop: 10 }}>
                <Icon
                  active
                  name="male"
                  style={{ color: "black", paddingLeft: 10, fontSize: 14 }}
                />
                <Icon
                  active
                  name="female"
                  style={{ color: "black", fontSize: 14 }}
                />
                <Label
                  style={{
                    width: 90,
                    color: "black",
                    fontSize: 14,
                    fontWeight: "bold"
                  }}
                >
                  Gender
                </Label>
                <Input
                  style={{ color: "black", fontSize: 14 }}
                  placeholderTextColor="black"
                  value={userProfile.gender}
                  editable={this.state.isEditable}
                />
              </Item>
              <Item style={{ marginTop: 10 }}>
                <Icon
                  active
                  name="school"
                  style={{ color: "black", paddingLeft: 10, fontSize: 14 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 14,
                    fontWeight: "bold"
                  }}
                >
                  School
                </Label>
                <Input
                  style={{ color: "black", fontSize: 14 }}
                  placeholderTextColor="black"
                  value={userProfile.school}
                  editable={this.state.isEditable}
                />
              </Item>
              <Item style={{ marginTop: 10 }}>
                <Icon
                  active
                  name="person"
                  style={{ color: "black", paddingLeft: 10, fontSize: 14 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 14,
                    fontWeight: "bold"
                  }}
                >
                  Account Type
                </Label>
                <Input
                  style={{ color: "black", fontSize: 14 }}
                  placeholderTextColor="black"
                  value={userProfile.member_type}
                  editable={this.state.isEditable}
                />
              </Item>

              {isStudent && (
                <Item>
                  <Icon
                    active
                    name="md-person"
                    style={{ color: "black", paddingLeft: 10, fontSize: 14 }}
                  />
                  <Label
                    style={{
                      width: 100,
                      color: "black",
                      fontSize: 14,
                      fontWeight: "bold"
                    }}
                  >
                    Grade Level
                  </Label>
                  <Input
                    style={{ color: "black", fontSize: 14 }}
                    placeholderTextColor="black"
                    value={userProfile.grade_level}
                    editable={this.state.isEditable}
                  />
                </Item>
              )}

              <Item>
                <Icon
                  active
                  name="call"
                  style={{ color: "black", paddingLeft: 10, fontSize: 14 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 14,
                    fontWeight: "bold"
                  }}
                >
                  Phone
                </Label>
                <Input
                  style={{ color: "black", fontSize: 14 }}
                  placeholderTextColor="black"
                  keyboardType={"phone-pad"}
                  value={userProfile.phone}
                  editable={this.state.isEditable}
                />
              </Item>
              <Item>
                <Icon
                  active
                  name="barcode"
                  style={{ color: "black", paddingLeft: 10, fontSize: 14 }}
                />
                <Label
                  style={{
                    width: 100,
                    color: "black",
                    fontSize: 14,
                    fontWeight: "bold"
                  }}
                >
                  ID Number
                </Label>
                <Input
                  style={{ color: "black", fontSize: 14 }}
                  placeholderTextColor="black"
                  keyboardType={"phone-pad"}
                  value={userProfile.id_number}
                  editable={this.state.isEditable}
                />
              </Item>
            </Form>
          </Content>
        </Container>
      );
    }
  }
}

export default UserProfileDetailsAdmin;
