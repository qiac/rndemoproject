/**
 * 设置公用头部 - 回退按钮
 */

var React = require('react-native');
var {
    StyleSheet,
    View,
    Text
    } = React;

module.exports = React.createClass({
    render : function(){
        return(
            <View style={styles.container}>
                <View style={styles.go}></View>
            </View>
        )
    }
});

var styles = StyleSheet.create({
    container : {
        width : 60,
        height : 40,
        paddingLeft : 4,
        paddingTop : 12,
    },
    go : {
        width : 14,
        height : 14,
        borderLeftWidth : 2,
        borderBottomWidth : 2,
        borderColor : '#333',
        transform : [{rotate : '45deg'}]
    }
})