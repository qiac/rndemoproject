/**
 * 申请列表
 */
'use strict';
import React,{
    View,
    Text,
    Image,
    TextInput,
    ListView,
    StyleSheet,
    Component,
    TouchableHighlight,
    PixelRatio,
    Platform,
    Modal,
} from 'react-native';
import AScrollView from 'react-native-yyscrollview';
import HttpUtils from '../common/http_util';
import Service from '../common/service';
import Global from '../common/gk_global';
import Filter from './filter';
import { iconFontMaker, GKAlert, loadView, onBackButtonClick } from '../common/gk_util';
const glypy = iconFontMaker({ Setting: 'e905', Store: 'e904', Person: 'e908' });
class ApplyListComp extends Component{

    constructor(props){
        super(props);
        this.state = {
            loaded : false,
            keyword : '',
            favor : 0,
            gender : null,
            education : null,
            minAge : null,
            maxAge : null,
            modalVisible : false,
            positionIds : null,
            dataSource : new ListView.DataSource({
                rowHasChanged:(r1,r2) => r1 !== r2
            })
        };
        this.listData = [];
        this.nextUrl = null;
    };

    /*
     * 下拉刷新
     */
    refresh(finishCallback) {
        var _this = this,
            url = Service.ApplyListURL+'?list_type=100&favor='+this.state.favor;
        if(this.state.keyword !== '')
            url += '&keyword='+this.state.keyword;
        if(this.state.gender !== null)
            url += '&gender='+this.state.gender;
        if(this.state.education !== null)
            url += '&education='+this.state.education;
        if(this.state.minAge)
            url += '&min_age='+this.state.minAge;
        if(this.state.maxAge)
            url += '&max_age='+this.state.maxAge;
        if(this.state.positionIds)
            url += '&position_ids='+this.state.positionIds;

        console.log(url)
        HttpUtils.get(url,
            function(response) {
                console.log(response)
                if(response) {
                    // 刷新列表
                    _this.listData = response.results;
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.listData),
                        loaded: true,
                    });

                    // 检查下一页数据
                    _this.nextUrl = response.next;
                    if(!_this.nextUrl) {
                        _this.refs["scrollView"].setIsAllLoaded(true);
                    }
                } else {
                    _this.setState({ loaded: true });
                }

