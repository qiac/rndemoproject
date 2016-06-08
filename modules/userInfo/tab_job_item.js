'use strict';

import React, {
  Component,
  Image,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
  Text,
  View,
} from 'react-native';

import { window } from '../common/gk_util';
import { iconFontMaker } from '../common/gk_util';

const glypy = iconFontMaker({ ArrowLeft: 'e903', Setting: 'e905', ArrowRight: 'e912', Store: 'e904', Person: 'e908' ,Share: 'e90a', Report: 'e90b'});
class JobListItem extends Component {
    /*
     * 点击暂停岗位按钮
     */
    onSetStateButtonClick() {

    }

    /*
     * 点击分享海报按钮
     */
    onShareButtonClick() {
      this.props.navigator.push({id: 'JobPreview', passProps: {store_id:this.props.store_id}});
    }

    /*
     * 点击设置海报按钮
     */
    onReportButtonClick() {
      this.props.navigator.push({id: 'JobDetail'});
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
                <View>
                    <Image style={styles.thumb} resizeMode='cover' source={storeThumb} />

                    <View style={styles.text_parent}>
                        <Text style={{color: 'white', fontSize: 15, top: 12, left: 2}}>{storeName}</Text>
                    </View>
                </View>

                {/* 底部三个按钮视图 */}
                <View style={{flexDirection:'row'}}>
                    {/* 按钮1 */}
                    <TouchableHighlight style={{flex:1}} underlayColor='#eee' activeOpacity={0.8} onPress={this.onShareButtonClick.bind(this)}>
                        <View style={styles.bottom_btn}>
                        <Text style={{color: '#737373', fontSize: 20, fontFamily: 'gk-iconfonts'}}> {glypy.Share} </Text>
                        <Text style={{color: '#737373', marginTop: 2}}>分享海报</Text>
                        </View>
                    </TouchableHighlight>

                    {/* 分割线 */}
                    <View style={{width:1/PixelRatio.get(), height: 60, backgroundColor:'#ccc', alignSelf:'center'}}></View>

                    {/* 按钮2 */}
                    <TouchableHighlight style={{flex:1}} underlayColor='#eee' activeOpacity={0.8} onPress={this.onReportButtonClick.bind(this)}>
                        <View style={styles.bottom_btn}>
                            <Text style={{color: '#737373', fontSize: 20, fontFamily: 'gk-iconfonts'}}> {glypy.Setting} </Text>
                            <Text style={{color: '#737373', marginTop: 4}}>设置海报</Text>
                        </View>
                    </TouchableHighlight>

                    {/* 分割线 */}
                    <View style={{width:1/PixelRatio.get(), height: 60, backgroundColor:'#ccc', alignSelf:'center'}}></View>

                    {/* 按钮3 */}
                    <TouchableHighlight style={{flex:1}} underlayColor='#eee' activeOpacity={0.8} onPress={this.onSetStateButtonClick.bind(this)}>
                        <View style={styles.bottom_btn}>
                            <Image style={{width:18,height:18}} source={require('../../images/stop.png')} />
                            <Text style={{color: '#737373', marginTop: 4}}>暂停岗位</Text>
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
        width: window.width - 20 - 2/PixelRatio.get(),
        height: 50,
        borderRadius: 3
    },
    text_parent: {
        position: 'absolute',
        bottom: 0,
        width: window.width - 20 - 2/PixelRatio.get(),
        height: 50,
        backgroundColor: 'rgba(0,0,0,.5)'
    },
    bottom_btn: {
        height:60,
        justifyContent:'center',
        alignItems:'center'
    }
})

module.exports = JobListItem;
