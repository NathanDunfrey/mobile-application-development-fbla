import React, { Component } from "react";
import { Image, View, Dimensions, TouchableOpacity } from "react-native";

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
  H3,
  List,
  Separator,
  ListItem,
  IconNB
} from "native-base";

import styles from "./styles";
import AddSocialIcons from "../WebPage/AddSocialIcons";

const datas = [
  "Allow students and teachers to reserve books.",
  "Allow students and teachers to check out books.",
  "Remind students and teachers when books are overdue.",
  "Show a map of the school library.",
  "Allow students to add review comments and rating to a book they borrowed",
  "Allow students to read review comments and ratings given by other students/teachers"
];

export default class About extends Component {

 constructor(props) {
    super(props);
    this.goToHomePage = this.goToHomePage.bind(this);
  }

  goToHomePage() {
    this.props.navigation.navigate("Home");
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: "dodgerblue" }}>
          <Left />
          <Body>
            <Title>About</Title>
          </Body>
          <Right>
            <Button
              iconRight
              transparent
              style={styles.mb15}
              onPress={this.goToHomePage}
            >
              <Icon active name="home" />
            </Button>
          </Right>
        </Header>

        <Content padder>
          <Text style={{ fontWeight: "bold", fontSize: 20, paddingBottom: 10 }}>
            What is Tomely?
          </Text>
          <Text>
            Tomely is a mobile application to manage the issuance of books and
            to provide other information at a school library. Tomely has been
            designed to allow the students and teachers to Read, Engage and
            Connect. Tomely has been developed to support the Google’s Android
            platform. Some of the most important features of Tomely are as
            follows:
          </Text>
          <List
            dataArray={datas}
            renderRow={data => (
              <ListItem>
                <Text>{data}</Text>
              </ListItem>
            )}
          />
          <Text>
            Tomely can be deployed from a smartphone, tablet, or both.
            Currently, Tomely is supported on Android only.
          </Text>
          <Text />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              paddingTop: 20,
              paddingBottom: 10
            }}
          >
            Connect with us !!!
          </Text>
          <AddSocialIcons navigation={this.props.navigation} />
          <Text />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              paddingTop: 20,
              paddingBottom: 10
            }}
          >
            Citation and References
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            User Profile Images
          </Text>
          <Text>
            All the user profile image URL's were randomly picked from
            http://www.pexels.com
          </Text>
          <Text />

          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            Application Background
          </Text>
          <Text>
            https://i.pinimg.com/736x/57/99/62/57996201a591a86dc69ab9367d7a69f6--material-design-hd-wallpaper.jpg
          </Text>
          <Text />

          <Text />
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Book Summary</Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>The Giver </Text>
          <Text>
            https://www.amazon.com/gp/aw/d/B00KV1QTDK/ref=mp_s_a_1_1?ie=UTF8&qid=1515719353&sr=8-1&pi=AC_SX236_SY340_QL65&keywords=the+giver+book
          </Text>
          <Text style={{ fontWeight: "bold" }}>The Crucible </Text>
          <Text>
            https://www.amazon.com/gp/aw/d/0143129473/ref=mp_s_a_1_2?ie=UTF8&qid=1515719431&sr=8-2&pi=AC_SX236_SY340_QL65&keywords=the+crucible&dpPl=1&dpID=51aPBr4ivIL&ref=plSrch
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>The Odyssey </Text>
          <Text>
            https://www.amazon.com/gp/aw/d/0393089053/ref=mp_s_a_1_2?ie=UTF8&qid=1515719510&sr=8-2&pi=AC_SX236_SY340_QL65&keywords=the+oddessy&dpPl=1&dpID=511ztJeNubL&ref=plSrch
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>ACT </Text>
          <Text>
            https://www.amazon.com/gp/aw/d/1119386896/ref=mp_s_a_1_1?ie=UTF8&qid=1515719802&sr=8-1&pi=AC_SX236_SY340_QL65&keywords=act+book
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>SAT </Text>
          <Text>
            https://www.amazon.com/gp/aw/d/1457309289/ref=mp_s_a_1_3?ie=UTF8&qid=1515719635&sr=8-3&pi=AC_SX236_SY340_QL65&keywords=sat+book&dpPl=1&dpID=51QhKzMo79L&ref=plSrch
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>The Great Gatsby</Text>
          <Text>
            https://www.amazon.com/gp/aw/d/B010WF0PDY/ref=mp_s_a_1_9_a_it?ie=UTF8&qid=1515719880&sr=8-9&keywords=the+great+gatsby&dpPl=1&dpID=41F0H%2BdAPRL&ref=plSrch
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>Macbeth</Text>
          <Text>
            https://www.amazon.com/gp/aw/d/1411400372/ref=mp_s_a_1_4?ie=UTF8&qid=1515720045&sr=8-4&pi=AC_SX236_SY340_QL65&keywords=macbeth+shakespeare&dpPl=1&dpID=51fB%2BZ7NLhL&ref=plSrch
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>Romeo and Juliet</Text>
          <Text>
            https://www.amazon.com/gp/aw/d/B00IWTWCYS/ref=mp_s_a_1_2?ie=UTF8&qid=1515720133&sr=1-2&pi=AC_SX236_SY340_QL65&keywords=romeo+and+juliet&dpPl=1&dpID=51J%2BoLMB0qL&ref=plSrch
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>To Kill a Mockingbird</Text>
          <Text>
            https://www.amazon.com/gp/aw/d/B00K0OI42W/ref=mp_s_a_1_1?ie=UTF8&qid=1515720355&sr=8-1&pi=AC_SX236_SY340_QL65&keywords=to+kill+a+mockingbird+book
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>The Color Purple</Text>
          <Text>
            https://www.amazon.com/gp/aw/d/0156028352/ref=mp_s_a_1_1?ie=UTF8&qid=1515720467&sr=8-1&pi=AC_SX236_SY340_QL65&keywords=the+color+purple&dpPl=1&dpID=51d0meRFk8L&ref=plSrch
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>The Scarlet Letter</Text>
          <Text>https://www.amazon.com/gp/aw/d/1512090565?psc=1</Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>Of Mice and Men </Text>
          <Text>
            https://www.amazon.com/gp/aw/d/B001BC2ZS6/ref=mp_s_a_1_1?ie=UTF8&qid=1515720755&sr=8-1&pi=AC_SX236_SY340_QL65&keywords=of+mice+and+men+book+by+john+steinbeck
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>Fahrenheit 451</Text>
          <Text>
            https://www.amazon.com/gp/aw/d/B0064CPN7I/ref=mp_s_a_1_1?ie=UTF8&qid=1515721069&sr=8-1&pi=AC_SX236_SY340_QL65&keywords=farienhieht+451
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>A Separate Peace</Text>
          <Text>
            https://www.amazon.com/gp/aw/d/B00JN7BNR0/ref=mp_s_a_1_4?ie=UTF8&qid=1515721153&sr=8-4&pi=AC_SX236_SY340_QL65&keywords=a+seperate+peace
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>The Catcher in the Rye</Text>
          <Text>
            https://www.amazon.com/gp/aw/d/0316769487/ref=mp_s_a_1_1?ie=UTF8&qid=1515721205&sr=8-1&pi=AC_SX236_SY340_QL65&keywords=the+catcher+in+the+rye&dpPl=1&dpID=51ZxSRLRUpL&ref=plSrch
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>Animal Farm </Text>
          <Text>
            https://www.amazon.com/gp/aw/d/B003ZX868W/ref=mp_s_a_1_1?ie=UTF8&qid=1515721301&sr=8-1&pi=AC_SX236_SY340_QL65&keywords=animal+farm
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>A Midsummer NightsT Dream</Text>
          <Text>
            https://www.amazon.com/gp/aw/d/B01G7XFXBY/ref=mp_s_a_1_1?ie=UTF8&qid=1515721358&sr=8-1-spons&pi=AC_SX236_SY340_QL65&keywords=a+midsummer+night%27s+dream
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>The Outsiders </Text>
          <Text>
            https://www.amazon.com/gp/aw/d/B007ZUV4TO/ref=mp_s_a_1_1?ie=UTF8&qid=1515721403&sr=8-1&pi=AC_SX236_SY340_QL65&keywords=the+outsiders
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>Lord of the Flies </Text>
          <Text>
            https://www.amazon.com/gp/aw/d/B000OCXIRG/ref=mp_s_a_1_3?ie=UTF8&qid=1515721471&sr=8-3&pi=AC_SX236_SY340_QL65&keywords=lord+of+the+flies
          </Text>
          <Text />
          <Text style={{ fontWeight: "bold" }}>Moby Dick </Text>
          <Text>
            https://www.amazon.com/gp/aw/d/B01NBLGUY6/ref=mp_s_a_1_4?ie=UTF8&qid=1515721618&sr=8-4&pi=AC_SX236_SY340_QL65&keywords=moby+dick&dpPl=1&dpID=51UYGG4Y3RL&ref=plSrch
          </Text>
          <Text />
          <Text />
          <Text />
        </Content>
      </Container>
    );
  }
}
