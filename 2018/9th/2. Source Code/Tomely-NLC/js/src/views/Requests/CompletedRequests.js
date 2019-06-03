import React, { Component } from "react";
import {
  ListView,
  View,
  TextInput,
  Alert,
  Modal,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions
} from "react-native";
import styles from "./styles";
import moment from "moment";
import firebase from "firebase";

import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  List,
  H3,
  ListItem,
  Text,
  Thumbnail,
  Left,
  Body,
  Right
} from "native-base";

const deviceWidth = Dimensions.get("window").width;

class CompletedRequests extends Component {
  render() {
    console.log("====Completed Requests: ====");
    console.log(this.props.requestData);
    if (!this.props.requestData) {
      return (
        <Container>
          <Content padder>
            <H3 style={styles.mb10}>There are no completed requests</H3>
          </Content>
        </Container>
      );
    } else {
      return (
        <Container>
          <Content keyboardShouldPersistTaps="always">
            <List
              dataArray={this.props.requestData}
              renderRow={data => (
                <ListItem thumbnail noBorder>
                  <Left />
                  <Body style={{ borderBottomWidth: 0 }}>
                    <Text>Date: {data.request_data.updated}</Text>
                    <Text>From: {data.request_data.name}</Text>
                    <Text note>Email: {data.request_data.email}</Text>
                    <Text note> {"------Request Message--------"}</Text>
                    <Text note numberOfLines={20}>
                      {" "}
                      {data.request_data.message}
                    </Text>
                    <Text note> {"------------------------------"}</Text>
                  </Body>
                </ListItem>
              )}
            />
          </Content>
        </Container>
      );
    }
  }
}

export default CompletedRequests;
