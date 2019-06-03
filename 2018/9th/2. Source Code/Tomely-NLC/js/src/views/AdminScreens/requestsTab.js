import React, { Component } from "react";

import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Segment,
  Button
} from "native-base";
import moment from "moment";
import NewRequests from "../Requests/NewRequests";
import ReviewedRequests from "../Requests/ReviewedRequests";
import CompletedRequests from "../Requests/CompletedRequests";
import styles from "./styles";
import { getDatabase } from "../../../firebase";

class RequestsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSegment: 1,
      newRequests: [],
      reviewedRequests: [],
      completedRequests: []
    };
  }

  componentWillMount() {
    this.setState({
      newRequests: [],
      reviewedRequests: [],
      completedRequests: []
    });

    this.searchNewRequests();
    this.searchReviewedRequests();
    this.searchCompletedRequests();
  }

  searchNewRequests() {
    getDatabase()
      .ref(`/middletonhighschool/requests`)
      .orderByChild("status")
      .equalTo("NEW")
      .on("value", snapshot => {
        console.log(snapshot.val());
        var requestItems = [];

        snapshot.forEach(child => {
          requestItems.push({
            request_data: child.val(),
            key: child.key
          });
        });

        if (requestItems !== null) {
          this.setState({ newRequests: requestItems });
        } else {
          this.setState({ newRequests: null });
        }
      });
  }

  searchReviewedRequests() {
    getDatabase()
      .ref(`/middletonhighschool/requests`)
      .orderByChild("status")
      .equalTo("REVIEWED")
      .on("value", snapshot => {
        console.log(snapshot.val());
        var requestItems = [];

        snapshot.forEach(child => {
          requestItems.push({
            request_data: child.val(),
            key: child.key
          });
        });

        if (requestItems !== null) {
          this.setState({ reviewedRequests: requestItems });
        } else {
          this.setState({ reviewedRequests: null });
        }
      });
  }

  searchCompletedRequests() {
    getDatabase()
      .ref(`/middletonhighschool/requests`)
      .orderByChild("status")
      .equalTo("COMPLETED")
      .on("value", snapshot => {
        console.log(snapshot.val());
        var requestItems = [];

        snapshot.forEach(child => {
          requestItems.push({
            request_data: child.val(),
            key: child.key
          });
        });

        if (requestItems !== null) {
          this.setState({ completedRequests: requestItems });
        } else {
          this.setState({ completedRequests: null });
        }
      });
  }

  render() {
    return (
      <Container>
        <Segment>
          <Button
            first
            active={this.state.selectedSegment === 1 ? true : false}
            onPress={() => this.setState({ selectedSegment: 1 })}
          >
            <Text>New</Text>
          </Button>
          <Button
            active={this.state.selectedSegment === 2 ? true : false}
            onPress={() => this.setState({ selectedSegment: 2 })}
          >
            <Text>Reviewed</Text>
          </Button>
          <Button
            active={this.state.selectedSegment === 3 ? true : false}
            onPress={() => this.setState({ selectedSegment: 3 })}
          >
            <Text>Completed</Text>
          </Button>
        </Segment>

        {this.state.selectedSegment === 1 && (
          <NewRequests requestData={this.state.newRequests} />
        )}
        {this.state.selectedSegment === 2 && (
          <ReviewedRequests requestData={this.state.reviewedRequests} />
        )}
        {this.state.selectedSegment === 3 && (
          <CompletedRequests requestData={this.state.completedRequests} />
        )}
      </Container>
    );
  }
}

export default RequestsTab;
