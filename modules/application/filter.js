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
    TextInput,
    ScrollView,
} from 'react-native';

import HttpUtils from '../common/http_util';
import Service from '../common/service';
import ToggleButton from '../common/toggleButton';
import { iconFontMaker, GKAlert, loadView, onBackButtonClick } from '../common/gk_util';
const glypy = iconFontMaker({ ArrowLeft: 'e903', Setting: 'e905', ArrowRight: 'e912', Store: 'e904', Person: 'e908' });
const positionIds = [];

class FilterApplicationComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded : false,
            gender : null,
            education : null,
            isGenderSelected : false,
            minAge : null,
            maxAge : null,
            isEducationVisible : false,
            isPositionVisible : false,
            positionIds : null,
            dataSource : new ListView.DataSource({
                rowHasChanged:(r1,r2) => r1 !== r2
            })
        };
        this.position = [];
        this.navigator = this.props.navigator;
    }
    
    /*
     * 获取岗位列表数据
     */
    getPositionList() {
        var _this = this,
            menuProps = {
                defaultStyle : styles.menuItem,
                defaultTextStyle : styles.menuItemText,
                selectedStyle : styles.menuItem,
                selectedTextStyle : styles.menuItemHoverText,
            };

        HttpUtils.get(Service.PositionListURL+'?count=100000',
            function(response) {
                console.log(response)
                var results = response.results, i = 0;
                if(response) {
                    results.map(function(result){
                        i++;
                        _this.position.push(
                            <View key={'position'+i} style={styles.itemBar}>
                                <ToggleButton {...menuProps} buttonText={result.name} onChoseButton={(data)=>_this.menuFun.chosePosition(result.id,data)} />
                            </View>
                        );
                    })
                    _this.setState({loaded: true});
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
        this.getPositionList();
    };

    /*
     选择性别
     */
    choseGender(type){
        var selected = !this.state.isGenderSelected,
            gender = selected ? type : null;
        this.setState({
            isGenderSelected : selected,
            gender : gender
        })
    };
    /*
     填写年龄
     */
    onChangeMinAge(event){
        var min_age = event.nativeEvent.text !== '' ? event.nativeEvent.text : null;
        this.setState({
            minAge : min_age
        })
    };
    onChangeMaxAge(event){
        var max_age = event.nativeEvent.text !== '' ? event.nativeEvent.text : null;
        this.setState({
            maxAge : max_age
        })
    };

    /*
     打开关闭菜单列表
     */
    menuFun = {
        props : {
            defaultStyle : styles.menuItem,
            defaultTextStyle : styles.menuItemText,
            selectedStyle : styles.menuItem,
            selectedTextStyle : styles.menuItemHoverText,
        },

        _this : this,

        //学历列表
        educationList(){
            return(
                <View style={styles.menuList}>
                    <View style={styles.itemBar}>
                        <ToggleButton {...this.props} buttonText='小学' onChoseButton={()=>this.choseEducation(0)} />
                    </View>
                    <View style={styles.itemBar}>
                        <ToggleButton {...this.props} buttonText='初中' onChoseButton={()=>this.choseEducation(1)} />
                    </View>
                    <View style={styles.itemBar}>
                        <ToggleButton {...this.props} buttonText='高中或中专' onChoseButton={()=>this.choseEducation(2)} />
                    </View>
                    <View style={styles.itemBar}>
                        <ToggleButton {...this.props} buttonText='大专' onChoseButton={()=>this.choseEducation(3)} />
                    </View>
                    <View style={styles.itemBar}>
                        <ToggleButton {...this.props} buttonText='本科以上' onChoseButton={()=>this.choseEducation(4)} />
                    </View>
                </View>
            )
        },

        //岗位列表
        positionList(){
            var _that = this._this;
            return(
                <View style={styles.menuList} >
                    {_that.state.loaded ? _that.position : null}
                </View>
            )
        },

        //打开隐藏学历列表
        onOpenEducationList(){
            this.setState({
                isEducationVisible : !this.state.isEducationVisible,
            })
        },

        //打开隐藏岗位列表
        onOpenPositionList(){
            if(!this.state.loaded) return;
            this.setState({
                isPositionVisible : !this.state.isPositionVisible,
            })
        },

        //选择学历
        choseEducation(type){
            var _that = this._this;
            _that.setState({
                education : type,
            });
            //在component挂载前设置是否显示,先settimeout,后期优化
            setTimeout(function(){
                _that.setState({
                    isEducationVisible : false
                })
            },500)
        },

        //选择岗位
        chosePosition(position,isSelected){
            var _that = this._this;
            if(isSelected){
                positionIds.push(position)
            }else{
                for(var i=0;i<positionIds.length;i++){
                    if(positionIds[i] === position){
                        positionIds.splice(i,1);
                    }
                }
            }
            _that.setState({
                positionIds : positionIds.join()
            })
        },

    };

    /*
     搜索
     */
    searchApplication(){
        var data = {
            gender : this.state.gender,
            education : this.state.education,
            minAge: this.state.minAge,
            maxAge: this.state.maxAge,
            positionIds : this.state.positionIds != '' ? this.state.positionIds : null
        };
        console.log(data)
        //this.props.onSearchResult(data);
        //this.props.onCancelPress();
    };

    render(){

        var genderProps = {
                defaultStyle : styles.genderItem,
                defaultTextStyle : styles.genderItemText,
                selectedStyle : styles.genderItemHover,
                selectedTextStyle : styles.genderItemHoverText,
            };

        return(
            <View style={styles.container}>

                    <View style={styles.leftBar} />

                    <View style={styles.filter}>
                        <ScrollView showHorizontalScrollIndicairo={false} showVerticalScrollIndicator={true}>
                            {/* 头部 */}
                            <View style={styles.header}>

                                {/* 返回按钮 */}
                                <TouchableHighlight  underlayColor='#00000000' onPress={this.props.onCancelPress}>
                                    <View style={styles.navigator}>
                                        <Text style={{color: '#737373', fontSize: 20, fontFamily: 'gk-iconfonts'}}>{glypy.ArrowLeft}</Text>
                                        <Text style={styles.navigatorText}>过滤申请</Text>
                                    </View>

                                </TouchableHighlight>

                                <TouchableHighlight style={styles.reset} underlayColor='#f2f2f2' onPress={this.props.onCancelPress}>
                                    <Text style={styles.resetText}>重置</Text>
                                </TouchableHighlight>
                            </View>

                            <View style={styles.list}>

                                {/*性别*/}
                                <View style={styles.item}>
                                    <View style={styles.itemTop}>
                                        <Text style={styles.title}>性别</Text>
                                        <View style={styles.itemRight}>
                                            <ToggleButton {...genderProps} buttonText='男' onChoseButton={()=>this.choseGender(0)} />
                                            <Text style={styles.tipLine} />
                                            <ToggleButton {...genderProps} buttonText='女' onChoseButton={()=>this.choseGender(1)} />
                                        </View>
                                    </View>
                                </View>

                                {/*年龄*/}
                                <View style={styles.item}>
                                    <View style={styles.itemTop}>
                                        <Text style={styles.title}>年龄</Text>
                                        <View style={styles.itemRight}>
                                            <TextInput key="123" style={styles.ageInput} onChange={this.onChangeMinAge.bind(this)} />
                                            <Text style={styles.tipLine}>-</Text>
                                            <TextInput style={styles.ageInput} onChange={this.onChangeMaxAge.bind(this)} />
                                        </View>
                                    </View>
                                </View>

                                {/*最低学历*/}
                                <View style={styles.item}>
                                    <View style={styles.itemTop}>
                                        <Text style={styles.title}>最低学历</Text>
                                        <View style={[styles.itemRight,styles.itemRightMenu]}>
                                            <TouchableHighlight underlayColor='#fff' onPress={this.menuFun.onOpenEducationList.bind(this)}>
                                                <Text style={{ color: '#737373', fontSize: 14, fontFamily: 'gk-iconfonts'}}>不限{glypy.ArrowLeft}</Text>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                    {this.state.isEducationVisible ? this.menuFun.educationList() : null}
                                </View>

                                {/*岗位*/}
                                <View style={styles.item}>
                                    <View style={styles.itemTop}>
                                        <Text style={styles.title}>岗位</Text>
                                        <View style={[styles.itemRight,styles.itemRightMenu]}>
                                            <TouchableHighlight underlayColor='#fff' onPress={this.menuFun.onOpenPositionList.bind(this)}>
                                                <Text style={{ color: '#737373', fontSize: 14, fontFamily: 'gk-iconfonts'}}>所有岗位{glypy.ArrowLeft}</Text>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                    {this.state.isPositionVisible ? this.menuFun.positionList() : null}
                                </View>

                                <TouchableHighlight style={styles.button} underlayColor="#ddd"  onPress={this.searchApplication.bind(this)}>
                                    <Text style={styles.buttonText}>确定</Text>
                                </TouchableHighlight>

                            </View>
                        </ScrollView>
                    </View>

            </View>
        )
    };
}

var styles = StyleSheet.create({

    header: {
        flex:1,
        flexDirection:'row',
        alignItems : 'center',
        justifyContent : 'space-between',
        height: 50,
        paddingRight : 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1/PixelRatio.get(),
    },
    navigator : {
        flex:1,
        flexDirection:'row',
        alignItems : 'center',
    },
    navigatorText : {
        fontSize : 18,
        marginLeft : 4,
    },
    reset : {
        width : 66,
        height : 27,
        backgroundColor : '#ff9d9d',
        borderWidth : 1,
        borderRadius : 4,
        borderColor : '#ff9191',
    },
    resetText : {
        lineHeight : 18,
        textAlign : 'center',
        color : '#fff',
    },
    container : {
        flex: 1,
        flexDirection:'row',
    },
    leftBar : {
        flex : 1,
    },
    filter : {
        flex : 5,
        paddingLeft : 20,
        backgroundColor : 'rgba(255,255,255,.9)'
    },
    list : {
        marginLeft : 10,
    },
    item : {
        borderBottomWidth : 1/PixelRatio.get(),
        borderBottomColor : '#ccc',
    },
    itemTop : {
        flex : 1,
        flexDirection : 'row',
        justifyContent : 'space-between',
    },
    title : {
        flex : 1,
        fontSize : 14,
        lineHeight : 20,
        color : '#666',
    },
    itemRight : {
        flex : 2,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems: 'center',
        padding : 10,
    },
    itemRightMenu : {
        flex : 2,
        flexDirection : 'row',
        justifyContent : 'flex-end',
        alignItems: 'center',
    },
    tipLine : {
        width:16,
        textAlign : 'center',
        color : '#666',
    },
    menuList : {
        marginLeft : 40,
    },
    itemBar : {
        paddingRight : 20,
        borderTopWidth : 1/PixelRatio.get(),
        borderTopColor : '#ccc',
    },
    itemBarText : {
        textAlign : 'right',
        color : '#666',
    },
    //性别
    genderItem : {
        width : 80,
        height : 30,
        borderRadius : 4,
        borderWidth : 1/PixelRatio.get(),
        borderColor : '#ccc',
    },
    genderItemText : {
        height : 29,
        lineHeight : 20,
        borderRadius : 4,
        textAlign:'center',
        color : '#666',
    },
    genderItemHover : {
        width : 80,
        height : 30,
        borderRadius : 4,
        borderWidth : 1/PixelRatio.get(),
        borderColor : '#ccc',
    },
    genderItemHoverText : {
        height : 29,
        lineHeight : 20,
        borderRadius : 4,
        textAlign : 'center',
        color : '#666',
        backgroundColor : '#f8db1c'
    },
    //年龄
    ageInput : {
        width : 80,
        height : 30,
        padding : 5,
        fontSize : 16,
        borderWidth : 1/PixelRatio.get(),
        borderColor : '#ccc',
        borderRadius : 4,
        color : '#666',
        backgroundColor : '#f2f2f2',
    },
    //学历
    menuItem : {
        paddingTop : 5,
        paddingBottom : 5,
    },
    menuItemText : {
        paddingTop : 5,
        paddingBottom : 5,
        textAlign : 'right',
        color : '#666',
    },
    menuItemHoverText : {
        paddingTop : 5,
        paddingBottom : 5,
        textAlign : 'right',
        color : '#f8db1c',
    },


    //按钮集成
    buttonIcon :{
        marginRight : 10,
        color: '#737373',
        fontSize: 20,
        fontFamily: 'gk-iconfonts',
    },
    cancel: {
        fontSize: 16,
        color: '#439dff',
        textAlign: 'right',
        paddingRight: 10,
    },
    button : {
        height : 36,
        margin : 10,
        backgroundColor : '#f8db1c',
        borderRadius : 4,
        justifyContent : 'center',
    },
    buttonText : {
        fontSize : 18,
        alignSelf : 'center',
        color : 'white'
    },
})

module.exports = FilterApplicationComp;