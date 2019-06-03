import React, { Component } from "react";
import { ScrollView } from "react-native";
import { connect } from "react-redux";

import {
  Container,
  Header,
  Title,
  Subtitle,
  Content,
  Button,
  Footer,
  FooterTab,
  Text,
  Body,
  Left,
  Right,
  Icon
} from "native-base";

import ManageUsersTab from "./manageUsersTab";
import ManageBooksTab from "./manageBooksTab";
import UserProfilePage from "../UserProfilePage";
import UserProfileDetails from "../UserHomeScreenTab/UserProfileDetails";
import RequestsTab from "./requestsTab";
import styles from "./styles";
import { getDatabase, getAuth } from "../../../firebase";
import { userProfileFetch } from "../../actions";

class AdminScreens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "Users"
    };

    this.logout = this.logout.bind(this);
  }

  componentWillMount() {
    this.props.userProfileFetch();
  }

  renderSelectedTab() {
    switch (this.state.selectedTab) {
      case "Users":
        return <ManageUsersTab navigation={this.props.navigation} />;
        break;
      case "Books":
        return <ManageBooksTab navigation={this.props.navigation} />;
        break;
      case "Profile":
        return <UserProfileDetails userProfile={this.props.profile} />;
        break;
      case "Requests":
        return <RequestsTab />;
        break;
      default:
        return <ManageUsersTab />;
        break;
    }
  }

  logout() {
    console.log(
      "inside AdminScreens logout(): " + this.props.profile.member_type
    );

    // logout, once that is complete, return the user to the login screen.
    getAuth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate("LoginScreen", { accountType: "ADMIN" });
      });
  }

  render() {
    const { currentUser } = getAuth();

    return (
      <Container>
        <Header style={{ backgroundColor: "dodgerblue" }}>
          <Body
            style={{
              flex: 3
            }}
          >
            <Title> Welcome</Title>
            <Subtitle>
              {this.props.profile.first_name} {this.props.profile.last_name}
            </Subtitle>
          </Body>

          <Right>
            <Button dark block onPress={this.logout}>
              <Icon name="log-out" />
              <Text>Log Out</Text>
            </Button>
          </Right>
        </Header>

        {this.renderSelectedTab()}

        <Footer>
          <FooterTab style={{ backgroundColor: "black" }}>
            <Button
              active={this.state.selectedTab === "Users"}
              onPress={() => this.setState({ selectedTab: "Users" })}
            >
              <Icon active={this.state.selectedTab === "Users"} name="people" />
              <Text>Users</Text>
            </Button>
            <Button
              active={this.state.selectedTab === "Books"}
              onPress={() => this.setState({ selectedTab: "Books" })}
            >
              <Icon active={this.state.selectedTab === "Books"} name="book" />
              <Text>Books</Text>
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
            <Button
              active={this.state.selectedTab === "Requests"}
              onPress={() => this.setState({ selectedTab: "Requests" })}
            >
              <Icon
                active={this.state.selectedTab === "Requests"}
                name="md-chatboxes"
              />
              <Text>Requests</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  console.log("state after redux userProfileFetch() call: ", state);
  return {
    profile: state.profile
  };
};

export default connect(mapStateToProps, { userProfileFetch })(AdminScreens);
