import React, { Component } from 'react';

import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet
} from 'react-native';

import { Toolbar } from 'react-native-material-ui';

import CatalogList from './CatalogList'


const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    margin: 10,
  }
});



class Catalog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchInput: "",
      catalog: require('../../../assets/data/catalog.json'),
      catalogs: []
    };


    // Add "All" as a tag to each book
    this.state.catalog.forEach((item, i) => {
      item.tags.push("All");
    });

    // Function definition
    this.filterCatalog = this.filterCatalog.bind(this);
  }

  // Filter out books that don't have the specified tag
  filterCatalog = (tag) => {
    return this.state.catalog.filter((item) => {
      return item.tags.includes(tag)
    });
  }

  render() {

    var tags = [];
    // Get all tags from the catalog
    tags = [].concat.apply([], this.state.catalog.map((item) => item.tags));
    // Remove duplicates
    tags = Array.from(new Set(tags));
    // Set them up for being ordered
    tags = tags.map((tag) => {
      return {[tag]: this.filterCatalog(tag)}
    })
    // Actually sort them
    tags.sort((a, b) => {
      return b[Object.keys(b)[0]].length - a[Object.keys(a)[0]].length
    })
    // Format for display
    for (var i = 0; i < tags.length; i++) {
      this.state.catalogs.push(
        <View key={i}>
          <Text style={styles.text}>{Object.keys(tags[i])[0]}</Text>
          <CatalogList
            catalog={tags[i][Object.keys(tags[i])[0]]}
            navigation={this.props.navigation}
          />
        </View>
      )
    };

    return(
      <View style={{
        flex: 1 // Fill the screen minus BottomNavigation bar
      }}>

        <Toolbar
          leftElement={
            <Image
              style={{
                height: 35,
                width: 35
              }}
              source={require('../../../assets/img/miskatonic.png')}
            />
          }
          centerElement="Catalog"
        />


        {/* In order to scroll through multiple lists from different tags */}
        <FlatList
          data={this.state.catalogs}
          renderItem={({item}) => {
            return (item)
          }}
        />
      </View>
    );
  }
}

export default Catalog;
