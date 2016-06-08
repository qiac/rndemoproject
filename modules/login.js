/*
 * 登录页面
 */
'use strict';

import React, {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableHighlight,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    Component,
    Platform,
    AsyncStorage
} from 'react-native';

var RNCorrespond = require('react-native').NativeModules.RNCorrespond;

import { window, trim, GKAlert, convertNull } from './common/gk_util';
import HttpUtils from './common/http_util';
import BlowFish from './blowfish';
import MainComp from './main';
import Service from './common/service';

class LoginComp extends Component{
    constructor(props){
        super(props);
        this.state = {
            account : '',
            password : '',
            domain : '',
            showLoginProgress : false
        }
    }
    /*
     * 等待进度条
     */
    renderLoadingView() {
        if (Platform.OS === 'ios') {
          return (
            <View style={styles.login_progress}>
              <ActivityIndicatorIOS size="large" color='#FFF'/>
              <Text style={{fontSize: 16, color: '#FFF', marginTop: 10}}>正在登录...</Text>
            </View>
          );
        } else {
          return (
            <View style={styles.login_progress}>
              <ProgressBarAndroid styleAttr="Inverse" color="#FFF"/>
              <Text style={{fontSize: 16, color: '#FFF', marginTop: 2}}>正在登录...</Text>
            </View>
          ); 
        }
    }
    /*
     * 获取账号
     */
    _getAccount(value) {
        this.setState({
            account : value
        });
    }
    /*
     * 获取密码
     */
    _getPassword(value) {
        this.setState({
            password : value
        });
    }
    /*
     * 获取域名
     */
    _getDomain(value) {
        this.setState({
            domain : value
        });
    }
    /*
     * 处理登录逻辑
     */
    onLoginClick() {
        var ENCRYPT_MAGIC_CODE = 'gikoo@2013',
            account = trim(this.state.account,''),
            password = BlowFish(this.state.account + ENCRYPT_MAGIC_CODE, this.state.password),
            domain = trim(this.state.domain,'g');

        if(!account || !password || !domain) {
            GKAlert.alert(
                '提醒',
                '请输入登录信息',
                [{text: '好的'}]
            );
            return;
        }

        this.setState({
            showLoginProgress : true
        });

        // 登录服务器
        var _this = this;
        HttpUtils.login(Service.LOGIN_URL,
            {
                username: account,
                password: password,
                domain : domain,
                platform : 'mlp'
            },
            // 登录成功
            function(response) {
                // token
                var token = response.token;
                // RNCorrespond.openIMChat(token);
                // account name
                var account_name = response.account_name;
                // real name
                var real_name = response.real_name;
                // role name
                var role_name = response.role_name;
                // icon
                var icon = response.icon;

                if(!token) {
                    // 关闭进度条等待框
                    _this.setState({ showLoginProgress: false });
                    GKAlert.alert(
                        '提醒',
                        '登录失败，请检查登录信息后重试！',
                        [{text: '好的'}]
                    );
                    return;
                }
                /**Android环信IM回调,Ios暂未有此方法**/
                //RNCorrespond.loginSuccess(token, icon);

                // 关闭进度条等待框
                _this.setState({ showLoginProgress: false });

                // 进入主界面
                AsyncStorage.multiSet(
                    [['token', convertNull(token)],
                    ['account_name', convertNull(account_name)],
                    ['real_name', convertNull(real_name)],
                    ['role_name', convertNull(role_name)],
                    ['icon', convertNull(icon)]],

                    (err) => {
                        if (!err) {
                            _this.props.loginCallback(token);
                        }
                    }
                );
            },
            // 登录失败
            function(error) {
                // 关闭进度条等待框
                _this.setState({ showLoginProgress : false });
                GKAlert.alert(
                    '提醒',
                    '登录失败，请检查登录信息后重试！',
                    [{text: '好的'}]
                );
            }
        );
    };

    render() {
        return(
            <View style={styles.container}>
                <View style={{flex : 3}}>
                    <Image style={styles.logo} source={require('../images/login_logo.png')} />
                </View>
                <View style={styles.loginModule}>
                    {/* 账号 */}
                    <TextInput style={styles.inputText} autoCapitalize="none" clearButtonMode="while-editing" placeholder="账号" onChangeText={this._getAccount.bind(this)} />
                    
                    {/* 密码 */}
                    <TextInput style={[styles.inputText, {marginTop:10}]} autoCapitalize="none" clearButtonMode="while-editing" placeholder="密码" password={true} onChangeText={this._getPassword.bind(this)} />
                    
                    {/* 域名 */}
                    <TextInput style={[styles.inputText, {marginTop:10}]} autoCapitalize="none" clearButtonMode="while-editing" placeholder="企业代码"  onChangeText={this._getDomain.bind(this)} />
                    
                    {/* 登录按钮 */}
                    <TouchableHighlight style={styles.login_btn} underlayColor='rgba(0,113,255,.8)' onPress={this.onLoginClick.bind(this)}>
                        <Text style={styles.login_btn_text}>登入</Text>
                    </TouchableHighlight>
                </View>

                {/* 登录进度等待框 */}
                {this.state.showLoginProgress ? 
                    <View style={styles.login_progress_parent}>
                        {this.renderLoadingView()}
                    </View> : null}
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex : 1,
        backgroundColor : '#f8db1c'
    },
    logo: {
        width: 320,
        height : 240,
        overflow: 'hidden',
        marginTop : 50,
        alignSelf: 'center',
    },
    loginModule : {
        flex : 2,
        paddingBottom : 50,
    },
    inputText: {
        height : 40,
        backgroundColor : 'white',
        marginLeft : 20,
        marginRight : 20,
        paddingLeft : 10,
        borderRadius: 3
    },
    login_btn: {
        height: 45,
        backgroundColor : '#007aff',
        justifyContent : 'center',
        marginTop : 20,
        marginLeft : 50,
        marginRight : 50,
        borderRadius : 4
    },
    login_btn_text: {
        fontSize : 20,
        justifyContent : 'center',
        alignSelf : 'center',
        color : 'white'
    },
    login_progress: {
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'rgba(0,0,0,.8)',
        borderRadius: 5,
        padding:18,
    },
    login_progress_parent: {
        position:'absolute',
        justifyContent:'center',
        alignItems:'center',
        width: window.width,
        top:window.height/2 - 60,
    }
})

module.exports = LoginComp;