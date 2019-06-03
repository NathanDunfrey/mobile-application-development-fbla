import { View, StyleSheet } from 'react-native';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';


// Set up the properties that are required for this component
const propTypes = {
    children: PropTypes.node.isRequired,
};

// Set the default properties
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

// Container that fills the space it's given
class Container extends Component {
    render() {
        return (
            <View style={styles.container}>
                {this.props.children}
            </View>
        );
    }
}

Container.propTypes = propTypes;

export default Container;
