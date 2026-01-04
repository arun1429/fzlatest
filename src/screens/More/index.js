import React, {Component} from 'react';
import {View, Image, Alert, ScrollView, Share, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Content, List, Header, Body, ListItem, Container, Left, Icon, Text, Button, Footer} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {hideNavigationBar} from 'react-native-navigation-bar-color';
import {EventRegister} from 'react-native-event-listeners';

//API
import HttpRequest from '../../utils/HTTPRequest';
import LocalData from '../../utils/LocalData';
//Redux
import {connect} from 'react-redux';
import {userInfo, loginToken} from '../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';
//Components
import StatusBar from '../../components/StatusBar/';
//Styles
import styles from './styles';
import HomeHeader from '../../components/Header/HomeHeader';
import colors from '../../constants/colors';
import {SafeAreaView} from 'react-native-safe-area-context';

const drawerImage = require('../../../assets/default_user.png');
const drawerLogo = require('../../../assets/img/logo/signInLogo.png');

const data = [
  // {
  //   id: 1,
  //   name: "PROFILE",
  //   route: "Profile",
  //   icon: "person-add",
  //   type: "Ionicons",
  //   bg: "#C5F442",
  // },
  {
    id: 2,
    name: 'WISHLIST',
    route: 'Wishlist',
    icon: 'favorite',
    type: 'MaterialIcons',
    bg: '#DA4437',
  },
  {
    id: 3,
    name: 'DOWNLOAD',
    route: 'Download',
    icon: 'download',
    type: 'Ionicons',
    bg: '#1EBC7C',
  },
  {
    id: 4,
    name: 'SETTINGS',
    route: 'Settings',
    icon: 'player-settings',
    type: 'Fontisto',
    bg: '#4DCAE0',
  },
  {
    id: 5,
    name: 'HELP',
    route: 'Help',
    icon: 'help-circle-outline',
    image: require('../../../assets/icons/help.png'),
    type: 'Ionicons',
    bg: '#4DCAE0',
  },
  {
    id: 6,
    name: 'PRIVACY',
    route: 'Privacy',
    icon: 'information-circle-outline',
    image: require('../../../assets/icons/privacy.png'),
    type: 'Ionicons',
    bg: '#EB6B23',
    text: 'v0.1',
  },
  {
    id: 7,
    name: 'CONNECT TV',
    route: 'ConnectDevices',
    icon: 'devices',
    // image: require('../../../assets/icons/privacy.png'),
    type: 'MaterialIcons',
    bg: '#EB6B23',
    // text: 'v0.1',
  },
  // {
  //   id: 7,
  //   name: "SUBSCRIPTION",
  //   route: "Subscriptions",
  //   icon: "information-circle-outline",
  //   image: require('../../../assets/icons/privacy.png'),
  //   type: "Ionicons",
  //   bg: "#EB6B23",
  //   text: "v0.1"
  // },
];
const datas = [
  // {
  //   id: 1,
  //   name: "PROFILE",
  //   route: "Profile",
  //   icon: "person-add",
  //   type: "Ionicons",
  //   bg: "#C5F442",
  // },
  {
    id: 2,
    name: 'WISHLIST',
    route: 'Wishlist',
    icon: 'favorite',
    type: 'MaterialIcons',
    bg: '#DA4437',
  },
  {
    id: 3,
    name: 'DOWNLOAD',
    route: 'Download',
    icon: 'download',
    type: 'Ionicons',
    bg: '#1EBC7C',
  },
  {
    id: 4,
    name: 'SETTINGS',
    route: 'Settings',
    icon: 'player-settings',
    type: 'Fontisto',
    bg: '#4DCAE0',
  },
  {
    id: 5,
    name: 'HELP',
    route: 'Help',
    icon: 'help-circle-outline',
    image: require('../../../assets/icons/help.png'),
    type: 'Ionicons',
    bg: '#4DCAE0',
  },
  {
    id: 6,
    name: 'PRIVACY',
    route: 'Privacy',
    icon: 'information-circle-outline',
    image: require('../../../assets/icons/privacy.png'),
    type: 'Ionicons',
    bg: '#EB6B23',
    text: 'v0.1',
  },
  // {
  //   id: 7,
  //   name: "SUBSCRIPTION",
  //   route: "Subscriptions",
  //   icon: "information-circle-outline",
  //   image: require('../../../assets/icons/privacy.png'),
  //   type: "Ionicons",
  //   bg: "#EB6B23",
  //   text: "v0.1"
  // },
];

