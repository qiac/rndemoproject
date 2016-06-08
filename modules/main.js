/*
 * App主页
 */
'use strict';

import React, { AppRegistry, Component, View, Text, ScrollView } from 'react-native';
import Tabbar, { Tab, RawContent, IconWithBar, glypyMapMaker } from 'react-native-tabbar';
import moment from 'moment';

// 底部菜单栏图标
const glypy = glypyMapMaker({Application: 'e900', Message: 'e901', UserInfo: 'e902' });

// '申请'页面
import ApplicationComp from './application/applyList';
//import ApplicationComp from './application/filter';
// '消息'页面
import MessageComp from './message/message';
// '我的'页面
import UserInfoComp    from './userInfo/userInfo';

class MainComp extends Component {
  render() {
    return (
      <Tabbar barColor={'#27282a'}>
        <Tab name="application">
          <IconWithBar label="申请" type={glypy.Application} from={'gk-iconfonts'} applyCount={8} size={20}
            onActiveColor='#f8db1c' onInactiveColor='#fff' onActiveColorBar='#fff' onInactiveColorBar='#fff'/>
          <RawContent>
            <ApplicationComp marginBottomHeight={50} navigator={this.props.navigator} />
          </RawContent>
        </Tab>

        <Tab name="message">
          <IconWithBar label="消息" type={glypy.Message} from={'gk-iconfonts'} unreadMsgCount={100} size={20}
            onActiveColor='#f8db1c' onInactiveColor='#fff' onActiveColorBar='#fff' onInactiveColorBar='#fff'/>
          <RawContent>
              <MessageComp marginBottomHeight={50} navigator={this.props.navigator} />
          </RawContent>
        </Tab>

        <Tab name="userInfo">
          <IconWithBar label="我的" type={glypy.UserInfo} from={'gk-iconfonts'} size={20}
            onActiveColor='#f8db1c' onInactiveColor='#fff' onActiveColorBar='#fff' onInactiveColorBar='#fff'/>
          <RawContent>
            <UserInfoComp marginBottomHeight={50} navigator={this.props.navigator} />
          </RawContent>
        </Tab>
      </Tabbar>
    );
  }
}
module.exports = MainComp;
