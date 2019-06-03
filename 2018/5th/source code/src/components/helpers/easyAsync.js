import { AsyncStorage } from 'react-native';

/*
An async wrapper that uses JSON.stringify and JSON.parse in order to get, set,
and remove keys in simple oneline callable functions.
*/

const easyAsync = {

  async setItem(key, value) {
    try {
      return await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      alert('AsyncStorage#setItem error: ' + error.message);
    }
  },

  async getItem(key) {
    return await AsyncStorage.getItem(key)
      .then((result) => {
        if (result) {
          try {
            result = JSON.parse(result);
          } catch (e) {
            alert('AsyncStorage#getItem error deserializing JSON for key: ' +
              key, e.message);
          }
        }
        return result;
      }
    );
  },

  async removeItem(key) {
    return await AsyncStorage.removeItem(key);
  }

};

export default easyAsync;
