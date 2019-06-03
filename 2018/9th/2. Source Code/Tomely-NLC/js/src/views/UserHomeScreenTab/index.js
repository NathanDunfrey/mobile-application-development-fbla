import React, { Component } from "react";
import { connect } from "react-redux";

import {
  Container,
  Header,
  Title,
  Subtitle,
  Button,
  Footer,
  FooterTab,
  Icon,
  Tabs,
  Tab,
  Text,
  Right,
  Left,
  Body,
  TabHeading
} from "native-base";

import LibraryBooksList from "../LibraryBooksList";
import BooksHomePage from "../LibraryBooksList/BooksHomePage";
import UserProfilePage from "../UserProfilePage";
import UserProfileDetails from "./UserProfileDetails";
import { userProfileFetch } from "../../actions";
import ManageUserBooks from "./ManageUserBooks";

import { getDatabase, getAuth } from "../../../firebase";
import styles from "./styles";
import moment from "moment";

class UserHomeScreenTab extends Component {
  // eslint-disable-line

  constructor(props) {
    super(props);

    this.state = {
      selectedTab: "Home"
    };

    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.props.userProfileFetch();
    console.log("Inside componentDidMount of UserHomeScreenTab");
  }

  logout() {
    // logout, once that is complete, return the user to the login screen.
    console.log(
      "inside UserHomeScreenTab logout(): " + this.props.profile.member_type
    );

    var accountType = "STUDENT";
    if (this.props.profile.member_type !== "STUDENT") {
      accountType = "TEACHER";
    }

    getAuth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate("LoginScreen", {
          accountType: accountType
        });
      });
  }

  renderSelectedTab() {
    switch (this.state.selectedTab) {
      case "Home":
        return (
          <BooksHomePage
            userProfile={this.props.profile}
            navigation={this.props.navigation}
          />
        );
        break;
      case "Books":
        return <ManageUserBooks />;
        break;
      case "Profile":
        return <UserProfileDetails userProfile={this.props.profile} />;
        break;
      default:
        return (
          <BooksHomePage
            userProfile={this.props.profile}
            navigation={this.props.navigation}
          />
        );
        break;
    }
  }

  render() {
    const { currentUser } = getAuth();
    console.log("currentUser: " + currentUser.email);
    var isHomeTabSelected = true;
    if (this.state.selectedTab !== "Home") {
      isHomeTabSelected = false;
    }

    return (
      <Container>
        {!isHomeTabSelected && (
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
              <Title>Welcome</Title>
              <Subtitle>
                {this.props.profile.first_name} {this.props.profile.last_name}
              </Subtitle>
            </Body>

            <Right>
              <Button block dark onPress={this.logout}>
                <Icon name="log-out" />
                <Text>Log Out</Text>
              </Button>
            </Right>
          </Header>
        )}

        {this.renderSelectedTab()}
        <Footer>
          <FooterTab style={{ backgroundColor: "black" }}>
            <Button
              active={this.state.selectedTab === "Home"}
              onPress={() => this.setState({ selectedTab: "Home" })}
            >
              <Icon active={this.state.selectedTab === "Home"} name="home" />
              <Text>Home</Text>
            </Button>
            <Button
              active={this.state.selectedTab === "Books"}
              onPress={() => this.setState({ selectedTab: "Books" })}
            >
              <Icon active={this.state.selectedTab === "Books"} name="book" />
              <Text>My Books</Text>
            </Button>
            <Button
              active={this.state.selectedTab === "Profile"}
              onPress={() => this.setState({ selectedTab: "Profile" })}
            >
              <Icon
                active={this.state.selectedTab === "Profile"}
                name="person"
              />
              <Text>Me</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  console.log("State in UserHomeScreenTab");
  console.log(state);
  return {
    profile: state.profile
  };
};

export default connect(mapStateToProps, {
  userProfileFetch
})(UserHomeScreenTab);
