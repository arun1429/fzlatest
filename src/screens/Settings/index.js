import React, {Component} from 'react';
import {View, SafeAreaView, TouchableOpacity, Switch, Alert, Platform, Button, Text} from 'react-native';
import {Content, ListItem, Left, Icon, Body, Right} from 'native-base';
import RNPickerSelect from 'react-native-picker-select';
import * as Animatable from 'react-native-animatable';
import Orientation from 'react-native-orientation';
import NetInfo from '@react-native-community/netinfo';
import { Viewport } from '@skele/components';
//Local Storage
import LocalData from '../../utils/LocalData';
//Api
import HttpRequest from '../../utils/HTTPRequest';
//Redux
import {connect} from 'react-redux';
import {userInfo, loginToken, notification, wifiInfo} from '../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';
//Components
import StatusBar from '../../components/StatusBar/';
import Alerts from '../../components/Alerts/';
import Banner from '../../components/AdMob/Banner';
import withSequentialRendering from '../../components/withSequentialRendering';
//Style
import styles from './styles';

const SequentialBanner = withSequentialRendering(Banner);

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wifiOnly: 0,
      videoQuality: 2,
      isLoading: false,
      isNotify: false,
      title: '',
      subtitle: '',
      type: '',
      action: false,
      notification: 0,
      isConnected: false,
      wifiInfo: null,
    };
    this.inputRefs = {
      picker: null,
    };
  }
  componentDidMount() {
    Orientation.lockToPortrait();
    //Check internet connectivity
    this.checkNetworkConnectivity();
  }

  checkNetworkConnectivity = () => {
    // For Android devices
    if (Platform.OS === 'android') {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          Alert.alert('Network Error', `Failed to connect to Freizeit. Please check your device's network Connection.`, [
            {
              text: 'Cancel',
              onPress: () => {
                this.setState({
                  isConnected: false,
                });
              },
            },
            {
              text: 'Retry',
              onPress: () => {
                this.checkNetworkConnectivity();
              },
            },
          ]);
        } else {
          this.setState({
            isConnected: true,
          });
          this.getSettings();
        }
      });
    } else {
      // For iOS devices
      this.handleFirstConnectivityChange();
    }
  };

  handleFirstConnectivityChange = () => {
    // Subscribe
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        Alert.alert('Network Error', `Failed to connect to Freizeit. Please check your device's network Connection.`, [
          {
            text: 'Cancel',
            onPress: () => {
              this.setState({
                isConnected: false,
              });
            },
          },
          {
            text: 'Retry',
            onPress: () => {
              this.checkNetworkConnectivity();
            },
          },
        ]);
      } else {
        this.setState({
          isConnected: true,
        });
        this.getSettings();
      }
    });

    // Unsubscribe
    unsubscribe();
  };

  _switched() {
    let status;
    const {videoQuality, notification} = this.state;
    if (this.state.wifiOnly) {
      status = 0;
    } else {
      status = 1;
    }
    this.setState({
      wifiOnly: status,
    });
    this.onUpdate(status, videoQuality, notification);
  }

//   _toggleNotifications() {
//     let notificationStatus;
//     const {wifiOnly, videoQuality} = this.state;

