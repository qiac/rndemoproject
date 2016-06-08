import React, {
  StyleSheet,
  Component,
  PixelRatio,
  Platform,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native';
import { extendRawIcon } from './raw';

const styles = StyleSheet.create({
  icon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  list_unread_1x: {
        position: 'absolute',
        top: 2,
        right: 40,
        width : 18,
        height : 18,
        justifyContent:'center',
        alignItems : 'center',
        backgroundColor : 'red',
        borderRadius : 9,
        borderColor: '#fff',
        borderWidth: 2 * 1/PixelRatio.get()
    },
    list_unread_2x: {
        position: 'absolute',
        top: 2,
        right: 40,
        width : 19,
        height : 19,
        justifyContent:'center',
        alignItems : 'center',
        backgroundColor : 'red',
        borderRadius : 9.5,
        borderColor: '#fff',
        borderWidth: 2 * 1/PixelRatio.get()
    },
    list_unread_3x: {
        position: 'absolute',
        top: 2,
        right: 32,
        width : 28,
        height : 18,
        justifyContent:'center',
        alignItems : 'center',
        backgroundColor : 'red',
        borderRadius : 8,
        borderColor: '#fff',
        borderWidth: 2 * 1/PixelRatio.get()
    },
})

class IconWithBar extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selected: false
    };
  }

  onPress() {
    const { tabName, gotoTab } = this.context;
    gotoTab(tabName);
  }

  tabDidActive() {
    this.setState({ selected: true });
    //console.log(`tab ${this.context.tabName} is active`);
  }

  tabDidInactive() {
    this.setState({ selected: false });
    //console.log(`tab ${this.context.tabName} is inactive`);
  }

  renderBadgeView(count) {
    if(count == 0) return null;
    // 一位数字
    if(count < 10) {
        return (
            <View style={styles.list_unread_1x}>
                <Text style={{fontSize: 12, color: '#fff'}}>{count}</Text>
            </View>
        );
    }
    // 两位数字
    else if (count < 100) {
        return (
            <View style={styles.list_unread_2x}>
                <Text style={{fontSize: 11, color: '#fff'}}>{count}</Text>
            </View>
        );
    }
    // 三位数字
    else {
        return (
            <View style={styles.list_unread_3x}>
                <Text style={{fontSize: 11, color: '#fff'}}>99+</Text>
            </View>
        );
    }
  }

  render() {
    const {
      label,
      type,
      from,
      size,
      applyCount,
      unreadMsgCount,
      iconStyle,
      onActiveColor,
      onInactiveColor,
      onActiveColorBar,
      onInactiveColorBar
    } = this.props;
    const { selected } = this.state;

    const color = selected? onActiveColor : onInactiveColor
    const barColor = selected? onActiveColorBar : onInactiveColorBar;
    const borderWidth = 1/PixelRatio.get();
    const padding = 2;

    let icon = null;
    if (!!type && !from) {
      throw new Error("icon must contains 'type' and 'from' values");
    } else if (!type && !!from) {
      throw new Error("icon must contains 'type' and 'from' values");
    } else if (!!type && !!from) {
      icon = (
          <View>
              <Text style={[iconStyle, { fontSize: size, fontFamily: from, color: color }]}>
                  {type}
              </Text>
          </View>
      );
    }

    return (
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={this.onPress.bind(this)}>
        <View style={[styles.icon, { borderTopWidth: borderWidth, borderTopColor: barColor, paddingTop: padding }]}>
          {icon}
          <View style={{ paddingTop: Platform.OS === 'ios' ? 8 : 0 }}>
            <Text style={{ fontSize: 12, color: color }}>{label}</Text>
          </View>
          {/* 申请数 */}
          {this.context.tabName === 'application' ? this.renderBadgeView(applyCount) : null}

          {/* 未读消息数 */}
          {this.context.tabName === 'message' ? this.renderBadgeView(unreadMsgCount) : null}
          
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

IconWithBar.propTypes = {
  label: React.PropTypes.string,
  type: React.PropTypes.string,
  from: React.PropTypes.string,
  size: React.PropTypes.number,
  applyCount: React.PropTypes.number,
  unreadMsgCount: React.PropTypes.number,
  iconStyle: React.PropTypes.any,
  onActiveColor: React.PropTypes.string,
  onInactiveColor: React.PropTypes.string,
  onActiveColorBar: React.PropTypes.string,
  onInactiveColorBar: React.PropTypes.string
};

IconWithBar.defaultProps = {
  size: 20,
  applyCount: 0,
  unreadMsgCount: 0,
  onActiveColor: 'white',
  onInactiveColor: 'black',
  onActiveColorBar: 'red',
  onInactiveColorBar: 'gray'
};

IconWithBar.contextTypes = {
  tabName: React.PropTypes.string,
  gotoTab: React.PropTypes.func
};

export default extendRawIcon(IconWithBar);
