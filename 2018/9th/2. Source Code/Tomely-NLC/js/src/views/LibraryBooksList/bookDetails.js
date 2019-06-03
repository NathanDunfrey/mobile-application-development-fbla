import React, { Component } from "react";
import { ListView, View, Image, Dimensions } from "react-native";
import styles from "./styles";
import FastImage from "react-native-fast-image";

import {
  Container,
  Header,
  Title,
  Subtitle,
  Content,
  Button,
  Icon,
  Card,
  CardItem,
  Text,
  Label,
  Item,
  Left,
  Right,
  Body,
  Separator,
  ListItem
} from "native-base";

const deviceWidth = Dimensions.get("window").width;

class BookDetails extends Component {
  constructor(props) {
    super(props);
    console.log("Inside BookDetails ctor: ");
    console.log(this.props.navigation.state.params);
  }

  componentWillMount() {
    console.log("Inside BookDetails componentWillMount(): ");
    console.log(this.props.navigation.state.params);
  }

  goToHomePage() {
    this.props.navigation.navigate("Home");
  }

  render() {
    console.log("BookDetails: " + this.props.navigation.state.params.bookData);
    const {
      title,
      summary,
      image_url,
      author,
      isbn,
      genre,
      num_of_pages,
      age_range
    } = this.props.navigation.state.params.bookData;

    if (!title) {
      return <View />;
    } else {
      return (
        <Container style={styles.container}>
          <Header style={{ backgroundColor: "dodgerblue" }}>
            <Body
              style={{
                flex: 3
              }}
            >
              <Subtitle>{title}</Subtitle>
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
            <Card>
              <CardItem>
                <Body>
                  <FastImage
                    style={{
                      alignSelf: "center",
                      height: 200,
                      width: deviceWidth / 1.0,
                      marginVertical: 5,
                      marginBottom: 10
                    }}
                    source={{
                      uri: image_url,
                      priority: FastImage.priority.high
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Body>
                  <Text style={styles.label}>Book Synopsis</Text>
                  <Text style={{ fontSize: 12, fontStyle: "italic" }}>
                    {summary}
                  </Text>
                </Body>
              </CardItem>
            </Card>

            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>Title</Label>
                <Text style={{ fontSize: 14 }}>{title}</Text>
              </Item>
            </ListItem>
            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>Author</Label>
                <Text style={{ fontSize: 14 }}>{author}</Text>
              </Item>
            </ListItem>
            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>ISBN</Label>
                <Text style={{ fontSize: 14 }}>{isbn}</Text>
              </Item>
            </ListItem>
            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>Genre</Label>
                <Text style={{ fontSize: 14 }}>{genre}</Text>
              </Item>
            </ListItem>
            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>Number of Pages</Label>
                <Text style={{ fontSize: 14 }}>{num_of_pages}</Text>
              </Item>
            </ListItem>
            <ListItem noBorder>
              <Item fixedLabel>
                <Label style={styles.label}>Age Range</Label>
                <Text style={{ fontSize: 14 }}>{age_range}</Text>
              </Item>
            </ListItem>
          </Content>
        </Container>
      );
    }
  }
}

export default BookDetails;