                // 关闭刷新
                finishCallback && finishCallback();
            },
            function(error) {
                // 关闭刷新
                finishCallback && finishCallback();
                _this.setState({ loaded: true });
            }
        );
    }
    /*
     * 加载更多
     */
    loadmore(finishCallback) {
        const _this = this;
        HttpUtils.get(_this.nextUrl,
            function(response) {
              console.log(response);
                if(response) {
                    // 刷新列表
                    _this.listData = _this.listData.slice().concat(response.results);
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.listData),
                        loaded: true,
                    });

                    // 检查下一页数据
                    _this.nextUrl = response.next;
                    if(!_this.nextUrl) {
                        _this.refs["scrollView"].setIsAllLoaded(true);
                    }
                }

                // 关闭刷新
                finishCallback && finishCallback();
            },
            function(error) {
                // 关闭刷新
                finishCallback && finishCallback();
                _this.setState({ loaded: true,});
            }
        );
    }

    componentDidMount() {
        this.refresh();
    }

    /*
     * 点击跳转到应聘者详情
     */
    onCandidateClick(candidate) {
        this.props.navigator.push({id: 'UserInfo',passProps : {candidate : candidate}});
    }

    /*
     * 只看收藏/只看全部
     */
    onFavorButtonClick(){
        var type = this.state.favor ? 0 : 1;
        this.setState({
            loaded : false,
            favor : type,
        });
        this.refresh();
    }

    /*
     * 过滤申请
     */
    onFilterButtonClick() {
        if(!this.state.loaded) return;
        this.setState({
            modalVisible : true,
            position : null,
        });
    }
    onCloseModal(){
        this.setState({modalVisible : false});
    }
    onSearchApplication(data){
        console.log(data)
        this.setState({
            loaded : false,
            gender : data.gender,
            education : data.education,
            minAge : data.minAge,
            maxAge : data.maxAge,
            positionIds : data.positionIds
        });
        this.refresh();
    }

    /*
     * 搜索框文字状态
     */
    onSearchInput(event){
        this.setState({
            keyword : event.nativeEvent.text
        })
    }

    /*
     * 当文本输入结束后调用,进行搜索
     */
    onSearchResult(){
        this.setState({
            loaded : false,
        });
        this.refresh();
    }

    /*
     申请列表项
     */
    renderItem(result){
        //获取应聘者图像
        let candidateIcon = null;
        if(result.candidate.icon) {
            candidateIcon = {uri: result.candidate.icon};
        } else {
            candidateIcon = require('../../images/head_default.png');
        }
        return(
            <TouchableHighlight underlayColor="#ddd"  onPress={()=>this.onCandidateClick(result)}>
                <View style={[styles.item,styles.borderBottom]}>
                    <View style={styles.thumbnail}>
                        <Image style={styles.icon} source={candidateIcon} />
                        {
                            result.favor_status ?
                            <Text style={[styles.favor,styles.buttonIcon]}>{glypy.Setting}</Text> : null
                        }
                    </View>
                    <View style={styles.flex}>
                        <Text style={styles.time}>{result.submit_time_text}</Text>
                        <View style={styles.candidate}>
                            <Text style={styles.name}>{result.candidate.real_name}</Text>
                            <Text style={styles.tip}>{result.job.position.name}</Text>
                        </View>
                        <Text style={styles.tipText}>
                            {Global.Gender[result.candidate.gender]}，
                            {result.candidate_age}岁
                        </Text>

                        {/* 未读icon */}
                        {result.checked_in ? null : <View style={styles.unRead} />}
                    </View>
                </View>
            </TouchableHighlight>
        )
    };

    render(){
        return (
            <View style={{flex: 1, marginBottom:this.props.marginBottomHeight,backgroundColor: '#fff'}}>

                {/* 头部 */}
                <View style={styles.header}>
                    <Text style={{color: '#000', fontSize: 17, textAlign:'center'}}>申请</Text>
                </View>

                {/* 搜索 */}
                <View style={styles.search}>

                    <View style={styles.searchModule}>
                        {/* 搜索Input */}
                        <View style={styles.searchBox}>
                            <TextInput style={styles.searchInput} onChange={this.onSearchInput.bind(this)} onEndEditing={this.onSearchResult.bind(this)} placeholder='搜索姓名、岗位、门店' />
                        </View>

                        {/* 只看收藏 */}
                        <TouchableHighlight style={[styles.button,styles.buttonFavor]} underlayColor='#00000000' onPress={this.onFavorButtonClick.bind(this)}>
                            <Text style={styles.buttonIcon}>{glypy.Store}</Text>
                        </TouchableHighlight>

                        {/* 过滤 */}
                        <TouchableHighlight style={styles.button} underlayColor='#00000000' onPress={this.onFilterButtonClick.bind(this)}>
                            <Text style={styles.buttonIcon}>{glypy.Setting}</Text>
                        </TouchableHighlight>
                    </View>
                </View>

                {/* 过滤申请 */}
                <Modal
                    animated={false}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose = {function(){}}>

                    <View style={styles.modal}>
                        <Filter onSearchResult={this.onSearchApplication.bind(this)} onCancelPress={this.onCloseModal.bind(this)} />
                    </View>
                </Modal>

                {/* 申请列表 */}
                <View style={styles.listView}>
                    {this.state.loaded ?
                        <AScrollView ref="scrollView"
                                     automaticallyAdjustContentInsets={false}
                                     dataSource={this.state.dataSource}
                                     renderRow={this.renderItem.bind(this)}
                                     isListView={true}
                                     enableLoadmore={true}
                                     enableEmptySections = {true}
                                     onRefresh={(endRefresh)=>{this.refresh(endRefresh);}}
                                     onLoadmore={(endRefresh)=>{this.loadmore(endRefresh);}}
                                     emptyText="暂无数据!" /> : loadView()}
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({

    flex : {
        flex : 1
    },
    borderBottom : {
        borderColor : '#c8c7cc',
        borderBottomWidth : 1/PixelRatio.get(),
        borderStyle : 'solid'
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
    search : {
        padding: 10,
        borderBottomWidth : 1/PixelRatio.get(),
        borderBottomColor : '#ccc',
        backgroundColor : '#f2f2f2',
    },
    searchModule : {
        flex : 1,
        flexDirection : 'row',
        justifyContent : 'center',
    },
    searchBox : {
        flex : 7,
    },
    searchInput : {
        height : 36,
        padding : 5,
        fontSize : 16,
        borderWidth : 1/PixelRatio.get(),
        borderColor : '#ccc',
        borderRadius : 4,
        color : '#ccc',
        backgroundColor : '#fff',
    },
    button : {
        flex : 1,
        height : 36,
        justifyContent : 'center',
        borderWidth : 1/PixelRatio.get(),
        borderColor : '#ccc',
        borderRadius : 4,
        backgroundColor : '#fff',
    },
    buttonFavor : {
        marginLeft: 10,
        marginRight : 10,
    },
    buttonIcon :{
        color: '#737373',
        fontSize: 20,
        fontFamily: 'gk-iconfonts',
        alignSelf : 'center',
    },
    listView : {
        flex : 1,
        backgroundColor : '#fff'
    },
    item : {
        flex : 1,
        flexDirection:'row',
        padding : 10,
        paddingBottom : 20,
        position : 'relative'
    },
    time : {
        color : '#666',
        textAlign : 'right',
        fontSize : 12
    },
    candidate : {
        flex : 1,
        flexDirection : 'row',
        alignItems : 'center'
    },
    name : {
        fontSize : 16
    },
    tip : {
        marginLeft : 10,
        paddingLeft : 4,
        paddingRight : 4,
        paddingBottom : 2,
        fontSize : 12,
        borderRadius : 4,
        lineHeight : 16,
        borderWidth : 1/PixelRatio.get(),
        borderColor : '#ccc',
    },
    tipText : {
        marginTop : 4,
        color : '#828282'
    },
    icon : {
        width : 60,
        height : 60,
        borderRadius : 30,
        marginRight : 20,
        marginTop : 8
    },
    unRead : {
        width : 12,
        height : 12,
        backgroundColor : 'red',
        borderRadius : 6,
        position : 'absolute',
        right : 10,
        top : 38,
    },
    thumbnail : {
        position : 'relative',
    },
    favor : {
        position : 'absolute',
        right : 20,
        bottom : 0,
    },
    modal:{
        flex : 1,
        justifyContent : 'flex-end',
        backgroundColor : 'rgba(0,0,0,.5)',
    },
})

module.exports = ApplyListComp;
