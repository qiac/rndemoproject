/**
 * 应聘者详情
 */
'use strict';
import React,{
    View,
    Text,
    Image,
    ListView,
    StyleSheet,
    Component,
    TouchableHighlight,
    PixelRatio,
    Platform,
    Modal,
} from 'react-native';
import HttpUtils from '../common/http_util';
import Service from '../common/service';
import Global from '../common/gk_global';
import Handler from './choseHandler';
import ActionSheet from '../../supports/react-native-actionsheet/index';
import { iconFontMaker, covertTime, GKAlert, loadView, onBackButtonClick } from '../common/gk_util';
const glypy = iconFontMaker({ ArrowLeft: 'e903', Setting: 'e905', ArrowRight: 'e912', Store: 'e904', Person: 'e908' });

class UserDetailComp extends Component{

    constructor(props){
        super(props);
        this.state = {
            loaded : false,
            modalVisible : false,
            realName : null,
            favorStatus : false,
            phone : null,
            candidateIcon : require('../../images/head_default.png'),
            userData : [],
            dataSource : new ListView.DataSource({
                rowHasChanged:(r1,r2) => r1 !== r2
            })
        };
        this.userID = null;
    };

    /*
     * 获取应聘者数据
     */
    getUserInfo(id) {
        var _this = this;
        HttpUtils.get(Service.ApplyListURL+id+'/',
            function(response) {
                //console.log(response)
                if(response) {
                    _this.setState({
                        loaded: true,
                        realName : response.candidate.real_name,
                        favorStatus : response.favor_status,
                        phone : response.candidate.phone,
                        candidateIcon : 
response.candidate.icon ? {uri:response.candidate.icon} : require('../../images/head_default.png'),
                        userData : response,
                        dataSource: _this.state.dataSource.cloneWithRows(response.candidate.profile.work_experiences),
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
        this.userID = this.props.source.id;
        //this.userID = 74699;
        this.getUserInfo(this.userID);
    };

    /*
     * IM聊天
     */
    onOpenIMModule(){
        console.log('打开IM聊天:')
    }
    /*
     * 拨打电话
     */
    showActionsSheet(){
        if(!this.state.loaded) return;
        this.ActionSheet.show();
    };
    onOpenPhonePressed(index){
        if(index){
            const phone = this.state.phone;
            console.log('拨打电话:'+phone)
        }
    }

    /*
     * 选择推荐人
     */
    onChoseHandlerClick() {
        if(!this.state.loaded) return;
        this.setState({modalVisible : true});
    }
    onCloseModal(){
        this.setState({modalVisible : false});
    }

    /*
     * 收藏
     */
    onCandidateFavor(){
        if(!this.state.loaded) return;
        this.setState({
            favorStatus : !this.state.favorStatus
        });
        var actions = this.state.favorStatus ? 1 : 0;
        var data = {
            'application' : this.userID,
            'action' : actions
        };
        HttpUtils.post(
            Service.FavorURL,
            data,
            function(){
                GKAlert.alert(
                    '提醒',
                    Global.FavorText[actions],
                    [{text: '确定'}]
                );
            },
            function(){
                GKAlert.alert(
                    '提醒',
                    '提交失败,请稍后再试!',
                    [{text: '确定'}]
                );
            }
        )
    };

    /*
     * 录用/拒绝
     */
    onCandidateOperate(type){
        var _this = this;
        GKAlert.alert(
            '提醒',
            Global.FeedbackText[type],
            [
                {text: '取消'},
                {
                    text: '确定',
                    onPress: function(){
                        const data = {
                            'application' : _this.userID,
                            'action' : type
                        };
                        console.log(data)
                        /*HttpUtils.post(
                            Service.OperateURL,
                            data,
                            function(){
                                console.log('提交成功')
                            },
                            function(){
                                console.log('提交失败')
                            }
                        )*/
                    }
                }
            ]
        );
    };

    /*
     * 工作经验
     */
    renderWorkItem(works){
        return(
            <View>
                <Text style={styles.description}>{works.company_name}，{works.position_name}，{Global.WorkExp[works.duration]}</Text>
            </View>
        )
    }

    /*
     * 应聘者信息
     * 基本信息
     * 工作经验/求职意向等
     * 录用/操作区域
     */
    renderUserDetail(){
        //获取应聘者图像
        const result = this.state.userData;
        return(
            <View style={styles.candidate}>

                {/*应聘者文字介绍*/}
                <View style={styles.detail}>
                    <Text style={styles.times}>最近活跃时间:{covertTime.covertFullDay(result.candidate_active_time)}</Text>

                    <View style={styles.username}>
                        <Text style={styles.name}>{result.candidate.real_name}</Text>
                        <Text style={styles.status}>{result.job.position.name}</Text>
                        <Text style={styles.status}>{result.job.store.name}</Text>
                    </View>

                    <Text style={styles.text}>
                        {Global.Gender[result.candidate.gender]}，
                        {result.candidate_age}岁
                    </Text>
                </View>
                {/*应聘者其他信息*/}
                <View style={styles.listView}>
                    <Text style={styles.title}>工作经验</Text>
                    <ListView dataSource={this.state.dataSource} renderRow={this.renderWorkItem.bind(this)} enableEmptySections={true} />
                </View>

                {/*录用/拒绝*/}
                <View>
                    <View style={styles.button}>
                        <TouchableHighlight style={{flex:1,borderLeftWidth:1,borderColor:'#ccc'}} underlayColor="#ddd"  onPress={()=>this.onCandidateOperate(4)}>
                            <View style={styles.buttonItem}><Text style={styles.buttonText}>录用</Text></View>
                        </TouchableHighlight>
                        <TouchableHighlight style={{flex:1}} underlayColor="#ddd"  onPress={()=>this.onCandidateOperate(5)}>
                            <View style={styles.buttonItem}><Text style={[styles.buttonText,styles.buttonTextReject]}>拒绝</Text></View>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        )
    }

    render(){
        return (
            <View style={{flex: 1, marginBottom:this.props.marginBottomHeight,backgroundColor: '#fff'}}>

                {/* 头部 */}
                <View style={styles.header}>
                    {/* 返回按钮 */}
                    <TouchableHighlight style={{flex:1}} underlayColor='#00000000' onPress={()=>onBackButtonClick(this.props.navigator)}>
                        <Text style={{textAlign:'left', paddingLeft: 10, color: '#737373', fontSize: 30, fontFamily: 'gk-iconfonts'}}>{glypy.ArrowLeft}</Text>
                    </TouchableHighlight>

                    {/*收藏*/}
                    <TouchableHighlight style={styles.buttonStyle} underlayColor='#00000000' onPress={this.onCandidateFavor.bind(this)}>
                        <Text style={styles.buttonIcon}>{this.state.favorStatus ? glypy.Store : glypy.Person}</Text>
                    </TouchableHighlight>

                    {/*推荐*/}
                    <TouchableHighlight style={styles.buttonStyle} underlayColor='#00000000' onPress={this.onChoseHandlerClick.bind(this)}>
                        <Text style={styles.buttonIcon}>{glypy.Setting}</Text>
                    </TouchableHighlight>

                </View>

                {/*应聘者图像*/}
                <View style={styles.thumbnail}>
                    {/*应聘者图像*/}
                    <Image style={styles.icon} source={this.state.candidateIcon} />
                    {/*IM聊天/拨打电话*/}
                    <View style={styles.buttonArea1}>
                        <TouchableHighlight style={styles.buttonStyle1} underlayColor='#f2f2f2' onPress={this.onOpenIMModule.bind(this)}>
                            <Text style={styles.buttonIcon1}>{glypy.Person}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.buttonStyle1} underlayColor='#f2f2f2' onPress={this.showActionsSheet.bind(this)}>
                            <Text style={styles.buttonIcon1}>{glypy.Setting}</Text>
                        </TouchableHighlight>
                    </View>
                </View>

                <View style={styles.container}>
                    {/* 应聘者详情 */}
                    {this.state.loaded ? this.renderUserDetail() : loadView()}
                </View>

                {/* 选择推荐人 */}
                <Modal
                    animated={false}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose = {function(){}}>

                    <View style={styles.modal}>
                        <View style={{height: 360}}>
                            <Handler source={this.state.userData} navigator={this.props.navigator} onCancelPress={this.onCloseModal.bind(this)}/>
                        </View>
                    </View>
                </Modal>

                {/* 拨打电话 */}
                <ActionSheet
                    ref={(o) => this.ActionSheet = o}
                    options={['取消','15851871924']}
                    cancelButtonIndex={0}
                    onPress={this.onOpenPhonePressed.bind(this)} />
            </View>
        )
    }
}

var styles = StyleSheet.create({

    flex : {
        flex : 1
    },
    header: {
        height: 150,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor : '#f8db1c',
        paddingTop: Platform.OS === 'ios' ? 30 : 20,
    },
    //收藏及推荐
    buttonStyle : {
        width : 30,
        height : 30,
        justifyContent : 'center',
        borderWidth : 1/PixelRatio.get(),
        borderColor : '#ccc',
        borderRadius : 4,
        marginRight : 10
    },
    buttonIcon :{
        color: '#737373',
        fontSize: 20,
        fontFamily: 'gk-iconfonts',
        alignSelf : 'center',
    },
    //图像IM聊天及电话
    thumbnail : {
        flex : 1,
        flexDirection: 'row',
        alignItems : 'center',
        marginLeft : 16,
        marginRight : 22,
        position : 'absolute',
        left : 0,
        right : 0,
        top : 105,
    },
    icon : {
        width : 90,
        height : 90,
        borderRadius : 45,
        borderWidth : 8/PixelRatio.get(),
        borderColor : '#fff',
    },
    buttonArea1 : {
        flex : 1,
        flexDirection: 'row',
        justifyContent : 'flex-end',
        alignItems : 'center',
    },
    buttonStyle1 : {
        width : 50,
        height : 50,
        borderRadius : 25,
        marginLeft : 24,
        justifyContent : 'center',
        backgroundColor : '#fff',
    },
    buttonIcon1 : {
        color: '#737373',
        fontSize: 32,
        fontFamily: 'gk-iconfonts',
        alignSelf : 'center',
    },
    //应聘者基本信息
    container : {
        flex : 1,
        marginTop:60,
    },
    candidate : {
        flex : 1,
        backgroundColor : '#f2f2f2',
        position : 'relative',
    },
    detail : {
        paddingTop : 0,
        paddingLeft : 20,
        paddingRight : 20,
        paddingBottom : 16,
        marginBottom : 10,
        backgroundColor : '#fff',
    },
    times : {
        fontSize : 12,
        marginTop : 8,
        color : '#666',
    },
    username : {
        flex : 1,
        flexDirection : 'row',
        alignItems : 'center',
        marginTop : 10,
    },
    name : {
        fontSize : 24,
        fontWeight : 'bold'
    },
    status : {
        marginLeft : 12,
        paddingLeft : 10,
        paddingRight : 10,
        paddingTop : 2,
        paddingBottom : 2,
        fontSize : 16,
        borderRadius : 4,
        borderWidth : 1/PixelRatio.get(),
        borderColor : '#ccc',
        color : '#333',
    },
    text : {
        fontSize : 18,
        lineHeight : 30,
        color : '#333',
    },
    //应聘者工作经验
    listView : {
        flex : 1,
        marginBottom : 10,
        paddingTop : 10,
        paddingBottom : 10,
        paddingLeft : 20,
        paddingRight : 20,
        backgroundColor : '#fff',
    },
    title : {
        fontSize : 20,
        lineHeight : 30,
        color : '#333'
    },
    description : {
        fontSize: 16,
        lineHeight : 30,
        color : '#333'
    },
    button : {
        flex : 1,
        flexDirection : 'row',
    },
    buttonItem : {
        height : 60,
        backgroundColor : '#fff',
        justifyContent : 'center',
    },
    buttonText : {
        fontSize : 20,
        alignSelf : 'center',
        color : 'green'
    },
    buttonTextReject : {
        color : 'red'
    },
    modal:{
        flex : 1,
        justifyContent : 'flex-end',
        backgroundColor : 'rgba(0,0,0,.5)',
    },
})

module.exports = UserDetailComp;