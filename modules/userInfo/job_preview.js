/**
 * 设置页面
 */
'use strict';

import React, {
    StyleSheet,
    View,
    ListView,
    Text,
    Image,
    Component,
    PixelRatio,
    Platform,
    TouchableHighlight
} from 'react-native';

import HttpUtils from '../common/http_util';
import Service from '../common/service';

import { iconFontMaker, window } from '../common/gk_util';
const glypy = iconFontMaker({ ArrowLeft: 'e903' });

class JobPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
          dataSource : new ListView.DataSource({
              rowHasChanged:(r1,r2) => r1 !== r2
          }),
        };
        this.jobid = null;
    }
    /*
     * 点击返回按钮
     */
    onBackButtonClick() {
        this.props.navigator.pop();
    }




    getImglist(id) {
        var _this = this;
        HttpUtils.get(Service.HandlerListURL+id+'&count=10000',
            function(response) {
                if(response) {

                  _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(response.results),
                  });
                } else {
                    _this.setState({ loaded: true});
                }
            },
            function(error) {
                _this.setState({ loaded: false });
            },
            _this.props.navigator,
            function(){
                _this.props.logoutCallback();
            }

        );
    };
    componentDidMount() {
        this.jobid = this.props.source.store_id;
        console.log(this.jobid);
        this.getImglist(this.jobid);
    };

    renderWorkItem(imgs){
        return(
          <View style={styles.store_image}>
              <Image style={styles.image} source={{uri: imgs.url}}/>
          </View>
        )
    }

    /*
     * 点击设置按钮
     */
    onSettingButtonClick() {
        this.props.navigator.push({id: 'JobDetail'})
    }

    render() {
        return(
            <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                {/* 头部 */}
                <View style={styles.header}>
                    {/* 返回按钮 */}
                    <TouchableHighlight style={{flex:1}} underlayColor='#00000000' onPress={this.onBackButtonClick.bind(this)}>
                        <Text style={{textAlign:'left', marginLeft: 10, color: '#737373', fontSize: 20, fontFamily: 'gk-iconfonts'}}>{glypy.ArrowLeft}</Text>
                    </TouchableHighlight>

                    <Text style={{flex: 6, color: '#000', fontSize: 17, textAlign:'center'}}>我的</Text>

                    {/* 设置按钮 */}
                    <TouchableHighlight style={{flex:1}} underlayColor='#00000000' onPress={this.onSettingButtonClick.bind(this)}>
                        <Text style={{textAlign:'right', marginRight:10, color: '#737373', fontSize: 16, fontFamily: 'gk-iconfonts'}}>设置</Text>
                    </TouchableHighlight>

                </View>
                    <ListView dataSource={this.state.dataSource} renderRow={this.renderWorkItem.bind(this)} enableEmptySections={true} />
                      <View style={styles.bottom}>
                        <Image style={styles.logo} source={require('../../images/weixinlogo.png')} />
                        <Text style={{textAlign:'center', fontFamily: '.PingFangSC-Regular',fontSize: 16, color: '#ffffff',  marginLeft:8}}>一键分享至微信员工群</Text>
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
        backgroundColor : '#f8db1c',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1/PixelRatio.get(),
        paddingTop: Platform.OS === 'ios' ? 12 : 0,
    },
     logo: {
          width: 28,
          height: 28,
      },
    page: {
        width: window.width,
    },
    store_image: {
        flexDirection: 'row',
        width: window.width,

    },
    image: {

       width: window.width,
       height:500,
    },
    bottom: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor : '#2dd141',
        marginLeft:10,
        marginTop:10,
        marginRight:10,
        marginBottom:10,
    },
});

module.exports = JobPreview;
