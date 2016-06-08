/**
 * '按门店查看'页面
 */
'use strict';

import React, {
  AppRegistry,
  Component,
  Image,
  ListView,
  StyleSheet,
  Platform,
  TouchableHighlight,
  ActivityIndicatorIOS,
  ProgressBarAndroid,
  Text,
  View,
} from 'react-native';

import AScrollView from '../../supports/react-native-yyscrollview/index';
import HttpUtils from '../common/http_util';
import Service from '../common/service';
import StoreListItem from './tab_store_item';

class TabStoreComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),

      loaded: false,
    };

    this.listData = [];
    this.nextUrl = null;
  }
  /*
   * 等待进度条t
   */
  renderLoadingView() {
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
  }
  /*
   * 下拉刷新
   */
  refresh(finishCallback) {
    var _this = this;
    HttpUtils.get(Service.STORE_LIST_URL,
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
    var _this = this;

      HttpUtils.get(_this.nextUrl,
        function(response) {
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
          _this.setState({
            loaded: true,
          });
        }
      );
  }

  componentDidMount() {
    this.refresh();
  }

  render() {
    if(!this.state.loaded) {
      return this.renderLoadingView();
    }
    return (
      <AScrollView ref="scrollView"
        automaticallyAdjustContentInsets={false}
        dataSource={this.state.dataSource}
        renderRow={this.renderItem.bind(this)}
        style={styles.listView}
        isListView={true}
        enableLoadmore={true}
        onRefresh={(endRefresh)=>{this.refresh(endRefresh);}}
        onLoadmore={(endRefresh)=>{this.loadmore(endRefresh);}}
        emptyText="No Datas!" />
    );
  }

  renderItem(item: json, sectionID: number, rowID: number) {

    var props = {
      store_thumbs:item.images_list,
      store_thumb: item.images_list[0],
      store_name: item.name,
      store_apply_count: item.application_count,
      store_id: item.id,
      store_intro : item.intro,
      navigator:this.props.navigator,
    };
    return ( <StoreListItem {...props}/> );
  }
}

var styles = StyleSheet.create({
  listView: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

module.exports = TabStoreComp;
