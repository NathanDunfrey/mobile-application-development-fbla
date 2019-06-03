import React, { Component } from 'react';

import {
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

import { PropTypes } from 'prop-types';



// Set up the properties that are required for this component
const propTypes = {
  catalog: PropTypes.array.isRequired,
  height: PropTypes.number,
};

// Set the default properties
const defaultProps = {
  catalog: null,
  height: 300,
};

class CatalogList extends Component {
  constructor(props) {
    super(props);

    // For FlatList, every item needs a key so that it can be memory efficient
    this.props.catalog.forEach((item, i) => {
      item.key = i + 1;
    });

    // Function definitions
    this.handlePress = this.handlePress.bind(this);

  }

  // Navigate to the check out screen for the book pressed
  handlePress = (item) => {
    this.props.navigation.navigate('CheckOutScreen', {
      navigation: this.props.navigation,
      item: item
    });
  };

  render() {
    return(
      <FlatList
        data={this.props.catalog}
        horizontal={true}
        showsHorizontalScrollIndicator={false}

        renderItem={({item}) => {

          // Retain aspect ratio and scale the image to the defined height
          var height = this.props.height;
          var width = height / (item.cover.y / item.cover.x);

          return (
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={() => this.handlePress(item)}
            >

              <Image
                source={{uri: item.cover.url}}
                style={{
                  height: height,
                  width: width,
                }}
              />

            </TouchableOpacity>
          );
        }}
      />
    );
  }
}

CatalogList.propTypes = propTypes;

CatalogList.defaultProps = defaultProps;

export default CatalogList;
