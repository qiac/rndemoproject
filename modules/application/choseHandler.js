/**
 * 选择推荐人
 */
'use strict';

import React, {
    Component,
    StyleSheet,
    PixelRatio,
    ListView,
    Platform,
    TouchableHighlight,
    View,
    Text,
} from 'react-native';

import AScrollView from 'react-native-yyscrollview';
import HttpUtils from '../common/http_util';
import Service from '../common/service';
import { iconFontMaker, GKAlert, loadView, onBackButtonClick } from '../common/gk_util';

class ChoseHandlerComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded : false,
            keyword : '',
            dataSource : new ListView.DataSource({
                rowHasChanged:(r1,r2) => r1 !== r2
            })
        };
        this.listData = this.props.source;
        this.navigator = this.props.navigator;
    }

    /*
     * 获取应聘者数据
     */
    getHandlerList(id) {
        var _this = this;
        HttpUtils.get(Service.HandlerListURL+'?application='+id+'&count=100000',
            function(response) {
                if(response) {
                    _this.setState({
                        loaded: true,
                        dataSource: _this.state.dataSource.cloneWithRows(response.detail),
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
        const application = this.listData.id;
        //const application = 79099;
        this.getHandlerList(application);
    };

    /*
     点击推荐给所选门店
     */
    onDistributeHandler(result){
        const application =  this.listData.id,
              realName = this.listData.candidate.real_name;
        GKAlert.alert(
            '提醒',
            realName+'即将被推荐到'+result.store_name+',成功后您将无法再次查看其个人信息.',
            [
                {text: '取消'},
                {
                    text: '确定',
                    onPress: function(){
                        const data = {
                            'application' : application,
                            'action' : 9,
                            'to' : result.user_id,
                            'target_store_id' : result.store_id
                        };
                        HttpUtils.post(
                            Service.OperateURL,
                            data,
                            function(){
                                GKAlert.alert(
                                    '提醒',
                                    realName+'已被推荐到'+result.store_name,
                                    {
                                        text: '确定',
                                        onPress : function(){
                                            //成功推荐后返回到列表
                                            this.props.onCancelPress();
                                            onBackButtonClick(this.navigator);
                                        }}
                                );
                            },
                            function(){
                                GKAlert.alert(
                                    '提醒',
                                    '推荐失败,请稍后再试!',
                                    {text: '确定'}
                                );
                            }
                        )
                    }
                }
            ]
        );
    };

    /*
     推荐人列表项
     */
    renderItem(result){
        return(
            <TouchableHighlight underlayColor="#ddd"  onPress={()=>this.onDistributeHandler(result)}>
                <View style={[styles.item,styles.borderBottom]}>
                    <Text>{result.store_name}</Text>
                    <View style={styles.name}><Text>{result.user_real_name}</Text></View>
                </View>
            </TouchableHighlight>
        )
    };

    render(){
        return(
            <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                {/* 头部 */}
                <View style={styles.header}>
                    <View style={{flex: 1}}/>
                    <Text style={{flex: 6, color: '#000', fontSize: 17, textAlign:'center'}}>选择推荐人</Text>

                    <TouchableHighlight style={{flex:1}} underlayColor='#00000000' onPress={this.props.onCancelPress}>
                        <Text style={styles.cancel}>取消</Text>
                    </TouchableHighlight>
                </View>

                {this.state.loaded ?
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderItem.bind(this)}
                    /> : loadView()
                }

            </View>
        )
    };
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
    },
    cancel: {
        fontSize: 16,
        color: '#439dff',
        textAlign: 'right',
        paddingRight: 10,
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1/PixelRatio.get(),
        padding:10,
    },
    name : {
        flex : 1,
        alignItems: 'flex-end',
    }
})

module.exports = ChoseHandlerComp;