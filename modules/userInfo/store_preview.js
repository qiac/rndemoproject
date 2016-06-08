/**
 * 设置页面
 */
'use strict';

import React, {
    StyleSheet,
    View,
    Text,
    Image,
    Component,
    PixelRatio,
    Platform,
    TouchableHighlight
} from 'react-native';

import ViewPager from '../../supports/react-native-viewpager/ViewPager';
import { iconFontMaker, window } from '../common/gk_util';
const glypy = iconFontMaker({ ArrowLeft: 'e903' });

var IMGS = [
  'https://images.unsplash.com/photo-1441742917377-57f78ee0e582?h=1024',
  'https://images.unsplash.com/photo-1441716844725-09cedc13a4e7?h=1024',
  'https://images.unsplash.com/photo-1441448770220-76743f9e6af6?h=1024',
  'https://images.unsplash.com/photo-1441260038675-7329ab4cc264?h=1024',
  'https://images.unsplash.com/photo-1441126270775-739547c8680c?h=1024',
  'https://images.unsplash.com/photo-1440964829947-ca3277bd37f8?h=1024',
  'https://images.unsplash.com/photo-1440847899694-90043f91c7f9?h=1024'
];

class ViewPagerText extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            totalcount:4,
        };

    }

    render() {

        return (
            <Text style={{position: 'absolute', right: 6, bottom: 6, fontSize: 18, color: '#FFF'}}>
                {this.state.currentPage} / {this.state.totalcount}
            </Text>
        );
    }
}

class StorePreview extends Component {
    constructor(props) {
        super(props);
        // console.log(this.props.source.store_thumbs);
        this.state = {
            totalcount:this.props.source.store_thumbs.push(),
            dataSource: new ViewPager.DataSource({
                pageHasChanged: (row1, row2) => row1 !== row2,
            }).cloneWithPages(this.props.source.store_thumbs),
        };
    }
    /*
     * 点击返回按钮
     */
    onBackButtonClick() {
        this.props.navigator.pop();
    }

    _renderPage(data: Object, pageID: number|string) {
        return (
            <Image
            source={{uri: data}}
            resizeMode='cover'
            style={styles.page} />
        );
    }

    _onChangePage(page: number|string) {
        var ViewPagerText = this.refs.viewpagertext;
        ViewPagerText.setState({currentPage: (page+1)});
        ViewPagerText.setState({totalcount: this.state.totalcount});
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

                    <Text style={{flex: 6, color: '#000', fontSize: 17, textAlign:'center'}}>预览</Text>

                    <View style={{flex: 1}} />
                </View>

                <View style={{flex: 1, backgroundColor: '#000'}}>
                    <ViewPager
                        style={{flex: 1}}
                        dataSource={this.state.dataSource}
                        renderPage={this._renderPage.bind(this)}
                        onChangePage={this._onChangePage.bind(this)}
                        isLoop={true}
                        autoPlay={true}/>
                    <ViewPagerText ref='viewpagertext' />
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
    page: {
        width: window.width,
        marginTop: 120,
        marginBottom: 120
    },
});

module.exports = StorePreview;
