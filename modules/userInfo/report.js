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

class Report extends Component {
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

    render() {
        return(
            <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                 {/* 头部 */}
                 <View style={styles.header}>
                     {/* 返回按钮 */}
                     <TouchableHighlight style={{flex:1}} underlayColor='#00000000' onPress={this.onBackButtonClick.bind(this)}>
                         <Text style={{textAlign:'left', paddingLeft: 10, color: '#737373', fontSize: 20, fontFamily: 'gk-iconfonts'}}>{glypy.ArrowLeft}</Text>
                     </TouchableHighlight>
                     <Text style={{flex: 6, color: '#000', fontSize: 17, textAlign:'center'}}>招聘报告</Text>
                     <View style={{flex: 1}} />
                 </View>
                 {/* 我的分享 */}
                 <View style={{marginTop: 10, borderBottomColor: '#ccc', borderBottomWidth: 1/PixelRatio.get()}}>
                     <Text style={styles.app_version}>我的分享：30次</Text>
                 </View>

                 {/* 版本号 */}
                 <View style={{marginTop: 10, borderBottomColor: '#ccc', borderBottomWidth: 1/PixelRatio.get()}}>
                     <Text style={styles.app_version}>他人转发：30次</Text>
                 </View>
                 {/* 版本号 */}
                 <View style={{marginTop: 10, borderBottomColor: '#ccc', borderBottomWidth: 1/PixelRatio.get()}}>
                     <Text style={styles.app_version}>浏览次数：30次</Text>
                 </View>
                 {/* 版本号 */}
                 <View style={{marginTop: 10, borderBottomColor: '#ccc', borderBottomWidth: 1/PixelRatio.get()}}>
                     <Text style={styles.app_version}>收到申请：30次</Text>
                 </View>

                 {/* 版本号 */}
                 <View style={{marginTop: 10, borderBottomColor: '#ccc', borderBottomWidth: 1/PixelRatio.get()}}>
                     <Text style={styles.app_version}>成功应聘：3人</Text>
                 </View>

                 {/* 版本号 */}
                 <View style={{marginTop: 10, borderBottomColor: '#ccc', borderBottomWidth: 1/PixelRatio.get()}}>
                     <Text style={styles.app_version}>员工伯乐奖：2人</Text>
                 </View>
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
        backgroundColor : '#f7f7f7',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1/PixelRatio.get(),
        paddingTop: Platform.OS === 'ios' ? 12 : 0,
    },
    logo: {
        width: 70,
        height: 70,
        borderRadius: 3
    },
    app_name: {
        marginLeft: 20,
        marginBottom: 10,
        alignSelf: 'flex-end',
        color: '#555',
        fontSize: 22,
        fontWeight: 'bold',
    },
    app_version: {
        backgroundColor: 'white',
        padding: 12,
        color: '#222',
        fontSize: 18
    },
    button: {
        marginTop: 20,
        backgroundColor: 'white',
        padding: 12,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1/PixelRatio.get(),
    },
});

module.exports = Report;
