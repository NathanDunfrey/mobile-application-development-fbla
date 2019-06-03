import React, { Component } from 'react';

import {
  View,
  Text
} from 'react-native';

import ImageView from 'react-native-image-view';

// Displays an image under the map tab
class Map extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text style={{
          fontSize: 20,
          textAlign: 'center',
          margin: 10,
        }}>
          (You just closed the map)
        </Text>
        <ImageView
          source={require('../../../assets/img/map.png')}
          isVisible={true}
          imageWidth={1920}
          imageHeight={1080}
        />
      </View>
    );
  }
}

export default Map;
