/**
 * 设置页面
 */
'use strict';

import React, {
    StyleSheet,
    AsyncStorage,
    View,
    Text,
    Image,
    Component,
    PixelRatio,
    Platform,
    TouchableHighlight,
} from 'react-native';

var RNCorrespond = require('react-native').NativeModules.RNCorrespond;

import { iconFontMaker, GKAlert } from '../common/gk_util';
const glypy = iconFontMaker({ ArrowLeft: 'e903' });

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            app_version: '',
        };
    }
    /*
     * 点击返回按钮
     */
    onBackButtonClick() {
        this.props.navigator.pop();
    }
    /*
     * 点击清理按钮
     */
    onClearClick() {

    }

    /*
     * 点击登出按钮
     */
    onLogoutButtonClick() {
        GKAlert.alert(
            '提醒',
            '您确定要退出登录吗？',
            [{text: '取消'}, {text: '确定', onPress: this.logout.bind(this)}]
        );
    }
    /*
     * 登出操作
     */
    logout() {
        var _this = this;
        AsyncStorage.setItem('token', '', (err) => {
            if (!err) {
                _this.props.logoutCallback();
                _this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[0]);
            }
        });
    }

    componentDidMount() {
        var _this = this;
        // 获取App版本号
        RNCorrespond.getAppVersion(function(ver) {
          _this.setState({ app_version: ver });
        });
    }

    render() {
        var description = '捷库招聘工具，帮助您快速招聘到合适的员工。发布招聘海报，查看应聘者简历，与应聘者在线沟通尽在掌握。门店招工，再不愁啦！';

        return(
            <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                {/* 头部 */}
                <View style={styles.header}>
                    {/* 返回按钮 */}
                    <TouchableHighlight style={{flex:1}} underlayColor='#00000000' onPress={this.onBackButtonClick.bind(this)}>
                        <Text style={{textAlign:'left', paddingLeft: 10, color: '#737373', fontSize: 20, fontFamily: 'gk-iconfonts'}}>{glypy.ArrowLeft}</Text>
                    </TouchableHighlight>

                    <Text style={{flex: 6, color: '#000', fontSize: 17, textAlign:'center'}}>设置</Text>

                    <View style={{flex: 1}} />
                </View>

                {/* Logo、名称及描述 */}
                <View style={styles.logoview}>
                    <Image style={styles.logo} source={require('../../images/splash_logo.png')} />
                </View>
                <View style={styles.clearview} >
                      <Text style={styles.app_clear}>清除缓存: </Text>
                      <Text style={styles.app_clear_content}>12M</Text>
                 </View>
                {/* 版本号 */}
                <Text style={styles.app_version}>版本号: {this.state.app_version}</Text>
                  <Text style={styles.app_content}>捷库招聘工具是全世界最好用最靠谱的一线员工招聘工具，帮你快速找到牛人。</Text>

                {/* 退出登录 */}
                <TouchableHighlight style={styles.button} underlayColor="#eee" onPress={this.onLogoutButtonClick.bind(this)}>
                    <Text style={{fontSize: 18, color: '#f2f2f2', alignSelf: 'center'}}>退出登录</Text>
                </TouchableHighlight>
            </View>
        )
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

    logoview: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 40
    },
    app_name: {
        marginLeft: 20,
        marginBottom: 10,
        alignSelf: 'flex-end',
        color: '#555',
        fontSize: 22,
        fontWeight: 'bold',
    },
    clearview: {
        marginTop:30,
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    app_clear: {
      flex:2,
      textAlign:'left',
      color: '#606060',
      fontSize: 14,
      marginLeft:20,
    },
    app_clear_content: {
      flex:5,
      textAlign:'right',
      color: '#ff7878',
      fontSize: 14,
      marginRight:20,
    },
    app_version: {
      marginTop: 30,
        color: '#989898',
        fontSize: 14,
        marginLeft:17,
    },
    app_content: {
      marginTop: 8,
        color: '#ccc',
        fontSize: 12,
        marginLeft:17,
    },
    button: {
        borderRadius:4,
        height:50,
        marginTop: 20,
        backgroundColor: '#ff9d9d',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft:10,
        marginRight:10,
        borderBottomColor: '#ff9191',
        borderBottomWidth: 1/PixelRatio.get(),
    },
});

module.exports = Settings;
