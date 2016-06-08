/*
 * Token判断页面，完成'登录页'或'主页面'的跳转逻辑
 */
'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  AsyncStorage,
  Text,
  View
} from 'react-native';

// 登录页
import LoginComp from './login';
// 主页面
import MainComp from './main';
// 上下文
var context = null;

class Flow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: 'unknown',
    };
    context = this;
  }

  // 登录回调
  loginCallback(token) {
    this.setState({ token: token });
  }

  // 登出回调
  static logoutCallback() {
    context.setState({ token: '' });
  }

  render() {
    if(this.state.token === 'unknown') {
      return (<View style={{ flex:1 }}/>);
    }

    if(this.state.token === '') {
      return <LoginComp loginCallback={this.loginCallback.bind(this)}/>;
    }
    
    return <MainComp navigator={this.props.navigator} />;
  }

  componentDidMount() {
    AsyncStorage.getItem('token', (err, token) => {
      if (!err && token) {
        context.setState({ token: token });
      } else {
        context.setState({ token: '' });
      }
    });
  }
}

module.exports = Flow;