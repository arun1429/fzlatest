import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Keyboard, Button, TextInput, Alert, Platform} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Icon} from 'native-base';
import FastImage from 'react-native-fast-image';
import Orientation from 'react-native-orientation';
import NetInfo from '@react-native-community/netinfo';
import {EventRegister} from 'react-native-event-listeners';

//API
import HttpRequest from '../../utils/HTTPRequest';
//Redux
import {connect} from 'react-redux';
import {userInfo, loginToken} from '../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';
//components
import BottomLine from '../../components/BottomHorizontalLine/';
import StatusBar from '../../components/StatusBar/';
import Alerts from '../../components/Alerts/';
//style
import styles from './styles';

const drawerImage = require('../../../assets/default_user.png');

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      old_password: '',
      new_password: '',
      confirm_password: '',
      isNotify: false,
      title: '',
      subtitle: '',
      type: '',
      action: false,
      isConnected: false,
    };
  }
  componentDidMount() {
    EventRegister.emit('videoPaused', {
      isClosed: 'false',
    });
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
      }
    });

    // Unsubscribe
    unsubscribe();
  };

  // Update password Through Api
  onUpdatePressed = () => {
    this.setState({isLoading: true});
    Keyboard.dismiss();
    let {old_password, new_password, confirm_password} = this.state;

    const formData = {
      existingpassword: old_password,
      password: new_password,
      password_confirmation: confirm_password,
    };
    HttpRequest.updatePassword(formData, this.props.token)
      .then(res => {
        this.setState({isLoading: false});
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          this.notify('success', 'Great!', result.message, true);
        } else {
          console.log('Update Password API Error : ', result);
          this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, false);
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
        console.log('Update Password API Catch Exception: ', err);
        this.notify('danger', 'Oops!', 'Something Went Worng!', false);
      });
  };

  // Checking input Fields
  validate = () => {
    Keyboard.dismiss();
    if (this.state.old_password.length != 0 && (this.state.new_password.length >= 8 && this.state.new_password === this.state.confirm_password)) {
      // Calling the Function here
      this.onUpdatePressed();
    } else if (this.state.old_password.length == 0) {
      this.notify('danger', 'Oops!', 'Please provide your old password.', false);
    } else if (this.state.new_password.length == 0) {
      this.notify('danger', 'Oops!', 'Please provide your new password.', false);
    } else if (this.state.confirm_password.length == 0) {
      this.notify('danger', 'Oops!', 'Please confirm your new password.', false);
    } else if (this.state.new_password.length < 8) {
      this.notify('warning', 'Oops!', 'The new password must be at least 8 characters.', false);
    } else if (this.state.confirm_password.length < 8) {
      this.notify('warning', 'Oops!', 'The confirm password must be at least 8 characters.', false);
    } else if (this.state.new_password.length >= 8 && this.state.new_password !== this.state.confirm_password) {
      this.notify('warning', 'Oops!', 'The password did not match.', false);
    } else {
      this.notify('danger', 'Oops!', 'Something Went Worng!', false);
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
      title: '',
      subtitle: '',
      type: '',
      action: false,
    });
  }

  render() {
    const {isConnected, isLoading, isNotify, title, subtitle, type, action} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar />
        {isNotify && <Alerts show={true} type={type} title={title} subtitle={subtitle} navigation={this.props.navigation} action={action} onRef={ref => (this.parentReference = ref)} parentReference={this.updateNotify.bind(this)} />}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon type="AntDesign" name="close" style={{fontSize: 35, color: 'red'}} />
          </TouchableOpacity>
        </View>
        <FastImage style={styles.avatar} source={drawerImage} />
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.name} numberOfLines={1}>
              {this.props.info.name}
            </Text>
            <Text style={styles.info} numberOfLines={1}>
              {this.props.info.email}
            </Text>
          </View>
        </View>
        {/* <Animatable.View animation={'slideInUp'} style={styles.footer}>
                <View style={styles.items} >
                    <Text style={{flex:1,flexDirection:'row',height:'100%',color:'#000',opacity: 0.9}}>Old Password *</Text>
                    <TextInput 
                        placeholder='******' 
                        placeholderTextColor={'#000'}
                        style={{flex:1, width: '100%',color:'#000'}} 
                        secureTextEntry={true} 
                        onChangeText={(old_password) => (this.setState({ old_password }))}
                        value={this.state.old_password}/>
                </View>
                <View style={styles.items} >
                    <Text style={{flex:1,flexDirection:'row',height:'100%', color:'#000',opacity: 0.9}}>New Password *</Text>
                    <TextInput 
                        placeholder='******' 
                        placeholderTextColor={'#000'}
                        style={{flex:1, width: '100%',color:'#000'}} 
                        secureTextEntry={true} 
                        onChangeText={(new_password) => (this.setState({ new_password }))}
                        value={this.state.new_password}/>
                </View>
                <View style={styles.items} >
                    <Text style={{flex:1,flexDirection:'row',height:'100%',color:'#000',opacity: 0.9}}>Confirm Password *</Text>
                    <TextInput 
                        placeholder='******' 
                        placeholderTextColor={'#000'}
                        style={{flex:1, width: '100%',color:'#000'}} 
                        secureTextEntry={true} 
                        onChangeText={(confirm_password) => (this.setState({ confirm_password }))}
                        value={this.state.confirm_password}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button style={styles.updateBtn} raised={true} onPress={() => this.validate()} title={'UPDATE'} color="#ff0000" />
                </View>
            </Animatable.View> */}
      </View>
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
)(Profile);
