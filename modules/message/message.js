/**
 * IM消息界面
 */
'use strict';

import React,{
    View,
    Text,
    Image,
    ListView,
    AlertIOS,
    StyleSheet,
    Component,
    TouchableHighlight,
    PixelRatio,
    Platform,
} from 'react-native';

import HttpUtils from '../common/http_util';
import Service from '../common/service';
import {loadView} from '../common/gk_util';

var RNCorrespond = require('react-native').NativeModules.RNCorrespond;
var DialogAndroid = require('../../supports/react-native-dialogs/index');

// var options = {
//   title: 'Hello, World!',
//   content: 'I\'m just simple Dialog',
//   positiveText: 'OK',
//   negativeText: 'Cancel'
// };

// var dialog = new DialogAndroid();
    // dialog.set(options);
    // dialog.show();


class IMMessageComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      dataSource: new ListView.DataSource({rowHasChanged:(r1,r2) => r1 !== r2}),
    };
  }

  render() {
    return (
        <View style={{flex: 1, marginBottom: this.props.marginBottomHeight, backgroundColor: '#fff'}}>

          {/* 头部 */}
          <View style={styles.header}>
              <View style={{flex: 1}} />
              <Text style={{flex: 6, color: '#000', fontSize: 17, textAlign:'center'}}>消息</Text>

              {/* 选中按钮 */}
              <TouchableHighlight style={{flex:1}} underlayColor='#00000000' onPress={this.onSelectButtonPressed.bind(this)}>
                  <Text style={{textAlign:'right', marginRight:8, color: '#000', fontSize: 15}}>{this.state.editMode ? '完成' : '编辑'}</Text>
              </TouchableHighlight>
          </View>

          {/* 消息列表 */}
          <ListView dataSource={this.state.dataSource} renderHeader={this.renderHeadView.bind(this)} renderRow={this.renderListItem.bind(this)} />
        </View>
    )
  }

  componentDidMount() {
      // 获取会话列表数据
      var _this = this;
      var data = '{"results":[{"time":"12:00", "icon":"", "real_name":"陶邦平", "content":"Test", "unread_count":5}, {"time":"12:00", "icon":"", "real_name":"陶邦平", "content":"Test", "unread_count":5}, {"time":"12:00", "icon":"", "real_name":"陶邦平", "content":"Test", "unread_count":5}]}';
      _this.setState({
                  dataSource: _this.state.dataSource.cloneWithRows(JSON.parse(data).results),
              });
      // RNCorrespond.getAllConversations(function(data) {
      //     if(data) {
      //         _this.setState({
      //             dataSource: _this.state.dataSource.cloneWithRows(JSON.parse(data).results),
      //         });
      //     }
      // });
  }

  /*
   * 渲染ListView头部视图
   */
  renderHeadView() {
    return (
      <TouchableHighlight underlayColor="#eee" onPress={this.onHeadViewPressed.bind(this)}>
          <View style={styles.list_header}>
              <Image style={styles.list_avatar} source={require('../../images/logo.png')} />
              <View style={{flex: 1}}>
                  <Text style={styles.list_date}></Text>
                  <View style={{flex: 1, flexDirection: 'row', marginLeft: 10, alignItems:'center'}}>
                      <Text style={styles.list_name}>捷库小助手</Text>
                  </View>
                  <Text numberOfLines={1} style={styles.list_content}>您好，随时为你排除万难！</Text>
              </View>

              {/* 未读消息个数 */}
              {this.getBadgeView(2)}
          </View>
      </TouchableHighlight>
    );
  }

  /*
   * 渲染ListView条目视图
   */
  renderListItem(item: json, sectionID: number, rowID: number){
      // 获取应聘者图像
      let avatar = null;
      if (item.icon) {
          avatar = {uri: item.icon};
      } else {
          avatar = require('../../images/logo.png');
      }

      return(
          <TouchableHighlight underlayColor="#eee" onPress={this.onListViewItemPressed.bind(this, item)}>
              <View style={styles.list_view}>
                  <Image style={styles.list_avatar} source={avatar} />
                  <View style={{flex: 1}}>
                      <Text style={styles.list_date}>{item.time}</Text>
                      <View style={{flex: 1, flexDirection: 'row', marginLeft: 10, alignItems:'center'}}>
                          <Text style={styles.list_name}>陶邦平</Text>
                          <View style={styles.list_state}>
                              <Text style={{fontSize: 14, color: '#3b3b3b'}}>收银员</Text>
                          </View>
                      </View>
                      <Text numberOfLines={1} style={styles.list_content}>{item.content}</Text>
                  </View>

                  {/* 未读消息个数 */}
                  {this.getBadgeView(item.unread_count)}
              </View>
          </TouchableHighlight>
      )
  }

  /*
   * 渲染BadgeView条目视图
   */
  getBadgeView(count) {
    if(count == 0) return null;
    // 一位数字
    if(count < 10) {
        return (
            <View style={styles.list_unread_1x}>
                <Text style={{fontSize: 12, color: '#fff'}}>{count}</Text>
            </View>
        );
    }
    // 两位数字
    else if (count < 100) {
        return (
            <View style={styles.list_unread_2x}>
                <Text style={{fontSize: 11, color: '#fff'}}>{count}</Text>
            </View>
        );
    }
    // 三位数字
    else {
        return (
            <View style={styles.list_unread_3x}>
                <Text style={{fontSize: 11, color: '#fff'}}>99+</Text>
            </View>
        );
    }
  }

  onSelectButtonPressed() {
      this.setState({editMode : !this.state.editMode});

  }

  /*
   * ListView头部视图点击事件
   */
  onHeadViewPressed() {
    RNCorrespond.openIMChat('taobangping');
  }

  /*
   * ListView列表条目点击事件
   */
  onListViewItemPressed(item: json) {
    var _this = this;
    if (this.state.editMode) {
        if (Platform.OS === 'ios') {
            AlertIOS.alert('提醒', '您确定删除此会话吗？',
            [
              {text: '删除', onPress: () => {RNCorrespond.removeConversation(item.ease_username)}},
              {text: '取消'},
            ]);
        } else {
            var options = {
                title: '提醒',
                content: '您确定删除此会话吗？',
                positiveText: '删除',
                negativeText: '取消',
                onPositive: () => {RNCorrespond.removeConversation(item.ease_username)},
            };

            var dialog = new DialogAndroid();
            dialog.set(options);
            dialog.show();
        }
    } else {
        // 打开IM聊天界面
        RNCorrespond.openIMChat(item.ease_username);
    }
  }
}

