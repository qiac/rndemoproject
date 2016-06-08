/**
 * 入口页面, 提供全局的Navigator引用
 */
'use strict';

import React, {
  AppRegistry,
  StyleSheet,
  Component,
  Navigator,
  Platform,
  Text,
  View
} from 'react-native';

import Splash from './splash';
import Flow from './flow';

/*------------------------*
 ** '日历'选项卡下所属页面  **
 *------------------------*/
// 应聘者详情页面
import UserInfo from './application/userDetail';

// 店长详情页面
import UserDetail from './userInfo/user_detail';

// 设置页面
import Settings from './userInfo/settings';

// 报告详情页面
import Report from './userInfo/report';

// 门店详情页面
import StoreDetail from './userInfo/store_detail';

// 门店地址页
import StoreAddress from './userInfo/store_address';

// 海报预览
import JobDetail from './userInfo/job_detail';

// 海报预览
import JobPreview from './userInfo/job_preview';

// 门店预览页
import StorePreview from './userInfo/store_preview';

class AppNavigator extends Component {
    // 页面场景切换效果
    configureScene(route) {
      if (route.sceneConfig) {
        return route.sceneConfig;
      }
      return Navigator.SceneConfigs.FloatFromRight;
    }

    // 处理页面跳转
    renderScene(route, navigator){
      // const Component = route.component;
      // return (
      //   <View style={{flex: 1}}>
      //       <Component navigator={navigator} route={route} {...route.passProps} />
      //   </View>
      // )
      var routeId = route.id;
      switch(routeId) {
          case 'Splash':
              return <Splash navigator={navigator} />;
          case 'Flow':
              return <Flow navigator={navigator} />;
          case 'UserInfo': //应聘者详情
              return <UserInfo navigator={navigator} source={route.passProps.candidate} />;
          case 'Settings':
              return <Settings navigator={navigator} logoutCallback={() => Flow.logoutCallback()}/>;
          case 'Report':
              return <Report navigator={navigator} />;
          case 'UserDetail':
              return <UserDetail navigator={navigator} />;
          case 'StoreDetail':
              return <StoreDetail navigator={navigator}  source={route.passProps} />;
          case 'StoreAddress':
              return <StoreAddress navigator={navigator} />;
          case 'JobDetail':
              return <JobDetail navigator={navigator} />;
          case 'JobPreview':
              return <JobPreview navigator={navigator} source={route.passProps} />;
          case 'StorePreview':
              return <StorePreview navigator={navigator} source={route.passProps} />;
      }
    }

    shouldComponentUpdate() {
      return false;
    }

    render() {
        return (
          <Navigator
            initialRoute={{ id: Platform.OS === 'ios' ? 'Flow' : 'Splash' }}
            configureScene={this.configureScene}
            renderScene={this.renderScene} />
        );
    }
}
AppRegistry.registerComponent('RNRecruiterProj', () => AppNavigator);
