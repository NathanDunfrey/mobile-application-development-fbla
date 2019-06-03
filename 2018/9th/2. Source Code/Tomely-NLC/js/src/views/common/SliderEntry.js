import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { ParallaxImage } from "react-native-snap-carousel";
import styles from "./SliderEntry.style";

import { ListItem, Body, Right } from "native-base";
import FastImage from "react-native-fast-image";

export default class SliderEntry extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    even: PropTypes.bool,
    parallax: PropTypes.bool,
    parallaxProps: PropTypes.object,
    navigation: PropTypes.object,
    accountType: PropTypes.string
  };

  get image() {
    const { parallax, parallaxProps, even } = this.props;
    const { data } = this.props.data;

    return parallax ? (
      <ParallaxImage
        source={{ uri: data.image_url }}
        containerStyle={[
          styles.imageContainer,
          even ? styles.imageContainerEven : {}
        ]}
        style={styles.parallaxImage}
        parallaxFactor={0.35}
        showSpinner={true}
        spinnerColor={even ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.25)"}
        {...parallaxProps}
      />
    ) : (
      <FastImage
        source={{
          uri: data.image_url,
          priority: FastImage.priority.high
        }}
        style={styles.image}
        resizeMode={FastImage.resizeMode.contain}
      />
    );
  }

  navigateToBookDetails = (navigate, accountType, data) => () => {
    if (accountType === "GUEST") {
      navigate("GuestBookDetails", {
        bookData: data
      });
    } else {
      navigate("UserBookDetails", {
        bookData: data
      });
    }
  };

  render() {
    const { even } = this.props;
    const { data } = this.props.data;
    const { navigate } = this.props.navigation;
    const { accountType } = this.props;
    // console.log("Inside SliderEntry render()");
    // console.log(this.props);
    // console.log(data.author + "--" + data.title + "--" + data.image_url);
    // console.log("navigate");
    // console.log(navigate);

    const uppercaseTitle = data.title ? (
      <Text
        style={[styles.title, even ? styles.titleEven : {}]}
        numberOfLines={2}
      >
        {data.title.toUpperCase()}
      </Text>
    ) : (
      false
    );

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.slideInnerContainer}
        onPress={this.navigateToBookDetails(navigate, accountType, data)}
      >
        <View style={styles.shadow} />
        <View
          style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
        >
          {this.image}
          <View
            style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]}
          />
        </View>
        <View
          style={[styles.textContainer, even ? styles.textContainerEven : {}]}
        >
          {uppercaseTitle}
          <Text
            style={[styles.subtitle, even ? styles.subtitleEven : {}]}
            numberOfLines={2}
          >
            {data.author}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
