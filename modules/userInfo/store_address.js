/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  PixelRatio,
  Platform,
  WebView
} from 'react-native';

var WEBVIEW_REF = 'webview';
var BGWASH = 'rgba(255,255,255,0.8)';

var address_url = 'http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:39.96554,116.26719;title:成都;addr:北京市海淀区复兴路32号院|coord:39.87803,116.19025;title:成都园;addr:北京市丰台区射击场路15号北京园博园|coord:39.88129,116.27062;title:老成都;addr:北京市丰台区岳各庄梅市口路西府景园六号楼底商|coord:39.9982,116.19015;title:北京园博园成都园;addr:北京市丰台区园博园内&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp';
var address_url2 = 'http://apis.map.qq.com/tools/poimarker?type=1&keyword=酒店&center=39.908491,116.374328&radius=1000&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp';

import { iconFontMaker } from '../common/gk_util';
const glypy = iconFontMaker({ ArrowLeft: 'e903'});

class StoreAddress extends Component {
  onBackButtonClick() {
    this.props.navigator.pop();
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

              <Text style={{flex: 6, color: '#000', fontSize: 17, textAlign:'center'}}>捷库南京</Text>
              <View style={{flex: 1}} />
          </View>

          <WebView
              ref={WEBVIEW_REF}
              automaticallyAdjustContentInsets={false}
              style={{backgroundColor: BGWASH}}
              source={{uri: address_url2}}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              decelerationRate="normal"
              onNavigationStateChange={this.onNavigationStateChange}
              onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
              startInLoadingState={true}
              scalesPageToFit={true}
            />
      </View>
    );
  }

  onShouldStartLoadWithRequest(event) {
    // Implement any custom loading logic here, don't forget to return!
    return true;
  }

  onNavigationStateChange(navState) {
    // this.setState({
    //   backButtonEnabled: navState.canGoBack,
    //   forwardButtonEnabled: navState.canGoForward,
    //   url: navState.url,
    //   status: navState.title,
    //   loading: navState.loading,
    //   scalesPageToFit: true
    // });
  }
}

const styles = StyleSheet.create({
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
});

module.exports = StoreAddress;
