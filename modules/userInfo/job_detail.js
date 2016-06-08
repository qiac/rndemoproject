/**
 * 门店详情
 */
'use strict';

import React, {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    Component,
    ScrollView,
    PixelRatio,
    Platform,
    TouchableHighlight,
} from 'react-native';

import { iconFontMaker, GKAlert } from '../common/gk_util';
const glypy = iconFontMaker({ ArrowLeft: 'e903', Store: 'e904', Location: 'e909', Plus: 'e907', ArrowRight: 'e912' });

class JobDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
          real_name: '',
        };
    }
    /*
     * 返回按钮
     */
    onBackButtonClick() {
        this.props.navigator.pop();
    }
    /*
     * 预览按钮
     */
    onPreviewButtonClick() {
        // this.props.navigator.push({id: 'StorePreview', passProps: {...this.props}})
    }
     /*
     * 地址按钮
     */
    onAddressButtonClick() {
        this.props.navigator.push({id: 'StoreAddress'})
    }
    /*
     * 添加照片
     */
    onPlusImageClick() {

    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                {/* 头部 */}
                <View style={styles.header}>
                    {/* 返回按钮 */}
                    <TouchableHighlight style={{flex:1}} underlayColor='#00000000' onPress={this.onBackButtonClick.bind(this)}>
                        <Text style={{textAlign:'left', paddingLeft: 10, color: '#737373', fontSize: 20, fontFamily: 'gk-iconfonts'}}>{glypy.ArrowLeft}</Text>
                    </TouchableHighlight>

                    <Text style={{flex: 6, color: '#000', fontSize: 17, textAlign:'center'}}>门店信息</Text>

                    <TouchableHighlight style={{flex:1}} underlayColor='#00000000' onPress={this.onPreviewButtonClick.bind(this)}>
                        <Text style={{textAlign:'right', paddingRight: 10, color: '#737373', fontSize: 15}}>预览</Text>
                    </TouchableHighlight>
                </View>

                <ScrollView>
                    {/* 门店照片 */}
                    <View style={styles.store}>
                        <Text style={{color: '#101010', paddingTop: 10, fontSize: 17, marginLeft: 14}}>门店照片</Text>
                        <Text style={{color: '#ccc', fontSize: 14, marginLeft: 14, marginTop: 5, marginBottom: 5}}>
                            首张照片会默认作为您的门店封面图哦
                        </Text>
                        <View style={{marginLeft: 14, marginBottom: 10, backgroundColor: '#ccc', height: 1/PixelRatio.get()}}></View>

                        <View style={styles.store_image}>
                            <Image style={styles.image} source={require('../../images/store_default.png')}/>
                            <TextInput style={styles.input} underlineColorAndroid='transparent'
                                placeholder='请给这张图片加点说明文字吧' placeholderTextColor='#aaa' multiline={true} />
                        </View>
                        <View style={styles.store_image}>
                            <Image style={styles.image} source={require('../../images/store_default.png')}/>
                            <TextInput style={styles.input} underlineColorAndroid='transparent'
                                placeholder='请给这张图片加点说明文字吧' placeholderTextColor='#aaa' multiline={true} />
                        </View>

                        <TouchableHighlight style={styles.plus} underlayColor='#eee' onPress={this.onPlusImageClick.bind(this)}>
                            <Text style={{color: '#ccc', fontSize: 30, fontFamily: 'gk-iconfonts'}}>{glypy.Plus}</Text>
                        </TouchableHighlight>
                    </View>
                    {/* 店名 */}
                    <View style={styles.store}>
                        <View style={styles.store_title}>
                            <Text style={{color: '#101010', fontSize: 20, fontFamily: 'gk-iconfonts'}}>{glypy.Store}</Text>
                            <Text style={{flex: 1, color: '#101010', fontSize: 17, marginLeft: 6}}>店名</Text>
                        </View>
                        <View style={styles.store_info}>
                            <Text style={{color: '#101010', fontSize: 15}}>捷库南京</Text>
                        </View>
                    </View>

                    {/* 地址 */}
                    <View style={styles.store}>
                        <View style={styles.store_title}>
                            <Text style={{color: '#101010', fontSize: 20, fontFamily: 'gk-iconfonts'}}>{glypy.Location}</Text>
                            <Text style={{flex: 1, color: '#101010', fontSize: 17, marginLeft: 6}}>地址</Text>
                        </View>

                        <TouchableHighlight style={{flex:1}} underlayColor='#eee' onPress={this.onAddressButtonClick.bind(this)}>
                            <View style={styles.store_info}>
                                <Text style={{flex: 1, color: '#101010', fontSize: 15}}>南京市雨花台区软件大道德讯科技5楼捷库动力信息技术有限公司</Text>
                                <Text style={{color: '#737373', paddingRight: 8, fontSize: 14, fontFamily: 'gk-iconfonts'}}>{glypy.ArrowRight}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </View>
        );
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
    store: {
        marginTop: 10,
        backgroundColor: 'white',
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#ccc',
    },
    store_title: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
    store_info: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 34,
        paddingTop: 10,
        paddingBottom: 10,
        borderTopWidth: 1/PixelRatio.get(),
        borderTopColor: '#ccc',
    },
    job_setting: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        borderTopColor: '#ccc',
        borderTopWidth: 1/PixelRatio.get(),
        marginLeft: 16,
    },
    store_image: {
        flexDirection: 'row',
        paddingLeft: 14,
        paddingRight: 14,
        paddingBottom: 14,
    },
    image: {
        height: 80,
        width: 80,
        borderRadius: 4
    },
    input: {
        flex: 1,
        height: 80,
        marginLeft: 10,
        padding: 4,
        borderRadius: 4,
        backgroundColor: '#eee',
    },
    plus: {
        height: 80,
        width: 80,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 14,
        marginBottom: 14,
        borderColor: '#ccc',
        borderWidth: 1/PixelRatio.get(),
    },
});

module.exports = JobDetail;
