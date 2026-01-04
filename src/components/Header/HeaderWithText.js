import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

class HeaderWithTittle extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{ height: 50, width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroudColor }}>
                <TouchableOpacity
                    style={{ justifyContent: 'center', alignItems: 'center', height: 50, width: 60 }}
                    onPress={() => this.props?.isPop ? this.props.navigation.popToTop() : this.props.navigation.goBack()} >
                    <Image
                        source={require('../../components/images/left.png')}
                        style={{ height: 25, width: 25, tintColor: "#fff", }} />
                </TouchableOpacity>
                <Text ellipsizeMode='tail' numberOfLines={1} style={{ color: "#fff", paddingLeft: 15, fontSize: 20, width: "65%" }}>{this.props.name}</Text>
                <TouchableOpacity
                    //  onPress={() => this.props.navigation.openDrawer()}
                    onPress={() => this.props.navigation.navigate("Search")}
                    style={{ position: 'absolute', right: 20 }}>
                    <Image style={{ height: 20, width: 20, }}
                        source={require('../../../assets/icons/sideMenu/search_icon.png')} />
                </TouchableOpacity>
            </View>
        )
    }
}

export default HeaderWithTittle;