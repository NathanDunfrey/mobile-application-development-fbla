import React, { Component } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import FastImage from "react-native-fast-image";

const facebookLogo = require("../../../../img/facebook.png");
const instagramLogo = require("../../../../img/instagram.png");
const youtubeLogo = require("../../../../img/youtube.png");
const twitterLogo = require("../../../../img/twitter.png");

class AddSocialIcons extends Component {

constructor(props) {
    super(props);
    this.connectWithYoutube = this.connectWithYoutube.bind(this);
    this.connectWithTwitter = this.connectWithTwitter.bind(this);
    this.connectWithInstagram = this.connectWithInstagram.bind(this);
    this.connectWithFaceBook = this.connectWithFaceBook.bind(this);
  }


  connectWithFaceBook() {
    console.log("Inside connectWithFaceBook");
    console.log(this.props.navigation);
    this.props.navigation.navigate("WebPage", {
      url: "https://www.facebook.com/Tomely-1536793186375640/",
      title: "Connect with Tomely"
    });
  }

  connectWithTwitter() {
    this.props.navigation.navigate("WebPage", {
      url: "https://twitter.com/tomelyfbla?lang=en",
      title: "Connect with Tomely"
    });
  }

  connectWithYoutube() {
    this.props.navigation.navigate("WebPage", {
      url: "https://www.youtube.com/channel/UC2lpd4H_5YFhoRNdzCfodTA",
      title: "Connect with Tomely"
    });
  }

  connectWithInstagram() {
    this.props.navigation.navigate("WebPage", {
      url: "https://www.instagram.com/tomelyfbla/",
      title: "Connect with Tomely"
    });
  }

  render() {
    // console.log("Inside AddSocialIcons render()");
    // console.log(this.props.navigation);

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 10,
          marginBottom: 10
        }}
      >
        <TouchableOpacity onPress={this.connectWithFaceBook}>
          <FastImage source={facebookLogo} style={{ width: 35, height: 35 }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.connectWithTwitter}>
          <FastImage source={twitterLogo} style={{ width: 35, height: 35 }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.connectWithInstagram}>
          <FastImage source={instagramLogo} style={{ width: 35, height: 35 }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.connectWithYoutube}>
          <FastImage source={youtubeLogo} style={{ width: 35, height: 35 }} />
        </TouchableOpacity>
      </View>
    );
  }
}

export default AddSocialIcons;
