'use strict';

/*
 * '我的'页面
 */
import React, {
    Easing,
    Animated,
    Dimensions,
    StyleSheet,
    BackAndroid,
    Component,
    Platform,
    ScrollView,
    TouchableHighlight,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    AsyncStorage,
    Image,
    Text,
    View,
    PixelRatio
} from 'react-native';

import HttpUtils from '../common/http_util';
import Service from '../common/service';
// '按岗位查看'页面
import TabJob   from './tab_job';
// '按门店查看'页面
import TabStore from './tab_store';

import { iconFontMaker } from '../common/gk_util';
const glypy = iconFontMaker({ Setting: 'e905', ArrowRight: 'e912', Store: 'e904', Person: 'e908' });
var screenWidth = Dimensions.get('window').width;

class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            icon: '',
            real_name: '',
            role_name: '',
            loaded: false,
            tabUnderline: new Animated.Value(0),
            currentSelect: 0,
        };

        // 门店列表数据
        this.stores = [];
        // 门店列表后台返回数据
        this.storeListData = null;
    }
    /*
     * 点击设置按钮
     */
    onSettingButtonClick() {
        this.props.navigator.push({id: 'Settings'})
    }
    /*
     * 点击我的信息
     */
    onMyInfoClick() {
        this.props.navigator.push({id: 'UserDetail'})
    }
    /*
     * 点击我的员工
     */
    onMyEmployeeClick() {
        this.props.navigator.push({id: 'MyEmployee', passProps: {stores: this.storeListData}});
    }
    /*
     * 点击我的员工
     */
    onReportClick() {
        this.props.navigator.push({id: 'Report'});
    }
    /*
     * 等待进度条
     */
    renderLoadingView() {
        if (Platform.OS === 'ios') {
          return <ActivityIndicatorIOS style={{marginTop:10}} size="small" color='#737373'/>;
        } else {
          return <ProgressBarAndroid style={{marginTop:10}} styleAttr="Inverse" color="#737373"/>;
        }
    }
    /*
     * 点击Tab开始动画并切换页面
     */
    onTabPressed(value: number) {
      if(this.state.currentSelect !== value) {
        Animated.timing(this.state.tabUnderline,
          { toValue: value, duration: 300, easing: Easing.linear }
        ).start();
        this.setState({ currentSelect: value });
      }
    }

    componentDidMount() {
        const _this = this;
        // 从缓存中获取头像、真实姓名、角色
        AsyncStorage.multiGet(['icon', 'real_name', 'role_name'],
            function(err, result) {
                var icon = result[0][1];
                var real_name = result[1][1];
                var role_name = result[2][1];

                _this.setState({
                    icon: icon,
                    real_name: real_name,
                    role_name: role_name,
                });
            }
        );
    }

    render() {
        // 获取头像
        let headIcon = null;
        if(this.state.icon) {
            headIcon = {uri: this.state.icon};
        } else {
            headIcon = require('../../images/head_default.png');
        }
          var left = this.state.tabUnderline.interpolate({
          inputRange: [0, 1], outputRange: [screenWidth/8, screenWidth*5/8]
        });
        return(
            <View style={{flex: 1, marginBottom:this.props.marginBottomHeight, backgroundColor: '#f2f2f2'}} >
                {/* 头部 */}
                <View style={styles.header}>
                    <View style={{flex: 1}} />
                    <Text style={{flex: 6,color: '#000', fontSize: 17, textAlign:'center'}}>我的</Text>
                    {/* 设置按钮 */}
                    <TouchableHighlight style={{flex:1}} underlayColor='#00000000' onPress={this.onSettingButtonClick.bind(this)}>
                        <Text style={{textAlign:'right', marginRight:10, color: '#737373', fontSize: 16, fontFamily: 'gk-iconfonts'}}>设置</Text>
                    </TouchableHighlight>
                </View>
                <ScrollView>
                    {/* 我的信息 */}
                    <View>
                        <TouchableHighlight onPress={this.onMyInfoClick.bind(this)} underlayColor="#ddd">
                            <View style={styles.myinfo}>
                                {/* 头像 */}
                                <View>
                                  <Image style={{width: 80, height: 80, borderRadius: 40, marginTop: 10,borderWidth: 1,
                                  borderBottomColor: '#f2f2f2',}}
                                      source={headIcon} />
                                      {
                                        <Image style={{width: 20, height: 20,  marginTop: -20,marginLeft: 60,position : 'absolute',}}
                                            source={require('../../images/head_edit.png')} />
                                      }
                                </View>
                                    {/* 姓名和角色*/}
                                    <View>
                                        <Text style={{fontSize: 20, color: '#101010'}}>{this.state.real_name}</Text>
                                    </View>
                            </View>

                        </TouchableHighlight>
                    </View>
                    {/* Tab项 */}
                    <View style={[styles.tabs, {backgroundColor: 'white'}]}>
                      {/*第一个Tab*/}
                      <TouchableHighlight style={styles.tab} underlayColor='#eee' activeOpacity={0.8} onPress={this.onTabPressed.bind(this, 0)}>
                        <Text style={this.state.currentSelect === 0 ? styles.textBold : styles.textNormal}>
                          我的岗位
                        </Text>
                      </TouchableHighlight>

                      {/*第二个Tab*/}
                      <TouchableHighlight style={styles.tab} underlayColor='#eee' activeOpacity={0.8} onPress={this.onTabPressed.bind(this, 1)}>
                        <Text style={this.state.currentSelect === 1 ? styles.textBold : styles.textNormal}>
                          我的门店
                        </Text>
                      </TouchableHighlight>

                      {/*滚动条*/}
                      <Animated.View style={[styles.tab_under_line, {left}]} />
                    </View>

                    {/*第一个Tab内容页*/}
                    <View style={this.state.currentSelect === 0 ? styles.show : styles.hide}>
                      <TabJob  navigator={this.props.navigator} />
                    </View>

                    {/*第二个Tab内容页*/}
                    <View style={this.state.currentSelect === 1 ? styles.show : styles.hide}>
                      <TabStore navigator={this.props.navigator} />
                    </View>

                    {/* 我的员工
                    <View style={{marginTop: 10, marginBottom: 10}}>
                        <TouchableHighlight underlayColor="#ddd" onPress={this.onMyEmployeeClick.bind(this)}>
                            <View style={styles.myinfo}>
                                <Text style={{color: '#101010', fontSize: 20, fontFamily: 'gk-iconfonts'}}>{glypy.Person}</Text>
                                <Text style={{color: '#101010', fontSize: 16, marginLeft: 6}}>我的门店</Text>

                            </View>
                        </TouchableHighlight>
                    </View>*/}
                    {/* 招聘海报
                    <View style={{marginTop: 0, marginBottom: 10}}>
                        <TouchableHighlight underlayColor="#ddd" onPress={this.onReportClick.bind(this)}>
                            <View style={styles.myinfo}>
                                <Text style={{color: '#101010', fontSize: 20, fontFamily: 'gk-iconfonts'}}>{glypy.Person}</Text>
                                <Text style={{color: '#101010', fontSize: 16, marginLeft: 6}}>招聘海报</Text>

                                <View style={{flex: 1, alignItems: 'flex-end'}}>
                                    <Text style={{color: '#737373', fontSize: 14, fontFamily: 'gk-iconfonts'}}>{glypy.ArrowRight}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>*/}
                    {/* 沟通过
                    <View style={{marginTop: 0, marginBottom: 10}}>
                      <TouchableHighlight underlayColor="#ddd" onPress={this.onReportClick.bind(this)}>
                          <View style={styles.myinfo}>
                              <Text style={{color: '#101010', fontSize: 20, fontFamily: 'gk-iconfonts'}}>{glypy.Person}</Text>
                              <Text style={{color: '#101010', fontSize: 16, marginLeft: 6}}>沟通过（300）</Text>

                              <View style={{flex: 1, alignItems: 'flex-end'}}>
                                  <Text style={{color: '#737373', fontSize: 14, fontFamily: 'gk-iconfonts'}}>{glypy.ArrowRight}</Text>
                              </View>
                          </View>
                      </TouchableHighlight>
                    </View>*/}
                </ScrollView>
            </View>
        )
    };
}

var styles = StyleSheet.create({
    header: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor : '#f8db1c',
    },
    myinfo: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    tabs: {
      height: 50,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    tab: {
      flex:1,
      justifyContent:'center',
      alignItems:'center'
    },
    tab_under_line: {
        position: 'absolute',
        width: screenWidth / 4,
        justifyContent:'center',
        height: 4,
        backgroundColor: '#f8db1c',
        bottom: 5,
    },
    show: {
        flex: 1,
        marginBottom:10,
        marginTop:10,
        //height: 200,
        position: 'relative',
        backgroundColor:'#ffffff'
    },
    hide: {
        position: 'absolute',
        height: 200,
        backgroundColor:'#ffffff',
        top: 3000
    },
      textBold: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000'
      },
      textNormal: {
        fontWeight: 'normal',
        fontSize: 16,
        color: '#000'
      }
});

module.exports = UserInfo;
