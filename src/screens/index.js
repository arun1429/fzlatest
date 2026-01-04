import React, {Component} from 'react';
import {View, Alert, Platform, Linking} from 'react-native';
//API
import GetLocation from 'react-native-get-location';
import Geocoder from 'react-native-geocoding';
import HttpRequest from '../utils/HTTPRequest';
//Local Async Storage
import LocalData from '../utils/LocalData';
//Redux
import {connect} from 'react-redux';
import {userInfo, loginToken} from '../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';
import messaging, {firebase} from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import Orientation from 'react-native-orientation';
import FastImage from 'react-native-fast-image';
import RNBootSplash from 'react-native-bootsplash';
//Components
import StatusBar from '../components/StatusBar/';
import Alerts from '../components/Alerts/';
//Styles
import styles from './styles';
import {EventRegister} from 'react-native-event-listeners';


class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNotify: false,
      title: '',
      subtitle: '',
      type: '',
      action: false,
      loaded: false,
      device_Name: '',
      address: '',
      lat: '',
      lng: '',
    };
  }

  componentDidMount = () => {
    console.log('IN SPLASH');
    Geocoder.init('AIzaSyBtVxQKIzdnxWOgUg4BOLTCWdYSWDAFIfk');
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log('current lat long', JSON.stringify(location));
        this._userInstallCheck(location);
        Geocoder.from(location.latitude, location.longitude)
          .then(json => {
            console.log('Geo Coder response ', location, json);
            var addressComponent = json.results[0].address_components[1].short_name + ', ' + json.results[0].address_components[5].short_name;
            console.log(addressComponent);
            this._userInstallCheck(location, addressComponent);
          })
          .catch(error => console.warn(JSON.stringify(error)));
      })
      .catch(error => {
        // this._userInstallCheck(location);
        const {code, message} = error;
        console.log('error msg', JSON.stringify(error));
        console.warn(code, message);
      });
    Orientation.lockToPortrait();
    RNBootSplash.hide();
    // this.firebaseAPI();
    // this._userInstallCheck();
    this.begin();
  };

  componentWillUnmount = () => {};

  _userInstallCheck = (location, address) => {
    console.log('Users address', location, address);
    DeviceInfo.getDeviceName().then(deviceName => {
      // console.log("name", deviceName)
      let deviceId = DeviceInfo.getUniqueId();
      const formData = {
        device_name: deviceName,
        device_id: deviceId,
        // address: ,
        // lat,
        // lng,
      };
      console.log('Checking API  formData : ', formData);

      HttpRequest.usersInstall(formData)
        .then(res => {
          // this.setState({ isLoading: false })
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            console.log('Check Data  ', result);
          } else {
            console.log('Signin API Error : ', result);
          }
        })
        .catch(err => {
          // this.setState({ isLoading: false })
          console.log(' USer Check  API Catch Exception: ', err);
          this.notify('danger', 'Oops!', 'Something Went Worng!', false);
        });
    });
  };

  begin = () => {
    setTimeout(() => {
      LocalData.getLoginToken().then(val => {
        if (val === null || val == '') {
          LocalData.getAlreadyLaunched().then(value => {
            if (value === null) {
              LocalData.setAlreadyLaunched('true').then(() => {
                this.checkNetworkConnectivity('Replace');
              });
            } else {
              this.checkNetworkConnectivity('Replace'); //Signin
            }
          });
        } else {
          LocalData.getUserInfo().then(info => {
            console.log('User Info', JSON.parse(info));
            this.props.userInfo(JSON.parse(info));
            this.props.loginToken(val);
            this.checkNetworkConnectivity('Replace');
          });
        }
      });
    }, 1500);
  };

  checkNetworkConnectivity = route => {
    // For Android devices
    if (Platform.OS === 'android') {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          console.log('You are online!');
          this.appMaintenanceCheck(route);
        } else {
          console.log('You are offline!');
          Alert.alert('Internet Connection!', 'Make sure you are connected to the internet', [
            {
              text: 'Ok',
              onPress: () => {
                Linking.openSettings();
              },
            },
          ]);
        }
      });
    } else {
      //For iOS devices
      this.handleFirstConnectivityChange(route);
    }
  };

  handleFirstConnectivityChange = route => {
    // Subscribe
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log('You are online!');
        this.appMaintenanceCheck(route);
      } else {
        console.log('You are offline!');
        Alert.alert('Internet Connection!', 'Make sure you are connected to the internet', [
          {
            text: 'Ok',
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]);
      }
    });

    // Unsubscribe
    unsubscribe();
  };

  appMaintenanceCheck = route => {
    HttpRequest.checkMaintenance()
      .then(res => {
        const result = res.data;
        if (res.status == 200 && result.error == 'false') {
          if (result.status == '1') {
            //App is Under Maintenance so navigate to Maintenance Screen
            console.log('App Under Maintenance');
            this.props.navigation.navigate('Maintenance');
          } else {
            //Check for App Version Update
            this.appVersionCheck(route);
          }
        } else {
          console.log('Check Maintenance API Error : ', result);
        }
      })
      .catch(err => {
        console.log('Check Maintenance API Catch Exception: ', err);
      });
  };

  appVersionCheck = route => {
    // let { Platform } = Platform.OS == "android" ? "0" : "1";
    let version = DeviceInfo.getVersion();
    HttpRequest.appVersionCheck({version: version, platform: Platform.OS === 'android' ? 0 : 1})
      .then(res => {
        const result = res.data;
        if (res.status == 200 && result.error == 'false') {
          if (result.status == '1') {
            if (result.platform == '0' && Platform.OS === 'android') {
              // Android Update Available
              this.notify('warning', 'Alert!', 'New update available. Please update the app via Play Store.', 'UPDATE');
            } else if (result.platform == '1' && Platform.OS === 'ios') {
              // IOS Update Available
              this.notify('warning', 'Alert!', 'New update available. Please update the app via App Store.', 'UPDATE');
            } else {
              // Android & IOS both Update Available
              this.notify('warning', 'Alert!', 'New update available. Please update the app from store.', 'UPDATE');
            }
            //Update Available on Store
          } else {
            //App Update Not Available
            if (this.state.loaded) {
              //Resume App Normally
              console.log('route : ' + route);
              if (route == 'Replace') {
                // this.props.navigation.navigate('App');
                EventRegister.emit('whatToDO', {
                  initialRouteName: 'Home',
                  useNavigation: 'App',
                });
              } else {
                this.props.navigation.replace(route);
              }
            }
          }
        } else {
          //   console.log("Check App Version API Error : ",result);
        }
      })
      .catch(err => {
        // console.log("Check App Version API Catch Exception: ",err);
      });
  };

  firebaseAPI = async () => {

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage.notification);
      remoteMessage.notification;
      // this.navigate(remoteMessage.data.type);
    });

    // Listen to notification messages while the app is in the foreground
    messaging().onMessage(async remoteMessage => {
      console.log('Notification Received:', JSON.stringify(remoteMessage));

      // Process the notification
      const notification = new firebase.notifications.Notification().setTitle(remoteMessage.notification.title).setBody(remoteMessage.notification.body).setData({
        type: remoteMessage.data.type,
      });

      firebase.notifications().displayNotification(notification);
    });

    messaging()
      .getInitialNotification()
      .then(initialNotification => {
        // console.log('====================================');
        // console.log({initialNotification});
        // console.log('====================================');
        if (initialNotification) {
          console.log('Notification caused app to open from quit state:', initialNotification.notification);
        }
      });
  };
  navigate = route => {
    LocalData.getLoginToken().then(val => {
      if (val === null || val == '') {
        this.props.navigation.replace('Signin');
      } else {
        LocalData.getUserInfo().then(info => {
          // console.log("User Info",JSON.parse(info));
          this.props.userInfo(JSON.parse(info));
          this.props.loginToken(val);
          this.props.navigation.navigate(route);
        });
      }
    });
  };

  //Notification Alerts Open
  notify = (type, title, subtitle, action) => {
    this.setState({
      isNotify: true,
      title: title,
      subtitle: subtitle,
      type: type,
      action: action,
    });
  };
  //Notification Alerts CLose
  updateNotify() {
    this.setState({
      isNotify: false,
    });
  }

  render() {
    const {isNotify, title, subtitle, type, action} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar />
        {isNotify && <Alerts show={true} type={type} title={title} subtitle={subtitle} navigation={this.props.navigation} action={action} onRef={ref => (this.parentReference = ref)} parentReference={this.updateNotify.bind(this)} />}
        <View style={styles.content}>
          <FastImage source={require('../../assets/animations/splash_1.gif')} style={styles.logo} resizeMode={FastImage.resizeMode.cover} onLoad={() => this.setState({loaded: true})} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  // console.log(`map state to props home `, state);
  return {
    token: state.token,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userInfo: bindActionCreators(userInfo, dispatch),
    loginToken: bindActionCreators(loginToken, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
