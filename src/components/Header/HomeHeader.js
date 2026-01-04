/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import colors from '../../constants/colors';

class HomeHeader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {navigation} = this.props;
    // console.log('====================================');
    // console.log({navigation: navigation});
    // console.log('====================================');
    return (
      <View style={{height: 45, width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroudColor}}>
        <TouchableOpacity
          onPress={() => {
            navigation?.openDrawer && navigation.openDrawer();
          }}
          style={{justifyContent: 'center', alignItems: 'center', height: 50, width: 60}}>
          <Image style={{height: 14, width: 14}} source={require('../../../assets/icons/sideMenu/toggle_icon.png')} />
        </TouchableOpacity>
        <Image style={{height: 25, width: 25}} source={require('../../../assets/logo_sidebar.png')} />
        <Text style={{color: '#fff', paddingLeft: 15, fontSize: 20}}>Freizeit Media</Text>
       
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Search')} style={{position: 'absolute', right: 20}}>
          <Image style={{height: 18, width: 18}} source={require('../../../assets/icons/sideMenu/search_icon.png')} />
        </TouchableOpacity>
      </View>
    );
  }
}

export default HomeHeader;
