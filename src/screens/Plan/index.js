import React, {Component} from 'react';
import {Text, View, TouchableOpacity, NativeModules, Linking, AppState} from 'react-native';
// import * as Animatable from 'react-native-animatable';
import {Icon} from 'native-base';
import FastImage from 'react-native-fast-image';
import LocalData from '../../utils/LocalData';

// import Carousel from 'react-native-snap-carousel';
// import Orientation from 'react-native-orientation';
// import NetInfo from "@react-native-community/netinfo";
// import { animatedStyles } from '../../utils/animations';
// //API
// import HttpRequest from '../../utils/HTTPRequest';
//Redux
import {connect} from 'react-redux';
import {userInfo, loginToken} from '../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';

//style
import styles from './styles';

const headerImage = require('../../../assets/img/subscription/subscription.png');
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

class Plan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 1,
      appState: AppState.currentState,
      data: this.props.route?.params?.details,
      bundleData: [],
    };
  }

  componentDidMount = () => {
    console.log('Data', this.props.route?.params?.details);
    this.appStateSubscription = AppState.addEventListener('change', this._handleAppStateChange);
    this.readExclusive();
  };

  componentWillUnmount() {
    this.appStateSubscription.remove();
  }

  readExclusive = () => {
    LocalData.getExculusive().then(res => {
      if (JSON.parse(res) != null && JSON.parse(res).length != 0) {
        console.log('Bundle data', res);
        this.setState({bundleData: res});
      }
    });
  };
  //Handle App State Foreground/Background
  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      NativeModules.DevSettings.reload();
    } else {
      NativeModules.DevSettings.reload();
    }
  };

  openSubscription = () => {};

  render() {
    let {active, data, bundleData} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <FastImage style={styles.headerImage} source={{uri: data.image}} resizeMode={FastImage.resizeMode.cover} />
          <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.backButton}>
            <Icon type="AntDesign" name="close" style={{fontSize: 35, color: 'white'}} />
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <View style={styles.pricingContainer}>
            <View style={styles.pricingBoxView}>
              <View style={styles.pricingBoxFooter}>
                <Text style={{fontSize: 30, alignSelf: 'flex-start', fontWeight: '300'}}>₹</Text>
                <Text style={{fontSize: 40, fontWeight: 'bold'}}>99</Text>
                <Text style={{fontSize: 20, alignSelf: 'center'}}> every 1 year </Text>
              </View>
              <View style={styles.pricingBoxFooter}>
                <Text style={{fontSize: 16, fontWeight: '400'}}>Charged Yearly</Text>
                <Text style={{fontSize: 16, fontWeight: '400'}}> | Non-refundable</Text>
              </View>
            </View>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>Upgrade to unlock all the Exclusive content without Ads and download to watch offline.</Text>
            <TouchableOpacity style={styles.paySubscription} onPress={this.openSubscription}>
              <Text style={styles.payText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Plan);
