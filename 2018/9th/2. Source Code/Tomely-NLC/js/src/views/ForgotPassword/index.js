import React, { Component, TouchableHighlight } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
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
  Icon,
  Form,
  Input,
  ListItem,
  Button,
  Body
} from "native-base";
import moment from "moment";

import styles from "./styles";

export default class ForgotPassword extends Component {
  sendEmail() {

  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: "dodgerblue" }}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Forgot Password</Title>
          </Body>
        </Header>

        <Content>
          <Form>
            <Item>
              <Text style={styles.text}>
                Please enter your email address. Your password will be emailed to you.
              </Text>
            </Item>

            <Item>
              <Icon active name="mail" />
              <Input
                placeholder="Email"
                onChangeText={email => this.setState({ email })}
              />
            </Item>
          </Form>

          <Button
            block
            style={{
              margin: 15,
              marginTop: 50
            }}
            onPress={this.sendEmail.bind(this)}
          >
            <Text>Send</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
