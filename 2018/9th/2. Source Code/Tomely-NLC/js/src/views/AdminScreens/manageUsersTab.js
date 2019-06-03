import React, { Component } from "react";

import {
  Container,
  Header,
  Title,
  Content,
  Text,
  H3,
  Button,
  Icon,
  Footer,
  FooterTab,
  Left,
  Right,
  Body,
  Segment
} from "native-base";

import styles from "./styles";
import AddUsers from "./addUsers";
import AdminUsersList from "./listUsers";

class ManageUsersTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSegment: 1
    };
  }

  render() {
    return (
      <Container>
        <Segment style={{ backgroundColor: "black" }}>
          <Button
            first
            active={this.state.selectedSegment === 1 ? true : false}
            onPress={() => this.setState({ selectedSegment: 1 })}
          >
            <Text>Search Users</Text>
          </Button>
          <Button
            active={this.state.selectedSegment === 2 ? true : false}
            onPress={() => this.setState({ selectedSegment: 2 })}
          >
            <Text>Add Users</Text>
          </Button>
        </Segment>

        {this.state.selectedSegment === 1 && (
          <AdminUsersList navigation={this.props.navigation} />
        )}
        {this.state.selectedSegment === 2 && <AddUsers />}
      </Container>
    );
  }
}

export default ManageUsersTab;
