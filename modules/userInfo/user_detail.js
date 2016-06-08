/*
 * 个人详情页面
 */
'use strict';

import React, {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    PixelRatio,
    Component,
    Platform,
    TouchableHighlight,

} from 'react-native';
import DateTimePicker from '../../supports/react-native-datetime/index';
import Service from '../common/service';
import HttpUtils from '../common/http_util';
var ImagePickerManager = require('NativeModules').ImagePickerManager;
import { iconFontMaker, GKAlert, convertNull } from '../common/gk_util';
const glypy = iconFontMaker({ ArrowLeft: 'e903' });

import ActionSheet from '../../supports/react-native-actionsheet/index';
const buttons = ['取消', '相册', '拍照'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = -1;

class UserDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            real_name: '', // 真实姓名
            icon: '', // 头像
            account_name: '', // 用户名
            phone: '', // 手机号码
            birthday: '', // 生日
            job_name: '', // 岗位
            recruit_date: '', // 入职时间
            org_name: '', // 所属组织
            role_name: '', // 角色
        };
    }
    onChooseImagePressed(index) {
        switch(index) {
            case 0: // 取消
                break;
            case 1: // 相册
                break;
            case 2: // 拍照
                break;
        }
    }

    /*
     * 点击返回按钮
     */
    onBackButtonClick() {
        this.props.navigator.pop();
    }
    /*
     * 点击修改头像
     */
    onChangeHeadIcon() {
      const options = {
        title: 'Photo Picker',
        takePhotoButtonTitle: 'Take Photo...',
        chooseFromLibraryButtonTitle: 'Choose from Library...',
        quality: 0.5,
        maxWidth: 300,
        maxHeight: 300,
        storageOptions: {
          skipBackup: true
        },
        allowsEditing: true
      };

      ImagePickerManager.showImagePicker(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled photo picker');
        }
        else if (response.error) {
          console.log('ImagePickerManager Error: ', response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
        else {
          // You can display the image using either:
          //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
          var source;
          if (Platform.OS === 'android') {
            source = {uri: response.uri, isStatic: true};
          } else {
            source = {uri: response.uri.replace('file://', ''), isStatic: true};
          }

          this.setState({
            icon: source
          });
        }
      });
    }
    /*
     * 修改手机号码
     */
    onChangePhoneNumber() {
      //  var date = this.state.birthday;
      var date =new Date();
               this.picker.showDateTimePicker(date, (d)=>{
                   this.setState({birthday:d});
               });
    }
    /*
     * 修改入职时间
     */
    onChangeRecruitDate() {

    }
    /*
     * 保存按钮
     */
    onSaveButtonClick() {

    }

    componentDidMount() {
        var _this = this;
        // 获取我的门店列表数据
        HttpUtils.get(Service.ACCOUNT_INFO_URL,
            function(response) {
                console.log(JSON.stringify(response));
                if(response) {
                    _this.setState({
                        real_name: convertNull(response.detail.real_name), // 真实姓名
                        icon: convertNull(response.detail.icon), // 头像
                        account_name: convertNull(response.detail.account_name), // 用户名
                        phone: convertNull(response.detail.phone), // 手机号码
                        birthday: convertNull(response.detail.birthday), // 生日
                        job_name: convertNull(response.detail.job_name), // 岗位
                        recruit_date: convertNull(response.detail.recruit_date), // 入职时间
                        org_name: convertNull(response.detail.org_name), // 所属组织
                        role_name: convertNull(response.detail.role_name), // 角色
                    });
                }
            },
            function(error) {
                GKAlert.alert('提醒', '信息获取失败', [{text: '确定'}]);
            }
        );
    }

    render() {
        // 获取头像
        let headIcon = null;
        if(this.state.icon) {
            headIcon = {uri: this.state.icon};
        } else {
            headIcon = require('../../images/head_default.png');
        }

        // '生日' 默认提示文字和颜色
        let birthdayText = this.state.birthday ? this.state.birthday : '请选择日期';
        let birthdayColor = this.state.birthday ? '#333' : '#ccc';

        // '入职时间' 默认提示文字和颜色
        let recruitDateText = this.state.recruit_date ? this.state.recruit_date : '请选择日期';
        let recruitDateColor = this.state.recruit_date ? '#333' : '#ccc';

        return(
            <View style={styles.container}>
                {/* 头部 */}
                <View style={styles.header}>
                    {/* 返回按钮 */}
                    <TouchableHighlight style={{flex:1}} underlayColor='#00000000' onPress={this.onBackButtonClick.bind(this)}>
                        <Text style={{textAlign:'left', paddingLeft: 10, color: '#737373', fontSize: 20, fontFamily: 'gk-iconfonts'}}>{glypy.ArrowLeft}</Text>
                    </TouchableHighlight>

                    <Text style={{flex: 6, color: '#000', fontSize: 17, textAlign:'center'}}>{this.state.real_name}</Text>

                    <View style={{flex: 1}} />
                </View>

                {/* 头像 */}
                <TouchableHighlight underlayColor="#ddd" onPress={this.onChangeHeadIcon.bind(this)}>
                    <View style={styles.icon_row}>
                        <Text style={{fontSize: 16, color: '#333'}}>头像</Text>
                        <Image style={{width: 70, height: 70, borderRadius: 35}} source={headIcon} />
                    </View>
                </TouchableHighlight>

                <View style={{marginTop: 10, backgroundColor: 'white'}}>
                    {/* 用户名 */}
                    <View style={styles.item}>
                        <Text style={styles.item_text}>用户名</Text>
                        <Text style={styles.item_text}>{this.state.account_name}</Text>
                    </View>

                    {/* 手机号码 */}
                    <View style={styles.item}>
                        <Text style={styles.item_text}>手机号码</Text>
                        <TextInput style={styles.item_input} underlineColorAndroid='transparent'
                            placeholder='请输入手机号码' placeholderTextColor='#ccc' defaultValue={this.state.phone}/>
                    </View>

                    {/* 生日 */}
                    <TouchableHighlight underlayColor="#ddd" onPress={this.onChangePhoneNumber.bind(this)}>
                        <View style={styles.item}>
                            <Text style={styles.item_text}>生日</Text>

                            <Text style={{fontSize: 16, color: birthdayColor}}>{birthdayText}</Text>
                        </View>
                    </TouchableHighlight>

                    {/* 岗位 */}
                    <View style={styles.item}>
                        <Text style={styles.item_text}>岗位</Text>
                        <Text style={styles.item_text}>{this.state.job_name}</Text>
                    </View>

                    {/* 入职时间 */}
                    <TouchableHighlight underlayColor="#ddd" onPress={this.onChangeRecruitDate.bind(this)}>
                        <View style={styles.item}>
                            <Text style={styles.item_text}>入职时间</Text>
                            <Text style={{fontSize: 16, color: recruitDateColor}}>{recruitDateText}</Text>
                        </View>
                    </TouchableHighlight>

                    {/* 所属组织 */}
                    <View style={styles.item}>
                        <Text style={styles.item_text}>所属组织</Text>
                        <Text style={styles.item_text}>{this.state.org_name}</Text>
                    </View>

                    {/* 角色 */}
                    <View style={styles.item}>
                        <Text style={styles.item_text}>角色</Text>
                        <Text style={styles.item_text}>{this.state.role_name}</Text>
                    </View>

                    {/* 修改密码 */}
                    <View style={styles.item}>
                        <Text style={styles.item_text}>修改密码</Text>
                        <Text style={styles.item_text}>******</Text>
                    </View>
                </View>

                {/* 保存按钮 */}
                <TouchableHighlight style={styles.save_btn} underlayColor='rgba(76,217,100,.8)' onPress={this.onSaveButtonClick.bind(this)}>
                    <Text style={styles.save_btn_text}>保存</Text>
                </TouchableHighlight>

                <DateTimePicker ref={(picker)=>{this.picker=picker}}/>
                {/* 修改头像对话框 */}
                <ActionSheet
                    ref={(o) => this.ActionSheet = o}
                    title="请选择照片"
                    options={buttons}
                    cancelButtonIndex={CANCEL_INDEX}
                    onPress={this.onChooseImagePressed.bind(this)} />
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
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
    icon_row: {
        flex: 1,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderBottomColor: '#c8c7cc',
        borderBottomWidth: 1/PixelRatio.get(),
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 45,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1/PixelRatio.get()
    },
    item_text: {
        fontSize: 16,
        color: '#333',
    },
    item_input: {
        flex: 1,
        marginLeft: 20,
        fontSize: 16,
        textAlign: 'right',
    },
    save_btn: {
        height: 45,
        backgroundColor: '#4cd964',
        justifyContent: 'center',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 4
    },
    save_btn_text: {
        fontSize: 18,
        justifyContent: 'center',
        alignSelf: 'center',
        color: 'white'
    },
});

module.exports = UserDetail;