class More extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // shadowOffsetWidth: 1,
      // shadowRadius: 4
    };
  }

  componentDidMount = () => {
    EventRegister.emit('videoPaused', {
      isClosed: 'false',
    });
    // hideNavigationBar();
  };

  logout = () => {
    Alert.alert('Log Out', 'Are you sure you want to logout?', [
      {text: 'Cancel'},
      {
        text: 'Logout',
        onPress: () => {
          this.logoutAPI();
        },
      },
    ]);
  };

  logoutAPI = () => {
    if (this.props.token !== '') {
      HttpRequest.logout(this.props.token)
        .then(res => {
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            LocalData.setLoginToken('');
            this.props.loginToken('');
            LocalData.setUserInfo(null).then(() => {
              // this.props.userInfo({});

              this.props.navigation.navigate('Signin');
            });
          } else {
            alert('Oops!!Unable to Logout.');
          }
        })
        .catch(err => {
          console.log(err);
          alert('Oops!!Unable to Logout.');
        });
    } else {
      alert('Oops!!Unable to Logout.');
    }
  };

  referAFriend = () => {
    // let id = this.state.itemData.custom_attributes[2].value;
    let link = Platform.OS == 'android' ? 'https://play.google.com/store/apps/details?id=com.freizeitMedia&hl=en_US' : 'https://apps.apple.com/in/app/freizeit-media/id1529561669';
    Share.share({
      message: 'Hy! Have you seen this Freizeit App yet? ' + link,
    })
      .then(result => console.log(result))
      .catch(errorMsg => console.log(errorMsg));
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.backgroudColor}}>
        <HomeHeader {...this.props} />
        <View style={{flex: 1, backgroundColor: colors.backgroudColor}}>
          <View style={styles.container}>
            <StatusBar hidden={false} />
            {/* <Header style={styles.drawerHeader} transparent>
            <View style={{flex:1,justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
                <Body>
                    <FastImage
                      style={styles.customerPicture}
                      source={drawerImage}
                    />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerText}>{this.props.info.name }</Text>
                    </View>
                </Body>
            </View>
            <View style={{flexDirection:'row',alignSelf:'flex-start'}}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.removeView}>
                <Icon type= "AntDesign" name='close'style={{fontSize: 35, color: 'red'}}  />
                </TouchableOpacity>
            </View>
          </Header> */}
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
              <Header style={styles.drawerHeader}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
                  <Body>
                    <FastImage style={styles.customerPicture} source={drawerImage} />
                    <View style={styles.headerTextContainer}>
                      <Text style={styles.headerText}>{this.props.info.name}</Text>
                    </View>
                  </Body>
                </View>
                {/* <View style={{flexDirection:'row',alignSelf:'flex-start'}}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.removeView}>
                <Icon type= "AntDesign" name='close'style={{fontSize: 35, color: 'red'}}  />
                </TouchableOpacity>
            </View> */}
              </Header>
              {this.props.token !== '' ? (
                <View style={styles.footerLeftView}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', {auth: true})} style={{alignItems: 'center', flexDirection: 'row', marginLeft: 13}}>
                    <Icon active type={'Ionicons'} name={'person-add'} style={styles.Icon} />
                    <Text style={[styles.text, {fontSize: Platform.OS === 'android' ? 15 : 20}]}>PROFILE</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <List
                bordered
                // _keyExtractor = { (data, index) => 'Key'+index.toString()}
                dataArray={!this.props.token ? datas : data}
                renderRow={data => (
                  <ListItem key={'Key' + data.id.toString()} noBorder style={styles.items} onPress={() => this.props.navigation.navigate(data.route, {auth: true})}>
                    <Left style={styles.leftContainer}>
                      {!data.image && <Icon type={data.type} name={data.icon} style={styles.Icon} />}
                      {data.image && <Image active source={data.image} style={styles.ImageIcon} />}
                      <Text style={styles.text}>{data.name}</Text>
                    </Left>
                    {data.text && !data.badge && <Text style={{color: '#fff'}}>{data.text}</Text>}
                  </ListItem>
                )}
              />
              <Content contentContainerStyle={{backgroundColor: colors.backgroudColor}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '5%'}}>
                  <Icon type={'FontAwesome'} name={'wechat'} style={styles.Icon22} />
                  <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>Tell Friends about Freizeit</Text>
                </View>
                <View style={styles.leftContainer}>
                  <Text style={styles.text}>Share the app so your friends can join the conversation around all your favourite TV shows and movies.</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10}}>
                  <Button bordered danger onPress={() => this.referAFriend()}>
                    <Text>Refer a friend</Text>
                  </Button>
                </View>
              </Content>
              <Content>
                <FastImage style={styles.contentPicture} source={drawerLogo} resizeMode={FastImage.resizeMode.contain} />
              </Content>
              {this.props.token !== '' ? (
                <Footer style={styles.footerContainer}>
                  <Left style={styles.footerLeftView}>
                    <TouchableOpacity style={styles.footerLeftView} onPress={() => this.logout()}>
                      <Icon active type={'Ionicons'} name={'log-out'} style={styles.Icon} />
                      <Text style={[styles.text, {fontSize: Platform.OS === 'android' ? 19 : 20}]}>LOGOUT</Text>
                    </TouchableOpacity>
                  </Left>
                </Footer>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    info: state.info,
    token: state.token,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userInfo: bindActionCreators(userInfo, dispatch),
    loginToken: bindActionCreators(loginToken, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(More);
