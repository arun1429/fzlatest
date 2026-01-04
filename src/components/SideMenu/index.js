/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {View, SafeAreaView, TouchableOpacity, FlatList, Text, Image} from 'react-native';
import {hideNavigationBar} from 'react-native-navigation-bar-color';
import FastImage from 'react-native-fast-image';
import {Col, Row, Grid} from 'react-native-easy-grid';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {userInfo, loginToken} from '../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';
import {ActionSheet} from 'native-base';
import colors from '../../constants/colors';

const myData = [
  {id: 1, name: 'Home', imagePath: require('../../../assets/icons/Drawer/home.png'), tittle: 'HomeBottomScreen'},
  {id: 2, name: 'Wishlist', imagePath: require('../../../assets/icons/Drawer/love.png'), tittle: 'WishlistDraw'},
  {id: 3, name: 'My Order', imagePath: require('../../../assets/icons/Drawer/order-food.png'), tittle: 'OrderDraw'},
  {id: 4, name: 'Genres', imagePath: require('../../../assets/icons/Drawer/clapperboard.png'), tittle: 'MoviesDraw'},
  {id: 5, name: 'Languages', imagePath: require('../../../assets/icons/Drawer/translate.png'), tittle: 'LanguageDraw'},
  {id: 6, name: 'Privacy', imagePath: require('../../../assets/icons/Drawer/privacy.png'), tittle: 'PrivacyDraw'},
  {id: 7, name: 'Help', imagePath: require('../../../assets/icons/Drawer/help2.png'), tittle: 'HelpDraw'},
];

class SideMenu extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    // hideNavigationBar();
    // console.log('User data from redux >>', this.props.info);
  };

  closeDrawer = item => {
    // this.props.navigation.closeDrawer();
    this.props.navigation.navigate(item.tittle, {header_Show: 'Show'});
  };
  closeDrawer2 = () => {
    // this.props.navigation.dispatch(DrawerActions.toggleDrawer());
    this.props.navigation.navigate('Signin');
  };

  gotoProfile = () => {
    this.props.navigation.navigate('Profile', {auth: true});
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.backgroudColor}}>
        {this.props?.info?.name ? (
          <TouchableOpacity onPress={() => this.gotoProfile()} style={{flexDirection: 'row', padding: 15, alignItems: 'center', marginTop: 50, marginBottom: 30}}>
            <FontAwesome name={'user-circle-o'} color={'#fff'} size={30} />
            <Text style={{color: '#fff', fontSize: 14, paddingLeft: 15}}>{this.props?.info?.name}</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <TouchableOpacity
              onPress={() => this.closeDrawer2()}
              style={{
                backgroundColor: '#fff',
                width: '90%',
                padding: 10,
                marginLeft: 15,
                borderRadius: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 50,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome name={'user-circle-o'} color={colors.black} size={30} />
                <View style={{marginLeft: 15}}>
                  <Text style={{color: colors.black}}>Login</Text>
                  <Text style={{color: colors.black}}>For a better experience</Text>
                </View>
              </View>
              <FontAwesome name={'angle-right'} color={colors.black} size={30} />
            </TouchableOpacity>
          </View>
        )}
        <FlatList
          data={myData}
          // keyExtractor={(index, item) => String(index)}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => this.closeDrawer(item)} key={item.id} style={{flex: 1, flexDirection: 'row', padding: 15, alignItems: 'center', borderBottomWidth: 0.3, borderColor: '#fff', width: '90%', alignSelf: 'center'}}>
              <Image style={{height: 14, width: 14, tintColor: '#ffffff'}} source={item.imagePath} resizeMode={'contain'} />
              <Text style={{color: '#fff', fontSize: 14, marginLeft: 20}}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
      // <Grid style={styles.bgColor}>
      //     <Col size={1} style={styles.header}>
      //         <TouchableOpacity onPress={() => props.active == undefined ? props.navigation.closeDrawer(): props.navigation.navigate("Home")}>
      //             <FastImage
      //                             style={styles.logo}
      //                             source={require('../../../assets/logo_sidebar.png')}
      //                             resizeMode={FastImage.resizeMode.contain}
      //             />
      //         </TouchableOpacity>
      //     </Col>
      //     <Row size={6} style={styles.container}>
      //         <SafeAreaView style={styles.content}>
      //             <TouchableOpacity onPress={() => props.navigation.navigate("Home")}>
      //                 <View style={[styles.iconContainer, props.active == undefined ? styles.toggleContainer : null ]}>
      //                     <FastImage
      //                             style={ props.active == undefined ? styles.activeIcon : styles.icon }
      //                             source={require('../../../assets/icons/sideMenu/home_icon.png')}
      //                             resizeMode={FastImage.resizeMode.contain}
      //                     />
      //                 </View>
      //             </TouchableOpacity>
      //             <TouchableOpacity onPress={() => props.navigation.navigate("Search")}>
      //                 <View style={[styles.iconContainer, props.active == "search" ? styles.toggleContainer : null ]}>
      //                     <FastImage
      //                             style={ props.active == "search" ? styles.activeIcon : styles.icon }
      //                             source={require('../../../assets/icons/sideMenu/search_icon.png')}
      //                             resizeMode={FastImage.resizeMode.contain}
      //                     />
      //                 </View>
      //             </TouchableOpacity>
      //             <TouchableOpacity onPress={() => props.navigation.navigate("Wishlist")}>
      //                 <View style={[styles.iconContainer, props.active == "wishlist" ? styles.toggleContainer : null ]}>
      //                     <FastImage
      //                             style={ props.active == "wishlist" ? styles.activeIcon : styles.icon }
      //                             source={require('../../../assets/icons/sideMenu/myList_icon.png')}
      //                             resizeMode={FastImage.resizeMode.contain}
      //                     />
      //                 </View>
      //             </TouchableOpacity>
      //             <TouchableOpacity  onPress={() => props.navigation.navigate("Download")}>
      //                 <View style={[styles.iconContainer, props.active == "download" ? styles.toggleContainer : null ]}>
      //                     <FastImage
      //                             style={ props.active == "download" ? styles.activeIcon : styles.icon }
      //                             source={require('../../../assets/icons/sideMenu/download_icon.png')}
      //                             resizeMode={FastImage.resizeMode.contain}
      //                     />
      //                 </View>
      //             </TouchableOpacity>
      //             <TouchableOpacity  onPress={() => props.navigation.navigate("More")}>
      //                 <View style={styles.iconContainer}>
      //                     <FastImage
      //                             style={styles.icon}
      //                             source={require('../../../assets/icons/sideMenu/toggle_icon.png')}
      //                             resizeMode={FastImage.resizeMode.contain}
      //                     />
      //                 </View>
      //             </TouchableOpacity>
      //         </SafeAreaView>
      //     </Row>
      // </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    info: state.info,
  };
};

export default connect(mapStateToProps)(SideMenu);
