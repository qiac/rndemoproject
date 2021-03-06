'use strict';

import React, {
    PropTypes,
    ScrollView,
    ListView,
    View,
    Text,
    StyleSheet,
    Image,
    cloneElement,
    Platform,
    PullToRefreshViewAndroid,
    RefreshControl,
} from 'react-native';
import ScrollableMixin from 'react-native-scrollable-mixin';
import YYSpinner from './YYSpinner';

const REFRESH_STATUS = {
    INIT: 0, // 初始状态
    RELEASE_TO_REFRESH: 1, // 松开刷新
    REFRESHING: 2, // 正在刷新
    DONE: 3, // 完成
    RELEASE_TO_LOAD: 4, // 松开加载
    LOADING: 5, // 正在加载
    NONE: 6, // 加载不显示
}

class DataScrollView extends React.Component {
    constructor(props) {
        super(props);

        this._footerIsRender = false;
        this.initialLoadmoreOffset = 0;
        this.scrollOffset = 0;
        this.state = {
            refreshStatus: REFRESH_STATUS.NONE,
            isRefreshing: false,
            loadingStatus: REFRESH_STATUS.NONE,
            isAllLoaded: false,
        }
    }

    static defaultProps = {
        isListView: false,
        enableRefresh: true,
        enableLoadmore: false,

        scrollEventThrottle: 100,

        refreshableViewHeight: 50,
        refreshableDistance: 40,
        onRefresh: function(endRefresh) {
            endRefresh();
        },


        loadmoreViewHeight: 50,
        loadmoreDistance: 40,
        onLoadmore: function(endRefresh) {
            endRefresh();
        },

        emptyText: "您目前没有数据",
        renderScrollComponent: props => <ScrollView {...props} />,
    };

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    loadmoreFetchingView() {
        if (this.props.loadmoreFetchingView) {
            return this.props.loadmoreFetchingView();
        }
        return (
            <View style={[defaultStyles.refreshableView, {height: this.props.loadmoreViewHeight}]}>
                <YYSpinner />
                <Text style={defaultStyles.text}>正在加载...</Text>
            </View>
        );
    }

    loadmoreWillLoadView() {
        if (this.props.loadmoreWillLoadView) {
            return this.props.loadmoreWillLoadView();
        }
        return (
            <View style={[defaultStyles.refreshableView, {height: this.props.loadmoreViewHeight}]}>
                <Image source={require("./img/pull_icon_big.png")} style={{transform: [{rotateX: "180deg"}]}}/>
                <Text style={defaultStyles.text}>释放立即刷新...</Text>
            </View>
        );
    }

    loadmoreWaitingView() {
        if (this.props.loadmoreWaitingView) {
            return this.props.loadmoreWaitingView();
        }
        return (

            <View style={[defaultStyles.refreshableView, {height: this.props.loadmoreViewHeight}]}>
                <Image source={require("./img/pull_icon_big.png")}/>
                <Text style={defaultStyles.text}>上拉加载更多...</Text>
            </View>
        );
    }

    loadmoreFinishView() {
        if (this.props.loadmoreFinishView) {
            return this.props.loadmoreFinishView();
        }
        return (
            <View style={[defaultStyles.refreshableView, {height: this.props.loadmoreViewHeight}]}>
                <Text>加载成功!</Text>
            </View>
        );
    }
    allLoadedView() {
        if (this.props.allLoadedView) {
            return this.props.allLoadedView();
        }
        return (
            <View style={[defaultStyles.refreshableView, {height: this.props.loadmoreViewHeight}]}>
                <Text> </Text>
            </View>
        );
    }

    _renderLoadmoreView() {
        this._footerIsRender = true;
        switch (this.state.loadingStatus) {
            case REFRESH_STATUS.LOADING:
                return this.loadmoreFetchingView();
            break;
            case REFRESH_STATUS.RELEASE_TO_LOAD:
                return this.loadmoreWillLoadView();
            break;
            case REFRESH_STATUS.INIT:
                return this.loadmoreWaitingView();
            break;
            case REFRESH_STATUS.DONE:
                return this.loadmoreFinishView();
            default:
                //this._footerIsRender = false;
                //return null;
                return (
                    <View style={[defaultStyles.refreshableView, {height: this.props.refreshableViewHeight}]}/>
                );
        }
    }
    _isEmpty() {
        return !this.props.dataSource || this.props.dataSource.getRowCount()<=0;
    }

