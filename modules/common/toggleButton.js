/**
 * 选择推荐人
 */
'use strict';

import React, {
    Component,
    StyleSheet,
    View,
    Text,
    PixelRatio,
} from 'react-native';

class ToggleButtonComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0,
        }
    }

    onButtonPressed() {
        this.props.onChoseButton(!this.state.active);
        this.setState({active : !this.state.active});
    }

    render(){
        var selected = this.props.defaultStyle,
            selectedText = this.props.defaultTextStyle;
        if(this.state.active){
            selected = this.props.selectedStyle;
            selectedText = this.props.selectedTextStyle;
        }
        return(
            <View style={selected}>
                <Text style={selectedText} onPress={this.onButtonPressed.bind(this)}>{this.props.buttonText}</Text>
            </View>
        )
    };
}

module.exports = ToggleButtonComp;