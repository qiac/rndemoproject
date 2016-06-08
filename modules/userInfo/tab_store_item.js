'use strict';

import React, {
  Component,
  Image,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
  Platform,
  Text,
  View,
} from 'react-native';


import { iconFontMaker } from '../common/gk_util';
const glypy = iconFontMaker({ ArrowLeft: 'e903', Eye: 'e90c' ,Setting: 'e905', ArrowRight: 'e912', Store: 'e904', Person: 'e908' ,Share: 'e90a', Report: 'e90b'});
class StoreListItem extends Component {

    /*
     * 点击申请详情按钮
     */
    onApplyInfoButtonClick() {

    }

    /*
     * 点击门店详情按钮
     */
    onStoreInfoButtonClick() {
      this.props.navigator.push({id: 'StoreDetail', passProps: {...this.props}});
    }

    render() {
        let storeThumb = null, storeName = null, storeApplyCount = 0;

        // 门店缩略图
        if(!this.props.store_thumb) {
            storeThumb = require('../../images/store_default.png');
        } else {
            storeThumb = {uri: this.props.store_thumb};
        }

        // 门店名称
        if(!this.props.store_name) {
            storeName = '';
        } else {
            storeName = this.props.store_name;
        }

        // 门店申请数量
        if(!this.props.store_apply_count) {
            storeApplyCount = this.props.store_apply_count;
        }

        return (
            <View style={styles.container}>
                {/* 门店图片和名称视图 */}
                <View >
                    <Image style={styles.thumb} resizeMode='cover' source={storeThumb} />

                    <View style={styles.text_parent}>
                        <Text style={{color: 'white', fontSize: 15, top: 12, left: 2}}>{storeName}</Text>
                    </View>
                </View>

                <View style={{flexDirection:'row'}}>
                    {/* 按钮1 */}
                    <TouchableHighlight style={{flex:1}} underlayColor='#eee' activeOpacity={0.8} onPress={this.onStoreInfoButtonClick.bind(this)}>
                        <View style={styles.bottom_btn}>
                            <Text style={{color: '#737373', fontSize: 20, fontFamily: 'gk-iconfonts'}}> {glypy.Eye} </Text>
                            <Text style={{color: '#737373'}}>装修门店</Text>
                        </View>
                    </TouchableHighlight>

                    {/* 分割线 */}
                    <View style={{width:1/PixelRatio.get(), height: 60, backgroundColor:'#ccc', alignSelf:'center'}}></View>

                    {/* 按钮2 */}
                    <TouchableHighlight style={{flex:1}} underlayColor='#eee' activeOpacity={0.8} onPress={this.onApplyInfoButtonClick.bind(this)}>
                        <View style={styles.bottom_btn}>
                            <Text style={{color: '#737373', fontSize: 20, fontFamily: 'gk-iconfonts'}}> {glypy.Report} </Text>
                            <Text style={{color: '#737373'}}>招聘报告</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex:1,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 3,
        borderWidth: 1/PixelRatio.get(),
        borderColor: '#CCC',
    },
    thumb: {
        overflow: 'hidden',
        width: iconFontMaker.width - 20 - 2/PixelRatio.get(),
        height: 50,
        borderRadius: 3
    },
    text_parent: {
        position: 'absolute',
        bottom: 0,
        width: iconFontMaker.width - 20 - 2/PixelRatio.get(),
        height: 50,
        backgroundColor: 'rgba(0,0,0,.5)'
    },
    bottom_btn: {
        height:60,
        justifyContent:'center',
        alignItems:'center'
    }
})

module.exports = StoreListItem;
