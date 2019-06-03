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

class UserProfileDetails extends ValidationComponent {
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

  onGradeLevelChanged(value: string) {
    this.setState({
      grade_level: value
    });
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
                      uri: this.state.image_url,
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
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
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
                  value={this.state.first_name}
                  onChangeText={first_name => this.setState({ first_name })}
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
                  value={this.state.last_name}
                  onChangeText={last_name => this.setState({ last_name })}
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
                  value={this.state.birth_date}
                  onChangeText={birth_date => this.setState({ birth_date })}
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
                  value={this.state.gender}
                  onChangeText={gender => this.setState({ gender })}
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
                  value={this.state.school}
                  onChangeText={school => this.setState({ school })}
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
                  value={this.state.member_type}
                  onChangeText={member_type => this.setState({ member_type })}
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
                    value={this.state.grade_level}
                    onChangeText={grade_level => this.setState({ grade_level })}
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
                  value={this.state.phone}
                  onChangeText={phone => this.setState({ phone })}
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
                  value={this.state.id_number}
                  onChangeText={id_number => this.setState({ id_number })}
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

export default UserProfileDetails;
