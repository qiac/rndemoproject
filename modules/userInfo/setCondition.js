/**
 * 添加用人需求
 */
'use strict';

import React, {
    StyleSheet,
    View,
    Text,
    Switch,
    TextInput,
    Component,
    ScrollView,
    PixelRatio,
    Platform,
    TouchableHighlight,
} from 'react-native';

import HttpUtils from '../common/http_util';
import Service from '../common/service';
import ToggleButton from '../common/toggleButton';
import {window, iconFontMaker, covertTime, GKAlert, loadView, renderLoadingView, onBackButtonClick } from '../common/gk_util';
const glypy = iconFontMaker({ ArrowLeft: 'e903', Store: 'e904', Location: 'e909', Plus: 'e907', ArrowRight: 'e912' });
const preferredTypes = [];
const url = Service.AdvancedListURL;

class ConditionSetComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded : false,
            postLoaded : false,
            working_weekday_list : null,
            working_start_time : null,
            working_end_time : null,
            min_working_time_weekly : null,
            working_time_unit_type : null,
            headcount : null,
            preferred_labor_type_list : null,
            tipText : '正在保存',
        };
        this.positionID  = this.props.source.positionID;
        this.advancedID  = this.props.source.advancedID;
    }

    /*
     * 获取用人需求详情
     */
    getAdvancedDetail(id){
        var _this = this;
        HttpUtils.get(Service.AdvancedListURL+id+'/',
            function(response) {
                console.log(response)
                if(response) {
                    _this.setState({
                        loaded : true,
                        working_weekday_list : response.working_weekday_list,
                        working_start_time : response.working_start_time,
                        working_end_time : response.working_end_time,
                        min_working_time_weekly : response.min_working_time_weekly.toString(),
                        working_time_unit_type : response.working_time_unit_type,
                        headcount : response.headcount.toString(),
                        preferred_labor_type_list : response.preferred_labor_type_text_list,
                    })
                }
            },
            function(error) {
                _this.setState({
                    loaded : false
                })
            },
            _this.props.navigator,
            function(){
                _this.props.logoutCallback();
            }

        );
    };

    componentDidMount(){
        //this.advancedID = 10;
        //this.positionID = 853;
        if(this.advancedID !== undefined && this.advancedID !== null) {
            this.getAdvancedDetail(this.advancedID)
        }else{
            this.setState({loaded : true})
        }
    }

    /**
     * 选择人员类型
     * **/
    onChooseMemberType(type,isSelected){
        if(isSelected){
            preferredTypes.push(type)
        }else{
            for(var i=0;i<preferredTypes.length;i++){
                if(preferredTypes[i] === type){
                    preferredTypes.splice(i,1);
                }
            }
        }
    };

    choseWeekDays(type,isSelected){
        console.log(type)
    }

    onChangeStartTime(event){
        this.setState({
            working_start_time : event.nativeEvent.text
        })
    };

    onChangeEndTime(event){
        this.setState({
            working_end_time : event.nativeEvent.text
        })
    };

    onChangeWorkingTime(event){
        this.setState({
            min_working_time_weekly : event.nativeEvent.text
        })
    };

    onChangeHeadCount(event){
        this.setState({
            headcount : event.nativeEvent.text
        })
    };

    /**
     * 保存用人需求
     * **/
    onSaveInfoClick(){
        var data = {
            position : this.positionID,
            working_weekday_list : [5,6],
            working_start_time : this.state.working_start_time,
            working_end_time : this.state.working_end_time,
            min_working_time_weekly : parseInt(this.state.min_working_time_weekly),
            working_time_unit_type : 0,
            headcount : parseInt(this.state.headcount),
            preferred_labor_type_list : preferredTypes,
        };
        var _this = this;

        console.log(data)
        _this.setState({postLoaded : true});

        if(_this.advancedID){ //更新用人需求
            HttpUtils.put(
                url+_this.advancedID+'/',
                data,
                function(data){
                    onBackButtonClick(_this.props.navigator);
                },
                function(error){
                    _this.setState({postLoaded : false});
                }
            )

        }else{ //新建用人需求
            HttpUtils.post(
                url,
                data,
                function(data){
                    onBackButtonClick(_this.props.navigator);
                },
                function(error){
                    _this.setState({postLoaded : false});
                }
            )
        }
    }

    /**
     * 删除用人需求
     * **/
    onDelInfoClick(){
        var _this = this;
        _this.setState({postLoaded : true,tipText : '正在删除'});
        HttpUtils.delete(
            url+this.advancedID+'/',
            function(){
                onBackButtonClick(_this.props.navigator);
            },
            function(){
                _this.setState({postLoaded : false});
            }
        )
    }

    render() {

        var props = {
                defaultStyle : styles.genderItem,
                defaultTextStyle : styles.genderItemText,
                selectedStyle : styles.genderItemHover,
                selectedTextStyle : styles.genderItemHoverText,
            },
            timeProps = {
                defaultStyle : styles.timeItem,
                defaultTextStyle : styles.timeItemText,
                selectedStyle : styles.timeItemHover,
                selectedTextStyle : styles.timeItemHoverText,
            };

        return (
            <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                {/* 头部 */}
                <View style={styles.header}>
                    {/* 返回按钮 */}
                    <TouchableHighlight style={{flex:1}} underlayColor='#00000000' onPress={()=>onBackButtonClick(this.props.navigator)}>
                        <Text style={{textAlign:'left', paddingLeft: 10, color: '#737373', fontSize: 20, fontFamily: 'gk-iconfonts'}}>{glypy.ArrowLeft}</Text>
                    </TouchableHighlight>

                    <Text style={{flex:3, color: '#000', fontSize: 17, textAlign:'center'}}>添加用人需求</Text>
                    <Text style={{flex :1}} />
                </View>

                <ScrollView>
                    <View style={styles.container}>
                        {/*用人时段*/}
                        <View style={styles.period}>

                            <Text style={styles.title}>用人时段</Text>
                            <View>
                                <View style={styles.flexCenter}>
                                    <Text style={styles.day}>周一</Text>
                                    <Text style={styles.day}>周二</Text>
                                    <Text style={styles.day}>周三</Text>
                                    <Text style={styles.day}>周四</Text>
                                    <Text style={styles.day}>周五</Text>
                                    <Text style={styles.day}>周六</Text>
                                    <Text style={styles.day}>周日</Text>
                                </View>
                                <View style={styles.flexCenter}>
                                    <ToggleButton {...timeProps} buttonText='' onChoseButton={(data)=>this.choseWeekDays(1,data)} />
                                    <ToggleButton {...timeProps} buttonText='' onChoseButton={(data)=>this.choseWeekDays(2,data)} />
                                    <ToggleButton {...timeProps} buttonText='' onChoseButton={(data)=>this.choseWeekDays(3,data)} />
                                    <ToggleButton {...timeProps} buttonText='' onChoseButton={(data)=>this.choseWeekDays(4,data)} />
                                    <ToggleButton {...timeProps} buttonText='' onChoseButton={(data)=>this.choseWeekDays(5,data)} />
                                    <ToggleButton {...timeProps} buttonText='' onChoseButton={(data)=>this.choseWeekDays(6,data)} />
                                    <ToggleButton {...timeProps} buttonText='' onChoseButton={(data)=>this.choseWeekDays(7,data)} />
                                </View>
                            </View>
                        </View>

                        <View style={styles.item}>
                            <TextInput style={[styles.input,styles.border,styles.flex]} value={this.state.working_start_time} onChange={this.onChangeStartTime.bind(this)} />
                            <Text style={styles.tipsLine}>-</Text>
                            <TextInput style={[styles.input,styles.border,styles.flex]} value={this.state.working_end_time} onChange={this.onChangeEndTime.bind(this)} />
                        </View>

                        {/*每周至少提供*/}
                        <View style={styles.item}>
                            <Text style={styles.label}>每周至少提供</Text>
                            <View style={styles.itemRight}>
                                <TextInput style={[styles.input,styles.inputWidth]} value={this.state.min_working_time_weekly} onChange={this.onChangeWorkingTime.bind(this)} />
                                <TextInput style={[styles.input,styles.inputWidth2]} placeholder="天" />
                                <Text style={styles.tipsLine2} />
                                <Text style={styles.tipsTriangle}>▼</Text>
                            </View>
                        </View>

                        {/*优选人员类型*/}
                        <View style={styles.item}>
                            <Text style={styles.label}>该岗位共需(人)</Text>
                            <TextInput style={[styles.input,styles.inputWidth]} value={this.state.headcount} onChange={this.onChangeHeadCount.bind(this)} />
                        </View>

                        {/*优选人员类型*/}
                        <View style={[styles.item,styles.itemNoBorder]}>
                            <Text style={styles.title}>优先人员类型</Text>
                            <View style={styles.itemRight}>
                                <ToggleButton {...props} buttonText='学生优先' onChoseButton={(data)=>this.onChooseMemberType(0,data)} />
                                <ToggleButton {...props} buttonText='退休人员优先' onChoseButton={(data)=>this.onChooseMemberType(1,data)} />
                            </View>
                        </View>

                    </View>
                </ScrollView>

                <View style={styles.buttons}>
                    <TouchableHighlight style={styles.button} underlayColor="#ddd" onPress={this.onSaveInfoClick.bind(this)} >
                        <Text style={[styles.buttonText]}>保存这条用人需求</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={[styles.button,styles.buttonDel]} underlayColor="#ddd" onPress={this.onDelInfoClick.bind(this)}>
                        <Text style={styles.buttonText}>删除这条用人需求</Text>
                    </TouchableHighlight>
                </View>

                {/* 岗位详情Loading框 */}
                {!this.state.loaded ?
                 <View style={styles.login_progress_parent}>
                     {renderLoadingView('正在加载')}
                 </View> : null}

                {/* post 数据提示 */}
                {this.state.postLoaded ?
                    <View style={styles.login_progress_parent}>
                        {renderLoadingView(this.state.tipText)}
                    </View> : null}

            </View>
        );
    }
}