//     if (this.state.notification == 1) {
//       notificationStatus = 0;
//     } else {
//       notificationStatus = 1;
//     }
//     this.setState({
//       notification: notificationStatus,
//     });
//     this.firebaseUpdate(notificationStatus);
//     LocalData.setNotification(notificationStatus);
//     this.props.notification(notificationStatus);
//     this.onUpdate(wifiOnly, videoQuality, notificationStatus);
//   }

  onPickerValueChange = (value, index) => {
    const {videoQuality, notification} = this.state;
    if (videoQuality != value) {
      this.setState({videoQuality: value});
      this.inputRefs.picker.togglePicker();
      this.onUpdate(this.state.wifiOnly, value, notification);
    }
  };

  open() {
    this.inputRefs.picker.togglePicker();
  }

  //Get All setting Details
  getSettings = () => {
    this.setState({isLoading: false});
    if (this.props.token !== '') {
      HttpRequest.getSettings(this.props.token)
        .then(res => {
          this.setState({isLoading: true});
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            this.props.wifiInfo(result.wifi);
            this.setState({
              wifiOnly: result.wifi,
              videoQuality: result.video_quality,
              notification: result.notification,
            });
            // console.log("Settings",result)
          } else {
            this.setState({isLoading: true});
            console.log('Setting Detail API Error : ', result);
            // this.notify('danger','Oops!',result.message != undefined ? result.message : result.status,result.message != undefined ? false : true);
          }
        })
        .catch(err => {
          this.setState({isLoading: false});
          console.log('Setting Detail API Catch Exception: ', err);
          // this.notify('danger','Oops!','Something Went Worng!', false);
        });
    } else {
      this.setState({isLoading: false});
      console.log('Setting Details Error: Token not found');
      // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
    }
  };

  // Function for updating the settings using API
  onUpdate = (wifiOnly, videoQuality, notification) => {
    this.setState({isLoading: true, notify: false});
    if (this.props.token !== '') {
      HttpRequest.updateSettings(this.props.token, {wifi: wifiOnly, video_quality: videoQuality, notification: notification})
        .then(res => {
          this.setState({isLoading: false});
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            // this.notify('success','Good Job!',result.message, false);
            this.props.wifiInfo(wifiOnly);
            // console.log('Settings Updated',result )
          } else {
            console.log('Update Setting API Error : ', result);
            // this.notify('danger','Oops!',result.message != undefined ? result.message : result.status, false);
          }
        })
        .catch(err => {
          this.setState({isLoading: false});
          console.log('Update Setting API Catch Exception: ', err);
          // this.notify('danger','Oops!','Something Went Worng!', false);
        });
    } else {
      this.setState({isLoading: false});
      console.log('Update Setting Error: Token not found');
      // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
    }
  };

  //Delete All Downloads
  deleteAllDownloads = () => {
    this.setState({isLoading: false});
    if (this.props.token !== '') {
      HttpRequest.deleteAllDownloads(this.props.token)
        .then(res => {
          this.setState({isLoading: true});
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            LocalData.setDownloads('');
            this.notify('success', 'Good Job!', 'All downloads deleted successfully.', false);
          } else {
            this.setState({isLoading: true});
            console.log('Delete All Downloads API Error : ', result);
            if (result.message != 'Operation Failed. Try again.') {
              this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, result.message != undefined ? false : true);
            } else {
              this.notify('danger', 'Oops!', result.status, true);
            }
          }
        })
        .catch(err => {
          this.setState({isLoading: false});
          console.log('Delete All Downloads API Catch Exception: ', err);
          this.notify('danger', 'Oops!', 'Something Went Worng!', false);
        });
    } else {
      this.setState({isLoading: false, details: {}});
      console.log('Delete All Downloads Error: Token not found');
      this.notify('danger', 'Oops!', 'We are unable to process your request at the moment! Please try again later.', false);
    }
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

  //Notification Updates
