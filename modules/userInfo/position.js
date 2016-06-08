/**
 * 设置岗位
 */
'use strict';

import React, {
    StyleSheet,
    View,
    Text,
    TextInput,
    Component,
    ScrollView,
    PixelRatio,
    Platform,
    TouchableHighlight,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
} from 'react-native';

import HttpUtils from '../common/http_util';
import Service from '../common/service';
import Global from '../common/gk_global';
import ConditionSet from './setCondition';
// Switch from 'react-native-material-switch';
import {window, iconFontMaker, covertTime, GKAlert, renderLoadingView, onBackButtonClick } from '../common/gk_util';
const glypy = iconFontMaker({ ArrowLeft: 'e903', Store: 'e904', Location: 'e909', Plus: 'e907', ArrowRight: 'e912' });

class positionSetComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            postLoaded : false,
            SettingLoaded : false,
            minSalary: null,
            maxSalary: null,
            urgent : false
        };
        //this.positionID = this.props.source.position_id;
        this.positionList = [];
    }

    /*
     * 获取岗位详情数据
     */
    getPositionInfo(id){
        var _this = this;
        console.log(Service.PositionListURL+id+'/')
        HttpUtils.get(Service.PositionListURL+id+'/',
            function(response) {
                console.log(response)
                if(response) {
                    _this.setState({
                        loaded: true,
                        minSalary: response.min_salary !== null ? response.min_salary.toString() : null,
                        maxSalary: response.max_salary !== null ? response.max_salary.toString() : null,
                        urgent : response.urgent,
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

    /*
     * 获取用人需求列表数据
     */
    getAdvancedList(id){
        var _this = this;
        console.log(Service.AdvancedListURL+'?position='+id+'&count=10000')
        HttpUtils.get(Service.AdvancedListURL+'?position='+id+'&count=10000',
            function(response) {
                console.log(response)
                if(response) {
                    var results = response.results, i = 0;
                    results.map(function(result){
                        i++;
                        _this.positionList.push(
                            <TouchableHighlight key={'position'+i} underlayColor="#ddd" onPress={()=>_this.onSetPosition(result.id)}>
                                <View  style={styles.setList} >
                                    <Text style={styles.setText}>{result.head_line}</Text>
                                    <Text style={styles.setTimes}>{result.body}</Text>
                                    <Text style={styles.setText}>{result.tail_line}</Text>
                                    <Text style={[styles.buttonIcon,styles.setTips]}>{glypy.ArrowRight}</Text>
                                </View>
                            </TouchableHighlight>
                        );
                    })
                    _this.setState({
                        SettingLoaded : true
                    })
                }
            },
            function(error) {
                _this.setState({
                    SettingLoaded : false
                })
            },
            _this.props.navigator,
            function(){
                _this.props.logoutCallback();
            }

        );
    };

    componentDidMount(){
        this.positionID = 853;
        //this.getPositionInfo(this.positionID);
        this.getAdvancedList(this.positionID)
    }

    /**
     * 预览海报
     * **/
    onPreviewButtonClick(){

    };

    /**
     * 导航到添加用人需求页面
     * **/
    onSetPosition(id){
        this.props.navigator.push({id: 'ConditionSet',passProps : {positionID : this.positionID, advancedID : id}});
    };

    //设置最小薪资
    onChangeMixSalary(event){
        this.setState({
            minSalary : event.nativeEvent.text
        })
    };
    //设置最大薪资
    onChangeMaxSalary(event){
        this.setState({
            maxSalary : event.nativeEvent.text
        })
    };

    //设置是否加急
    onChangeUrgent(stats){
        this.setState({
            urgent : stats
        })
    }

    /**
     * 保存岗位设置
     * **/
    onSavePosition(){
        var data = {
            urgent : this.state.urgent
        };
        if(this.state.minSalary)
            data['min_salary'] = this.state.minSalary;
        if(this.state.maxSalary)
            data['max_salary'] = this.state.maxSalary;

        console.log(data)
        console.log(Service.PositionListURL+this.positionID+'/')

        this.setState({
            postLoaded : true
        });

        HttpUtils.post(
            Service.PositionListURL+this.positionID+'/',
            data,
            function(data){
                console.log(data)
            },
            function(error){
                this.setState({
                    postLoaded : false
                })
            }
        )
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                {/* 头部 */}
                <View style={styles.header}>
                    {/* 返回按钮 */}
                    <TouchableHighlight style={{flex:1}} underlayColor='#00000000' onPress={()=>onBackButtonClick(this.props.navigator)}>
                        <Text style={{textAlign:'left', paddingLeft: 10, color: '#737373', fontSize: 20, fontFamily: 'gk-iconfonts'}}>{glypy.ArrowLeft}</Text>
                    </TouchableHighlight>

                    <Text style={{flex:3, color: '#000', fontSize: 17, textAlign:'center'}}>设置岗位</Text>

                    {/* 预览海报 */}
                    <TouchableHighlight style={{flex:1}} underlayColor='#00000000' onPress={this.onPreviewButtonClick.bind(this)}>
                        <Text style={{textAlign:'right', paddingRight: 10, color: '#737373', fontSize: 14}}>预览海报</Text>
                    </TouchableHighlight>
                </View>

                <ScrollView>

                    {/* 薪资 */}
                    <View style={styles.salary}>
                        <Text style={styles.title}>薪资</Text>
                        <View style={styles.pay}>
                            <TextInput style={[styles.input,styles.border,styles.textRight]} value={this.state.minSalary} onChange={this.onChangeMixSalary.bind(this)} />
                            <Text style={styles.tipsLine}>-</Text>
                            <TextInput style={[styles.input,styles.border,styles.textRight]} value={this.state.maxSalary} onChange={this.onChangeMaxSalary.bind(this)} />
                            <Text> 元/天</Text>
                        </View>
                    </View>

                    {/* 福利 */}
                    <View style={styles.item}>
                        <Text style={styles.title}>福利</Text>
                        <View style={styles.benefit}>
                            <TouchableHighlight style={styles.benefitButton} underlayColor='#00000000'>
                                <View>
                                    <Text style={[styles.buttonIcon,styles.benefitButtonIcon]}>{glypy.Store}</Text>
                                    <Text style={styles.benefitButtonText}>保障类</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.benefitButton} underlayColor='#00000000'>
                                <View>
                                    <Text style={[styles.buttonIcon,styles.benefitButtonIcon]}>{glypy.Location}</Text>
                                    <Text style={styles.benefitButtonText}>作息类</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.benefitButton} underlayColor='#00000000'>
                                <View>
                                    <Text style={[styles.buttonIcon,styles.benefitButtonIcon]}>{glypy.Plus}</Text>
                                    <Text style={styles.benefitButtonText}>补助类</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.benefitButton} underlayColor='#00000000'>
                                <View>
                                    <Text style={[styles.buttonIcon,styles.benefitButtonIcon]}>{glypy.Location}</Text>
                                    <Text style={styles.benefitButtonText}>奖励类</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.benefitButton} underlayColor='#00000000'>
                                <View>
                                    <Text style={[styles.buttonIcon,styles.benefitButtonIcon]}>{glypy.Plus}</Text>
                                    <Text style={styles.benefitButtonText}>发展类</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.benefitList}>
                            <View style={styles.benefitDetails}>
                                <Text style={styles.benefitItem}>包吃</Text>
                                <Text style={styles.benefitItem}>工作餐</Text>
                                <Text style={styles.benefitItem}>餐费补助</Text>
                            </View>
                            <View style={styles.benefitDetails}>
                                <Text style={styles.benefitItem}>全职补助</Text>
                                <Text style={styles.benefitItem}>节假日礼物</Text>
                                <Text style={styles.benefitItem}>周六免费餐饮</Text>
                            </View>
                        </View>
                    </View>

                    {/* 设置岗位 */}
                    <View style={styles.setLists}>

                        {this.state.SettingLoaded ? this.positionList : <Text style={styles.loading}>正在请求中...</Text>}

                        <TouchableHighlight underlayColor="#ddd" onPress={()=>this.onSetPosition()}>
                            <View style={styles.setButton}>
                                <Text style={[styles.buttonIcon,styles.setPlus]}>{glypy.Plus}</Text>
                                <Text style={styles.setButtonText}>添加用人需求</Text>
                            </View>
                        </TouchableHighlight>
                    </View>

                    {/* 是否加急 */}
                    <View style={styles.setUrgent}>
                        <Text style={styles.setTitle}>是否加急</Text>

                    </View>

                    <View style={styles.buttons}>
                        <TouchableHighlight style={styles.button} underlayColor="#ddd" onPress={this.onSavePosition.bind(this)}>
                            <Text style={[styles.buttonText,styles.textGrey]}>保存岗位设置</Text>
                        </TouchableHighlight>

                        <TouchableHighlight style={[styles.button,styles.buttonGreen]} underlayColor="#ddd">
                            <Text style={styles.buttonText}>一键分享到微信员工群</Text>
                        </TouchableHighlight>
                    </View>

                    {/* 岗位详情Loading框 */}
                    {/*{!this.state.loaded ?
                        <View style={styles.login_progress_parent}>
                            {renderLoadingView('正在加载')}
                        </View> : null}*/}

                    {/* post 数据提示 */}
                    {this.state.postLoaded ?
                        <View style={styles.login_progress_parent}>
                            {renderLoadingView('正在保存')}
                        </View> : null}

                </ScrollView>


            </View>
        );
    }
}

