import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { ListView, View, Image } from "react-native";
import { fetchReservedBooksByUser } from "../../actions";
import styles from "./styles";

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

class UserReservedBookList extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchReservedBooksByUser();
    this.createDataSource(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props

    this.createDataSource(nextProps);
  }

  createDataSource({ books }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(books);
  }

  render() {
    console.log("UserReservedBookList render(): ");
    console.log(this.props.books);
    return (
      <Content keyboardShouldPersistTaps="always">
        <View>
          <ListView
            keyboardShouldPersistTaps="always"
            enableEmptySections
            dataSource={this.dataSource}
            renderRow={data => (
              <ListItem thumbnail>
                <Left>
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      marginTop: 5,
                      marginBottom: 10
                    }}
                    source={{ uri: data.image_url }}
                    resizeMode="contain"
                  />
                </Left>
                <Body style={{ borderBottomWidth: 0 }}>
                  <Text>{data.title}</Text>
                  <Text numberOfLines={1} note>
                    {data.author}
                  </Text>
                  <Text
                    style={{ fontWeight: "bold", color: "blue" }}
                    numberOfLines={1}
                    note
                  >
                    Reserved On:{" "}
                    {moment(data.last_activity_date).format("MM/DD/YYYY")}{" "}
                  </Text>
                </Body>
                <Right style={{ borderBottomWidth: 0 }} />
              </ListItem>
            )}
            renderSeparator={(sectionId, rowId) => (
              <View key={rowId} style={styles.separator} />
            )}
          />
        </View>
      </Content>
    );
  }
}

const mapStateToProps = state => {
  const books = _.map(state.reserved_books, (val, uid) => {
    return { ...val, uid };
  });

  return { books };
};

export default connect(mapStateToProps, { fetchReservedBooksByUser })(
  UserReservedBookList
);