//   firebaseUpdate = async notification => {
//     if (notification == 1) {
//       messaging()
//         .subscribeToTopic('updates')
//         .then(() => console.log('Subscribed to topics!'));
//     } else {
//       messaging()
//         .unsubscribeFromTopic('updates')
//         .then(() => console.log('Unsubscribed fom the topic!'));
//     }
//   };

  render() {
    const {isConnected, isNotify, title, subtitle, type, action} = this.state;

    return (
      <View style={styles.container}>
        <StatusBar translucent={true} barStyle="light-content"/>
        {isNotify && <Alerts show={true} type={type} title={title} subtitle={subtitle} navigation={this.props.navigation} action={action} onRef={ref => (this.parentReference = ref)} parentReference={this.updateNotify.bind(this)} />}
        <SafeAreaView style={styles.rightContainer}>
          <View style={styles.marginContainer}>
            <Animatable.View animation={'slideInRight'} delay={2} style={styles.resultContainer}>
              {!isConnected && (
                <View style={[{flexGrow: 1, flexDirection: 'column'}, styles.noResultContainer]}>
                  <Text style={{fontSize: 16, fontWeight: '600', color: '#fff', textAlign: 'center', margin: '5%'}}>There is a problem connecting to Freizeit. Please Try again later.</Text>
                  <Button title="Retry" color="#191a1f" onPress={() => this.checkNetworkConnectivity()} />
                </View>
              )}
              {isConnected && (
                <View style={styles.foundResultContainer}>
                  <View style={[styles.row, {justifyContent: 'space-between'}]}>
                    <Text style={styles.thumbnailHeader}>App Settings</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                      <Icon type="AntDesign" name="close" style={{fontSize: 18, color: 'red', alignSelf: 'flex-end', marginRight: 10}} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {isConnected && (
                <Viewport.Tracker>
                <Content>
                  <View nobordered style={styles.separatorBackground}>
                    <Text style={styles.seperatorText}>Accounts</Text>
                  </View>
                  <ListItem icon noBorder style={styles.items} onPress={() => this.props.navigation.navigate('Profile')}>
                    <Left>
                      <Icon type="AntDesign" name="user" style={{fontSize: 18, color: '#fff'}} />
                    </Left>
                    <Body>
                      <Text style={styles.label}>Email</Text>
                      <Text style={styles.label} note>
                        {this.props.info.name}
                      </Text>
                    </Body>
                    <Right>
                      <Icon type="MaterialIcons" name="navigate-next" style={{fontSize: 28, color: '#fff'}} />
                    </Right>
                  </ListItem>
                  <SequentialBanner />
                  <View nobordered style={styles.separatorBackground}>
                    <Text style={styles.seperatorText}>Download</Text>
                  </View>
                  <ListItem icon noBorder style={styles.items}>
                    <Left>
                      <Icon type="AntDesign" name="user" style={{fontSize: 18, color: '#fff'}} />
                    </Left>
                    <Body>
                      <Text style={styles.label}>Wifi / celluer</Text>
                    </Body>
                    <Right>
                      <Switch trackColor={{true: 'red', false: 'grey'}} thumbColor={'#fff'} value={this.state.wifiOnly == 0 ? false : true} onChange={() => this._switched()} />
                    </Right>
                  </ListItem>
                  <View style={styles.separator}></View>
                  <ListItem icon noBorder style={styles.items}>
                    <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() => {
                        this.open();
                      }}>
                      <Left>
                        <Icon type="FontAwesome" name="video-camera" style={{fontSize: 18, color: '#fff'}} />
                      </Left>
                      <Body>
                        <Text style={styles.label}>Video Quality</Text>
                        <RNPickerSelect
                          ref={el => {
                            this.inputRefs.picker = el;
                          }}
                          useNativeAndroidPickerStyle={false}
                          style={{inputIOS: {color: 'white', fontSize: 10, paddingVertical: 2}, inputAndroid: {color: 'white', fontSize: 10, paddingVertical: 0}}}
                          placeholder={{}}
                          onValueChange={(value, index) => this.onPickerValueChange(value, index)}
                          value={this.state.videoQuality}
                          items={[
                            {key: 1, label: 'Low', value: 0},
                            {Key: 2, label: 'Medium', value: 1},
                            {Key: 3, label: 'High', value: 2},
                          ]}
                        />
                      </Body>
                      <Right>
                        <Icon type="MaterialIcons" name="navigate-next" style={{fontSize: 28, color: '#fff'}} />
                      </Right>
                    </TouchableOpacity>
                  </ListItem>
                  <View style={styles.separator}></View>
                  <ListItem icon noBorder style={styles.items}>
                    <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() => {
                        this.deleteAllDownloads();
                      }}>
                      <Left>
                        <Icon type="EvilIcons" name="trash" style={{fontSize: 18, color: '#fff'}} />
                      </Left>
                      <Body>
                        <Text style={styles.label}>Delete All Download</Text>
                      </Body>
                    </TouchableOpacity>
                  </ListItem>
                  <View style={styles.separator}></View>
                  <ListItem icon noBorder style={styles.items}>
                    <Left>
                      <Icon type="MaterialIcons" name="notifications" style={{fontSize: 18, color: '#fff'}} />
                    </Left>
                    <Body>
                      <Text style={styles.label}>Allow Notifications</Text>
                    </Body>
                    <Right>
                      <Switch trackColor={{true: 'red', false: 'grey'}} thumbColor={'#fff'} value={this.state.notification == 0 ? false : true} onChange={() => console.log('this._toggleNotifications()')} />
                    </Right>
                  </ListItem>
                  <SequentialBanner />
                  <View nobordered style={styles.separatorBackground}>
                    <Text style={styles.seperatorText}>About</Text>
                  </View>
                  <ListItem icon noBorder style={styles.items} onPress={() => this.props.navigation.navigate('Help', {auth: true})}>
                    <Left>
                      <Icon type="Feather" name="help-circle" style={{fontSize: 18, color: '#fff'}} />
                    </Left>
                    <Body>
                      <Text style={styles.label}>Help Center</Text>
                    </Body>
                  </ListItem>
                  <View style={styles.separator}></View>
                  <ListItem icon noBorder style={styles.items} onPress={() => this.props.navigation.navigate('Privacy', {auth: true})}>
                    <Left>
                      <Icon type="AntDesign" name="infocirlceo" style={{fontSize: 18, color: '#fff'}} />
                    </Left>
                    <Body>
                      <Text style={styles.label}>Privacy Policy</Text>
                    </Body>
                  </ListItem>
                  <View style={styles.separator}></View>
                  <ListItem icon noBorder style={styles.items} onPress={() => this.props.navigation.navigate('TermsConditions', {auth: true})}>
                    <Left>
                      <Icon type="SimpleLineIcons" name="doc" style={{fontSize: 18, color: '#fff'}} />
                    </Left>
                    <Body>
                      <Text style={styles.label}>Terms & Conditions</Text>
                    </Body>
                  </ListItem>
                  <SequentialBanner />
                </Content>
                </Viewport.Tracker>
              )}
            </Animatable.View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    info: state.info,
    token: state.token,
    notification: state.notification,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userInfo: bindActionCreators(userInfo, dispatch),
    loginToken: bindActionCreators(loginToken, dispatch),
    notification: bindActionCreators(notification, dispatch),
    wifiInfo: bindActionCreators(wifiInfo, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