var styles = StyleSheet.create({

    item : {
        marginBottom : 10,
        paddingTop : 10,
        paddingBottom : 10,
        backgroundColor : '#fff',
    },
    title : {
        marginLeft : 10,
        fontSize : 16,
    },

    //薪资
    salary : {
        flex : 1,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        padding : 10,
        marginBottom : 10,
        backgroundColor : '#fff',
    },
    pay : {
        flex : 1,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        padding : 10,
    },
    tipsLine : {
        marginLeft : 4,
        marginRight : 4,
    },

    //福利
    benefit : {
        flex : 1,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        padding : 10,
    },
    benefitButton : {
        flex : 1,
    },
    benefitButtonText : {
        fontSize : 10,
        lineHeight : 14,
        color : '#666',
        textAlign : 'center',
    },
    benefitButtonIcon : {
        fontSize : 30,
    },
    benefitList : {
        padding : 10,
    },
    benefitDetails : {
        flex : 1,
        flexDirection : 'row',
        justifyContent : 'center',
    },
    benefitItem : {
        width : 81,
        height : 21,
        lineHeight : 16,
        marginTop : 10,
        marginLeft : 10,
        marginRight : 10,
        textAlign : 'center',
        fontSize : 12,
        color : '#666',
    },

    //设置岗位
    setLists : {
        margin : 10,
        marginTop : 0,
    },
    setList : {
        padding : 10,
        marginBottom : 10,
        backgroundColor : '#fff',
        borderRadius : 8,
        position : 'relative',
    },
    setTimes : {
        marginTop : 8,
        marginBottom : 8,
        fontSize : 30,
        color : '#666',
    },
    setText : {
        fontSize : 14,
        color : '#666',
    },
    setTips : {
        position : 'absolute',
        right : 10,
        top : 40,
    },
    setButton : {
        flex : 1,
        justifyContent : 'space-between',
        alignItems : 'center',
        padding : 10,
        borderWidth : 2/PixelRatio.get(),
        borderColor : '#666',
        borderStyle : 'dashed',
        borderRadius : 8,
    },
    setPlus : {
        marginTop : 10,
        fontSize : 36,
    },
    setButtonText : {
        lineHeight : 26,
        fontSize : 12,
        color : '#666',
    },

    //是否加急
    setUrgent : {
        flex : 1,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        padding : 10,
        marginBottom : 10,
        backgroundColor : '#fff',
    },
    setTitle : {
        fontSize : 16,
    },

    //按钮集合
    buttons : {
        padding : 10,
        marginBottom : 100,
        backgroundColor : '#fff',
    },
    button : {
        height : 50,
        backgroundColor : '#f8db1c',
        borderRadius : 4,
        justifyContent : 'center',
    },
    buttonGreen : {
        marginTop : 10,
        backgroundColor : '#2dd141',
    },
    buttonText : {
        fontSize : 16,
        alignSelf : 'center',
        color : 'white'
    },

    //通用
    input : {
        flex : 1,
        height : 28,
        padding : 5,
        fontSize : 14,
        color : '#000',
        backgroundColor : '#f3f3f3',
    },
    textCenter : {
        textAlign : 'center',
    },
    textRight : {
        textAlign : 'right',
    },
    border : {
        borderWidth : 1/PixelRatio.get(),
        borderColor : '#ccc',
        borderRadius : 4,
    },
    buttonIcon :{
        color: '#737373',
        fontSize: 20,
        fontFamily: 'gk-iconfonts',
        alignSelf : 'center',
    },

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
    //loading
    loading : {
        padding : 10,
        marginBottom : 10,
        color : '#4f4f4f',
        textAlign : 'center',
    },
    login_progress_parent: {
        position:'absolute',
        justifyContent:'center',
        alignItems:'center',
        width: window.width,
        top:window.height/2 - 60,
    },

});

module.exports = positionSetComp;
