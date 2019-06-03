import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { ListView, Image, View, Dimensions } from "react-native";
import { userProfileFetch } from "../../actions";
import styles from "./styles";

import {
  Container,
  Header,
  Title,
  Content,
  Button,
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
  List,
  Input,
  StyleProvider,
  getTheme
} from "native-base";

const deviceWidth = Dimensions.get("window").width;

class UserProfilePage extends Component {
  componentWillMount() {
    this.props.userProfileFetch();
  }

  render() {
    console.log("UserProfile: " + this.props.profile);

    var isStudent = this.props.profile.member_type === "STUDENT" ? true : false;

    return (
      <Container style={styles.container}>
        <Content padder>
          <Card>
            <CardItem>
              <Body>
                <Image
                  style={{
                    alignSelf: "center",
                    height: 300,
                    resizeMode: "contain",
                    width: deviceWidth / 1.18,
                    marginVertical: 5
                  }}
                  source={{ uri: this.props.profile.image_url }}
                />
              </Body>
            </CardItem>
          </Card>
          <List style={styles.listview}>
            <ListItem>
              <Text style={{ color: "white", fontWeight: "bold" }}>Name</Text>
              <Input style={{ color: "white", textAlign: "right" }}>
                {this.props.profile.first_name} {this.props.profile.last_name}
              </Input>
            </ListItem>

            <ListItem>
              <Text style={{ color: "white", fontWeight: "bold" }}>Phone</Text>
              <Input style={{ color: "white", textAlign: "right" }}>
                {this.props.profile.phone}
              </Input>
            </ListItem>

            <ListItem>
              <Text style={{ color: "white", fontWeight: "bold" }}>ID </Text>
              <Input style={{ color: "white", textAlign: "right" }}>
                {this.props.profile.id_number}
              </Input>
            </ListItem>

            <ListItem>
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Member Type
              </Text>
              <Input style={{ color: "white", textAlign: "right" }}>
                {this.props.profile.member_type}
              </Input>
            </ListItem>

            {isStudent && (
              <ListItem>
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Grade
                </Text>
                <Input style={{ color: "white", textAlign: "right" }}>
                  {this.props.profile.grade_level}
                </Input>
              </ListItem>
            )}

            <ListItem last>
              <Text style={{ color: "white", fontWeight: "bold" }}>Email</Text>
              <Input style={{ color: "white", textAlign: "right" }}>
                {this.props.profile.email}
              </Input>
            </ListItem>

            <ListItem />
          </List>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  console.log("dah state", state);
  return {
    profile: state.profile
  };
};

export default connect(mapStateToProps, { userProfileFetch })(UserProfilePage);
