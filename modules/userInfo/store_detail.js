/**
 * 门店详情
 */
'use strict';

import React, {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    TextInput,
    Component,
    ScrollView,
    PixelRatio,
    Platform,
    TouchableHighlight,
} from 'react-native';

import ActionSheet from '../../supports/react-native-actionsheet/index';
import HttpUtils from '../common/http_util';
import Service from '../common/service';
import { iconFontMaker, GKAlert } from '../common/gk_util';
const glypy = iconFontMaker({ ArrowLeft: 'e903', Store: 'e904', Location: 'e909', Plus: 'e907', ArrowRight: 'e912' });
const buttons = ['取消', '相册', '拍照'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = -1;
var ImagePickerManager = require('NativeModules').ImagePickerManager;
class StoreDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
          real_name: '',
          loaded: false,
          dataSource : new ListView.DataSource({
              rowHasChanged:(r1,r2) => r1 !== r2
          }).cloneWithRows(this.props.source.store_thumbs),
        };
        this.listData = [];
    }
    /*
     * 返回按钮
     */
    onBackButtonClick() {
        this.props.navigator.pop();
    }
    /*
     * 预览按钮
     */
    onPreviewButtonClick() {
         this.props.navigator.push({id: 'StorePreview', passProps: {store_thumbs:this.props.source.store_thumbs}})
    }
     /*
     * 地址按钮
     */
    onAddressButtonClick() {
        this.props.navigator.push({id: 'StoreAddress'})
    }
    /*
     * 添加照片
     */
    onPlusImageClick() {
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
     * 拍照
     */
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

    componentDidMount() {
        /*var storeid= this.props.store_id; */
        var storeid='129';
        /*getStoreInfo(storeid); */
    }
    renderWorkItem(data: Object, pageID: number|string){
        return(
          <View style={styles.store_image}>
              <Image style={styles.image} source={{uri: data}}/>
              <TextInput style={styles.input} underlineColorAndroid='transparent'
                  placeholder='请给这张图片加点说明文字吧' placeholderTextColor='#aaa' multiline={true} />
          </View>
        )
    };
    render() {
      let StoreAddress = null, storeName = null, storeApplyCount = 0;

      console.log(this.props.source.store_thumbs);
      // 门店介绍
      if(!this.props.source.store_intro) {
          StoreAddress = '';
      } else {
          StoreAddress = this.props.source.store_intro;
      }

      // 门店名称
      if(!this.props.source.store_name) {
          storeName = '';
      } else {
          storeName = this.props.source.store_name;
      }
        return (
            <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
                {/* 头部 */}
                <View style={styles.header}>
                    {/* 返回按钮 */}
                    <TouchableHighlight style={{flex:1}} underlayColor='#00000000' onPress={this.onBackButtonClick.bind(this)}>
                        <Text style={{textAlign:'left', paddingLeft: 10, color: '#737373', fontSize: 20, fontFamily: 'gk-iconfonts'}}>{glypy.ArrowLeft}</Text>
                    </TouchableHighlight>

                    <Text style={{flex: 6, color: '#000', fontSize: 17, textAlign:'center'}}>门店信息</Text>

                    <TouchableHighlight style={{flex:1}} underlayColor='#00000000' onPress={this.onPreviewButtonClick.bind(this)}>
                        <Text style={{textAlign:'right', marginRight: 10, color: '#737373', fontSize: 15}}>预览</Text>
                    </TouchableHighlight>
                </View>

                <ScrollView>
                    {/* 门店照片 */}
                    <View style={styles.store}>
                        <Text style={{color: '#101010', paddingTop: 10, fontSize: 17, marginLeft: 14}}>门店照片</Text>
                        <Text style={{color: '#ccc', fontSize: 14, marginLeft: 14, marginTop: 5, marginBottom: 5}}>
                            首张照片会默认作为您的门店封面图哦
                        </Text>
                        <View style={{marginLeft: 14, marginBottom: 10, backgroundColor: '#ccc', height: 1/PixelRatio.get()}}></View>

                        <ListView dataSource={this.state.dataSource} renderRow={this.renderWorkItem.bind(this)} enableEmptySections={true} />




                        <TouchableHighlight style={styles.plus} underlayColor='#eee' onPress={this.onPlusImageClick.bind(this)}>
                            <Text style={{color: '#ccc', fontSize: 30, fontFamily: 'gk-iconfonts'}}>{glypy.Plus}</Text>
                        </TouchableHighlight>
                    </View>
                    {/* 店名 */}
                    <View style={styles.store}>
                        <View style={styles.store_title}>
                            <Text style={{flex: 1, color: '#101010', fontSize: 17, marginLeft: 16}}>门店基本信息</Text>
                        </View>
                        <View style={{marginLeft: 26, marginBottom: 10, backgroundColor: '#ccc', height: 1/PixelRatio.get()}}></View>
                        <View style={styles.store_title}>
                            <Text style={{flex: 1, color: '#101010', fontSize: 17, marginLeft: 26}}>店名</Text>
                            <Text style={{color: '#ccc', fontSize: 14,marginRight:0}}>{storeName}</Text>
                        </View>
                        <View style={{marginLeft: 26, marginBottom: 10, backgroundColor: '#ccc', height: 1/PixelRatio.get()}}></View>
                        <View style={styles.store_title}>
                            <Text style={{flex: 1, color: '#101010', fontSize: 17, marginLeft: 26}}>门店地址</Text>
                        </View>
                        <TouchableHighlight style={{flex:1}} underlayColor='#eee' onPress={this.onAddressButtonClick.bind(this)}>
                            <View style={styles.store_info}>
                                <Text style={{flex: 1, color: '#ccc', fontSize: 14}}>{StoreAddress}</Text>
                                <Text style={{color: '#737373', paddingRight: 8, fontSize: 14, fontFamily: 'gk-iconfonts'}}>{glypy.ArrowRight}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>

                </ScrollView>
                {/* 修改头像对话框 */}
                <ActionSheet
                    ref={(o) => this.ActionSheet = o}
                    title="请选择照片"
                    options={buttons}
                    cancelButtonIndex={CANCEL_INDEX}
                    onPress={this.onChooseImagePressed.bind(this)} />
            </View>
        );
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
    store: {
        marginTop: 10,
        backgroundColor: 'white',
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#ccc',
    },
    store_title: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        paddingTop: 12,
        paddingBottom: 12,
    },
    store_info: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 36,
        paddingBottom: 12,
    },
    job_setting: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        borderTopColor: '#ccc',
        borderTopWidth: 1/PixelRatio.get(),
        marginLeft: 16,
    },
    store_image: {
        flexDirection: 'row',
        paddingLeft: 14,
        paddingRight: 14,
        paddingBottom: 14,
    },
    image: {
        height: 80,
        width: 80,
        borderRadius: 4
    },
    input: {
        flex: 1,
        height: 80,
        marginLeft: 10,
        padding: 4,
        borderRadius: 4,
        backgroundColor: '#eee',
    },
    plus: {
        height: 80,
        width: 80,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 14,
        marginBottom: 14,
        borderColor: '#ccc',
        borderWidth: 1/PixelRatio.get(),
    },
});

module.exports = StoreDetail;
