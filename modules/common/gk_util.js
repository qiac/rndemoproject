import React, {
  View,
  Text,
  Dimensions,
  Alert,
  AlertIOS,
  Platform,
  ActivityIndicatorIOS,
  ProgressBarAndroid
} from 'react-native';

const windowInfo = Dimensions.get('window');
const androidMagicNumber = 24;

/*
 * 获取iOS和Android屏幕宽高通用方法
 */
const window = {
  width: windowInfo.width,
  height: Platform.OS === 'ios'? windowInfo.height : windowInfo.height - androidMagicNumber
};

/*
 * ttf格式图标字体转换器
 */
const iconFontMaker = (glypy) => Object.keys(glypy)
  .map((key) => {
    return { key, value: String.fromCharCode(parseInt(glypy[key], 16)) };
  })
  .reduce((map, glypy) => {
    map[glypy.key] = glypy.value
    return map;
  }, {});

/*
 * 功能:
 * 1)去除字符串前后所有空格
 * 2)去除字符串中所有空格(包括中间空格,需要设置第2个参数为:g) 
 */
const trim = (str, is_global) => {
  if(str === 'undefined' || str === '' || str === null) {
    return '';
  }
  var result = str.replace(/(^\s+)|(\s+$)/g, "");
  if(is_global.toLowerCase() == "g") {
    result = result.replace(/\s/g, "");
  }      
  return result;
};

const convertNull = (str) => {
  return str === null ? '' : str;
};

/*
 * 日期转化
 * covertDay : 2016-3-20 13:00:00 => 2016-3-20
 * covertFullDay : 2016/3/20 => 2016年3月20日 */

const covertTime = {
    covertDay(time){
        if(time !== null && time !== undefined){
            return time.split(' ')[0];
        }else{
            return '';
        }
    },

    covertFullDay(time){

        if(time !== null && time !== undefined){
            var date = time.split('/');
            return date[0]+'年'+parseInt(date[1])+'月'+parseInt(date[1])+'日 ';
        }else{
            return '';
        }
    }
};

/*
 * 对话框
 */
const GKAlert = Platform.OS === 'ios' ? AlertIOS : Alert;

/*
 * 数据请求中Loading
*/
const loadView = () => {
  if (Platform.OS === 'ios') {
    return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <ActivityIndicatorIOS size="large" />
          <Text style={{color: '#555', marginTop: 10}}>正在加载...</Text>
        </View>
    );
  } else {
    return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <ProgressBarAndroid styleAttr="Inverse" color="#cccccc"/>
          <Text style={{color: '#555', marginTop: 2}}>正在加载...</Text>
        </View>
    );
  }
};

const onBackButtonClick = (navigator)=> {
  navigator.pop();
}







export {
  window,
  iconFontMaker,
  trim,
  covertTime,
  GKAlert,
  convertNull,
  loadView,
  onBackButtonClick,
};