var styles = StyleSheet.create({
    header: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor : '#f8db1c',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1/PixelRatio.get(),
        paddingTop: Platform.OS === 'ios' ? 12 : 0,
    },
    list_header: {
        flex: 1,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 12,
        flexDirection: 'row',
        borderBottomColor: '#f2f0eb',
        borderBottomWidth : 20 * 1/PixelRatio.get(),
    },
    list_view: {
        flex: 1,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 12,
        flexDirection: 'row',
        borderBottomColor: '#ddd',
        borderBottomWidth : 1/PixelRatio.get(),
    },
    list_avatar: {
        width: 60,
        height: 60,
        marginTop: 12,
        borderRadius: 30,
    },
    list_date: {
        color: '#828282',
        marginTop: 5,
        textAlign: 'right',
        fontSize: 12
    },
    list_name: {
        color: '#3b3b3b',
        fontSize: 18,
        fontWeight: 'bold',
    },
    list_state: {
        paddingLeft: 3,
        paddingRight: 3,
        paddingTop: 1,
        paddingBottom: 1,
        marginLeft: 10,
        borderRadius: 4,
        borderWidth: 1/PixelRatio.get(),
        borderColor: '#828282',
    },
    list_content: {
        flex: 1,
        fontSize: 14,
        color: '#828282',
        marginTop: 4,
        marginLeft: 10
    },
    list_unread_1x: {
        position: 'absolute',
        right: 12,
        top: 30,
        width : 18,
        height : 18,
        justifyContent:'center',
        alignItems : 'center',
        backgroundColor : 'red',
        borderRadius : 9,
    },
    list_unread_2x: {
        position: 'absolute',
        right: 12,
        top: 30,
        width : 19,
        height : 19,
        justifyContent:'center',
        alignItems : 'center',
        backgroundColor : 'red',
        borderRadius : 9.5,
    },
    list_unread_3x: {
        position: 'absolute',
        right: 12,
        top: 30,
        width : 28,
        height : 18,
        justifyContent:'center',
        alignItems : 'center',
        backgroundColor : 'red',
        borderRadius : 8,
    },
})

module.exports = IMMessageComp;