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
import UserBorrowedBookList from "../UserBooksList/UserBorrowedBookList";
import UserReservedBookList from "../UserBooksList/UserReservedBookList";

class ManageUserBooks extends Component {
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
            <Text>Borrowed</Text>
          </Button>
          <Button
            active={this.state.selectedSegment === 2 ? true : false}
            onPress={() => this.setState({ selectedSegment: 2 })}
          >
            <Text>Reserved</Text>
          </Button>
        </Segment>

        {this.state.selectedSegment === 1 && <UserBorrowedBookList />}
        {this.state.selectedSegment === 2 && <UserReservedBookList />}
      </Container>
    );
  }
}

export default ManageUserBooks;
