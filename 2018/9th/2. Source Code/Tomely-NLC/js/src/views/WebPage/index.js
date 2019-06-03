import React, { Component } from "react";
import { WebView, View, ScrollView } from "react-native";

import {
  Container,
  Header,
  Title,
  Subtitle,
  Content,
  Button,
  Item,
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
import styles from "./styles";

class WebPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: this.props.navigation.state.params.url,
      title: "Connect with us"
    };
  }

  componentDidMount() {
    console.log("Inside WebPage componentDidMount() ");
    console.log(this.props.navigation.state.params);
    this.setState({
      url: this.props.navigation.state.params.url,
      title: this.props.navigation.state.params.title
    });
  }

  render() {
    console.log("Inside render of WebPage-index.js");
    var isInputUrlEmpty = true;
    var inputUrl = this.props.navigation.state.params.url;

    console.log(inputUrl);
    if (typeof inputUrl !== "undefined" || inputUrl != null) {
      isInputUrlEmpty = false;
    }

    console.log("Is Input Url Empty: ", isInputUrlEmpty);

    return (
      <Container style={{ backgroundColor: "#FFF" }}>
        <Header
          style={{
            backgroundColor: "dodgerblue"
          }}
        >
          <Body>
            <Subtitle>{this.state.title}</Subtitle>
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

        <Content padder>
          {!isInputUrlEmpty ? (
            <View style={{ flex: 1 }}>
              <ScrollView keyboardShouldPersistTaps="always">
                <WebView
                  style={styles.webview}
                  source={{ uri: this.props.navigation.state.params.url }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={true}
                  scalesPageToFit={true}
                />
              </ScrollView>
            </View>
          ) : (
            <View
              style={{
                marginTop: 50,
                marginBottom: 50,
                paddingLeft: 10
              }}
            >
              <Text>
                The book has no preview yet. Please check back later...
              </Text>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

export default WebPage;
