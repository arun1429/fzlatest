import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  NativeModules,

  Linking,
  AppState
} from 'react-native';
// import * as Animatable from 'react-native-animatable';
import {Icon } from 'native-base';
import FastImage from 'react-native-fast-image';
// import Carousel from 'react-native-snap-carousel';
// import Orientation from 'react-native-orientation';
// import NetInfo from "@react-native-community/netinfo";
// import { animatedStyles } from '../../utils/animations';
// //API
// import HttpRequest from '../../utils/HTTPRequest';
//Redux
import { connect } from 'react-redux';
import { userInfo, loginToken } from '../../Redux/Actions/Actions';
import { bindActionCreators } from 'redux';

//style
import styles from './styles'

const headerImage = require("../../../assets/img/subscription/subscription.png");
// const deviceWidth = Dimensions.get('window').width;
// const data = [{
//   "key": 1,
//   "name": "1 Month",
//   "cost": "$200",
// },
// {
//   "key": 2,
//   "name": "6 Months",
//   "cost": "$1400",
// },
// {
//   "key": 3,
//   "name": "1 Year",
//   "cost": "$2250",
// }];

class Subscriptions extends Component {
    constructor(props){
        super(props);
        this.state = {
          active: 1,
          appState: AppState.currentState,
      }
    }

    componentDidMount = () => {
      this.appStateSubscription = AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount(){
      this.appStateSubscription.remove();
    }

    //Handle App State Foreground/Background
    _handleAppStateChange = (nextAppState) => {
      if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
        NativeModules.DevSettings.reload();
      } else {
        NativeModules.DevSettings.reload();
      }
  }

    openSubscription = () => {
      Linking.canOpenURL('https://fz.freizeitmedia.com/signin').then(supported => {
        if (supported) {
          Linking.openURL('https://fz.freizeitmedia.com/signin');
        } else {
          console.log("Don't know how to open URI: https://fz.freizeitmedia.com/signin");
        }
      });
    }
   
    render() {
    let { active } = this.state;
    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <FastImage
              style={styles.headerImage}
              source={headerImage}
              resizeMode={FastImage.resizeMode.cover}
            />
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}  style={styles.backButton}>
            <Icon type= "AntDesign" name='close'style={{fontSize: 35, color: 'white'}}  />
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <View style={styles.pricingContainer}>
                <View style={styles.pricingBoxView}>
                  {/* <View style={styles.pricingBoxHeader}>
                    <Text style={{fontWeight:'bold', color:'#fff'}}>QUATERLY</Text>
                  </View> */}
                  <View style={styles.pricingBoxFooter}>
                    <Text style={{ fontSize: 30, alignSelf:'flex-start', fontWeight: '300'}}>₹</Text>
                    <Text style={{ fontSize: 40,fontWeight: 'bold'}}>49</Text>
                    <Text style={{ fontSize: 20, alignSelf:'center'}}> every 3 months</Text>
                  </View>
                  <View style={styles.pricingBoxFooter}>
                    <Text style={{ fontSize: 16, fontWeight: '400' }}>Charged Quaterly</Text>
                    <Text style={{ fontSize: 16, fontWeight: '400' }}> | Non-refundable</Text>
                  </View>
                </View>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>
                Upgrade to unlock all the Premium content without Ads and download to watch offline.
              </Text>
              <TouchableOpacity style={styles.paySubscription} onPress={this.openSubscription}>
                <Text style={styles.payText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    );
    }
}

const mapStateToProps = (state) => {
    return {
      info: state.info,
      token: state.token
    };
}
  
const mapDispatchToProps = (dispatch) => {
    return {
      userInfo: bindActionCreators(userInfo, dispatch),
      loginToken: bindActionCreators(loginToken , dispatch),
    };
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions);
  
