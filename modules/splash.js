'use strict';

import React, {
  Component,
  Image,
  View
} from 'react-native';

class SplashPage extends Component {
  componentWillMount() {
    var navigator = this.props.navigator;
    setTimeout(() => {
      navigator.replace({
        id: 'Flow',
      });
    }, 5000);
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#ffffff', alignItems: 'center'}}>
        <Image style={{width: 170, height: 170, marginTop: 100}} source={require('../images/splash_logo.png')} />
      </View>
    );
  }
}

module.exports = SplashPage;