    _renderEmptyView() {
        if (this.props.renderEmptyView) {
            return this.props.renderEmptyView();
        }
        let emptyIcon;
        if (this.props.emptyIcon) {
            emptyIcon = (
                <Image style={defaultStyles.emptyIcon} source={this.props.emptyIcon}/>
            );
        }

        return (
            <View style={defaultStyles.emptyView}>
                {emptyIcon}
                <Text style={defaultStyles.emptyText}>{this.props.emptyText}</Text>
            </View>
        );
    }
    _renderFooterView() {
        let footerView = null;
        if (this._isEmpty()) {
            return this._renderEmptyView();
        }
        if (this.props.enableLoadmore) {

            if (this.state.isAllLoaded) {
                footerView = this.allLoadedView();
            } else {
                footerView = this._renderLoadmoreView();
            }
        }
        if (this.props.renderFooter) {
            return (
                <View>
                    {footerView}
                    {this.props.renderFooter()}
                </View>
            );
        }

        return footerView;
    }


    render() {
        if (this.props.isListView) {
            return this.renderListView();
        }
        return (
            <RefreshControl
                style={{flex: 1}}
                enabled={this.props.enableRefresh}
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh.bind(this)}
                colors={['#ff0000', '#00ff00', '#0000ff']}
                progressBackgroundColor={'#ffff00'}
            >
                <ScrollView
                    {...this.props}
                    style={[this.props.style, {flex: 1}]}>
                    {this.props.children}
                </ScrollView>
            </RefreshControl>
        );
    }
    renderListView() {
        return (
            <RefreshControl
                style={{flex: 1}}
                enabled={this.props.enableRefresh}
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh.bind(this)}
                colors={['#ff0000', '#00ff00', '#0000ff']}
                progressBackgroundColor={'#ffffff'}
            >
                <ListView ref={(component)=>this._scrollComponent=component}
                        dataSource={this.props.dataSource}
                        renderRow={this.props.renderRow}
                        renderFooter={this._renderFooterView.bind(this)}

                        {...this.props}
                        style={[this.props.style, {flex: 1}]}
                        onEndReachedThreshold={this.props.loadmoreViewHeight}
                        onEndReached={this._onEndReached.bind(this)}
                      />
            </RefreshControl>
        );
    }
    isMounted() {
        return this._isMounted;
    }
    setIsAllLoaded(isAllLoaded) {
        if (this.props.enableLoadmore) {
            this.isMounted() && this.setState({isAllLoaded: isAllLoaded});
        }
    }

    autoRefresh() {
        this._onRefresh();
    }
    _onRefresh() {
        if (this.isMounted()) {
            this.setState({
                refreshStatus: REFRESH_STATUS.REFRESHING,
                isRefreshing: true,
                isAllLoaded: false,
            });
            this.props.onRefresh(this._endRefresh.bind(this));
        }
    }

    _endRefresh() {
        if (this.isMounted()) {
            this.setState({
                refreshStatus: REFRESH_STATUS.DONE,
                isRefreshing: false
            });
            setTimeout(()=>{
                this.setState({refreshStatus: REFRESH_STATUS.NONE});
            }, 1000);
        }
    }

    _onEndReached() {
        if (this.state.loadingStatus !== REFRESH_STATUS.LOADING && !this._isEmpty() && !this.state.isAllLoaded) {
            this._onLoadmore();
        }
    }

    _onLoadmore() {
        this.setState({
            loadingStatus: REFRESH_STATUS.LOADING
        });
        this.props.onLoadmore(this._endLoadmore.bind(this));
    }

    _endLoadmore() {
        this.setState({
            loadingStatus: REFRESH_STATUS.NONE
        });
    }

}

var defaultStyles = StyleSheet.create({
    refreshableView: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    text: {
        marginLeft: 10
    },
    emptyView: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    emptyIcon: {
        marginTop: 100,
        marginBottom: 20
    },
    emptyText: {
        color: 'black',
        opacity: 0.7,
        fontSize: 15
    }
});

Object.assign(DataScrollView.prototype, ScrollableMixin);

export default DataScrollView;