var styles = StyleSheet.create({

    flex : {
      flex : 1
    },
    flexCenter : {
        flex : 1,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
    },
    container : {
        padding : 10,
        paddingBottom : 0,
        marginBottom : 20,
        backgroundColor : '#fff',
    },

    period : {
        height : 100,
    },
    setTimes : {
        flex : 1,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
    },
    item : {
        flex : 1,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        padding : 10,
        paddingTop : 20,
        paddingBottom : 20,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1/PixelRatio.get(),
    },
    itemNoBorder : {
        borderBottomWidth : 0,
    },
    itemRight : {
        flex : 1,
        flexDirection : 'row',
        justifyContent : 'flex-end',
        alignItems : 'center',
    },
    title : {
        marginBottom : 10,
        fontSize : 14,
    },
    label : {
        fontSize : 14,
    },
    inputWidth : {
        width : 102,
        marginRight : 10,
        borderRadius : 4,
    },
    inputWidth2 : {
        width : 30,
    },
    itemButton : {
        marginLeft : 20,
    },
    tipsLine : {
        height : 28,
        marginLeft : 10,
        marginRight : 10,
    },
    tipsTriangle : {
        width : 28,
        height : 28,
        lineHeight : 20,
        fontSize : 10,
        color : '#666',
        textAlign : 'center',
        backgroundColor : '#f3f3f3',
    },

    day : {
        flex : 1,
        height : 30,
        lineHeight : 20,
        borderColor: '#ccc',
        borderWidth: 1/PixelRatio.get(),
        textAlign : 'center',
        fontSize : 12,
        color : '#4f4f4f',
    },
    //时间样式
    timeItem : {
        flex : 1,
        height : 30,
        borderWidth : 1/PixelRatio.get(),
        borderColor : '#ccc',
    },
    timeItemText : {
        height : 29,
        paddingLeft : 10,
        paddingRight : 10,
        lineHeight : 20,
        textAlign:'center',
    },
    timeItemHover : {
        flex : 1,
        height : 30,
        borderWidth : 1/PixelRatio.get(),
        borderColor : '#ccc',
    },
    timeItemHoverText : {
        height : 29,
        paddingLeft : 10,
        paddingRight : 10,
        lineHeight : 20,
        textAlign : 'center',
        color : '#4f4f4f',
        backgroundColor : '#f8db1c'
    },

    //优选人员类型
    genderItem : {
        height : 30,
        marginLeft : 14,
        borderRadius : 4,
        borderWidth : 1/PixelRatio.get(),
        borderColor : '#ccc',
    },
    genderItemText : {
        height : 29,
        paddingLeft : 10,
        paddingRight : 10,
        lineHeight : 20,
        borderRadius : 4,
        textAlign:'center',
        color : '#4f4f4f',
    },
    genderItemHover : {
        height : 30,
        marginLeft : 14,
        borderRadius : 4,
        borderWidth : 1/PixelRatio.get(),
        borderColor : '#ccc',
    },
    genderItemHoverText : {
        height : 29,
        paddingLeft : 10,
        paddingRight : 10,
        lineHeight : 20,
        borderRadius : 4,
        textAlign : 'center',
        color : '#4f4f4f',
        backgroundColor : '#f8db1c'
    },

    //按钮集合
    buttons : {
        flex : 1,
        justifyContent : 'space-between',
        padding : 10,
        position : 'absolute',
        left : 0,
        right : 0,
        bottom : 0,
        backgroundColor : '#fff',
    },
    button : {
        height : 50,
        marginBottom : 10,
        backgroundColor : '#f8db1c',
        borderRadius : 4,
        justifyContent : 'center',
    },
    buttonDel : {
        borderWidth : 1/PixelRatio.get(),
        borderColor : '#ff9191',
        backgroundColor : '#ff9d9d',
    },
    buttonText : {
        fontSize : 16,
        alignSelf : 'center',
        color : 'white'
    },

    //通用
    input : {
        height : 28,
        padding : 5,
        fontSize : 14,
        color : '#000',
        backgroundColor : '#f3f3f3',
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

module.exports = ConditionSetComp;