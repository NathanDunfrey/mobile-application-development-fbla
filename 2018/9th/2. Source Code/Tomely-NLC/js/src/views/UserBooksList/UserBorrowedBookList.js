import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { ListView, View, Modal, Image } from "react-native";
import { fetchBorrowedBooksByUser } from "../../actions";
import { userProfileFetch } from "../../actions";
import styles from "./styles";
import DaysRemaining from "./DaysRemaining";
import AddBookReview from "./AddBookReview";
import { getDatabase, getAuth } from "../../../firebase";

import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  List,
  ListItem,
  Text,
  Thumbnail,
  Left,
  Body,
  Right
} from "native-base";
import moment from "moment";

class UserBorrowedBookList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ModalVisibleStatus: false,
      btnAddBookReviewClicked: false,
      selectedBook: null,
      currentUser: null,
      isBooksOverdue: false
    };
  }

  componentWillMount() {
    this.props.userProfileFetch();
    this.props.fetchBorrowedBooksByUser();
    this.createDataSource(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props

    this.createDataSource(nextProps);
  }

  ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: visible });
  }

  createDataSource({ books }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(books);
  }

  //On Press for viewMap
  addReview = book => () => {
    console.log(this.state.selectedBook);
    console.log("Book Title", book.title); //To get movie title
    console.log("Book author", book.author); //To get movie year
    this.setState({ btnAddBookReviewClicked: true });
    this.setState({ selectedBook: book });

    const { currentUser } = getAuth();
    this.setState({ currentUser: currentUser });

    this.ShowModalFunction(true);
  };

  render() {
    console.log("UserBorrowedBookList render(): BookList");
    console.log(this.props.books);
    console.log("UserBorrowedBookList render(): Profile");
    console.log(this.props.profile);

    var maxReturnByDays = 14;

    if (this.props.profile.member_type !== "STUDENT") {
      maxReturnByDays = 28;
    }

    return (
      <Content keyboardShouldPersistTaps="always">
        <Modal
          transparent={false}
          animationType={"slide"}
          visible={this.state.ModalVisibleStatus}
          onRequestClose={() => {
            this.ShowModalFunction(!this.state.ModalVisibleStatus);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View style={styles.ModalInsideView}>
              {this.state.btnAddBookReviewClicked && (
                <AddBookReview
                  bookData={this.state.selectedBook}
                  userData={this.state.currentUser}
                />
              )}

              <Button
                block
                style={{
                  marginBottom: 5,
                  backgroundColor: "dodgerblue"
                }}
                onPress={() => {
                  this.ShowModalFunction(!this.state.ModalVisibleStatus);
                }}
              >
                <Text style={styles.text}>Close</Text>
              </Button>
            </View>
          </View>
        </Modal>

        <ListView
          keyboardShouldPersistTaps="always"
          enableEmptySections
          dataSource={this.dataSource}
          renderRow={data => (
            <ListItem thumbnail noBorder>
              <Body style={{ borderBottomWidth: 0 }}>
                <Image
                  style={{ width: 100, height: 100 }}
                  source={{ uri: data.image_url }}
                  resizeMode="contain"
                />
                <Text>{data.title}</Text>
                <Text numberOfLines={1} note>
                  {data.author}
                </Text>
                <Text
                  style={{ fontWeight: "bold", color: "red" }}
                  numberOfLines={1}
                  note
                >
                  Due By:{" "}
                  {moment(data.last_activity_date)
                    .add(maxReturnByDays, "days")
                    .format("MM/DD/YYYY")}{" "}
                </Text>
              </Body>
              <Right style={{ borderBottomWidth: 0 }}>
                <DaysRemaining
                  activity_date={moment(data.last_activity_date).format(
                    "MM/DD/YYYY"
                  )}
                  account_type={this.props.profile.member_type}
                />

                <Button
                  small
                  dark
                  block
                  style={styles.mb}
                  onPress={this.addReview(data)}
                >
                  <Icon active name="star" style={{ color: "yellow" }} />
                  <Text style={styles.text}>Add Review</Text>
                </Button>
              </Right>
            </ListItem>
          )}
          renderSeparator={(sectionId, rowId) => (
            <View key={rowId} style={styles.separator} />
          )}
        />
      </Content>
    );
  }
}

const mapStateToProps = state => {
  console.log("mapStateToProps UserBorrowedBookList state: ");
  console.log(state);

  return {
    books: state.borrowed_books,
    profile: state.profile
  };
};

export default connect(mapStateToProps, {
  fetchBorrowedBooksByUser,
  userProfileFetch
})(UserBorrowedBookList);
