/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {View, Image, SafeAreaView, TouchableOpacity, Text, FlatList, Button, Alert, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import {Icon} from 'native-base';
import Orientation from 'react-native-orientation';
import LinearGradient from 'react-native-linear-gradient';
import NetInfo from '@react-native-community/netinfo';
import {EventRegister} from 'react-native-event-listeners';
import { Viewport } from '@skele/components';
//API
import HttpRequest from '../../utils/HTTPRequest';
//Redux
import {connect} from 'react-redux';
import {loginToken} from '../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';
//components
import SideMenu from '../../components/SideMenu';
import BottomLine from '../../components/BottomHorizontalLine/';
import Alerts from '../../components/Alerts/';
import HomeHeader from '../../components/Header/HomeHeader';
import withSequentialRendering from '../../components/withSequentialRendering';
import Banner from '../../components/AdMob/Banner/';
//style
import styles from './styles';
import COLORS from '../../constants/colors';

const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({key: `blank-${numberOfElementsLastRow}`, empty: true});
    numberOfElementsLastRow++;
  }

  return data;
};

const numColumns = 3;

const SequentialBanner = withSequentialRendering(Banner);

class Wishlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDataFetched: false,
      isConnected: false,
      result: false,
      data: [],
      isNotify: false,
      title: '',
      subtitle: '',
      type: '',
      action: false,
    };
  }
  componentDidMount() {
    EventRegister.emit('videoPaused', {
      isClosed: 'false',
    });
    Orientation.lockToPortrait();
    //Check internet connectivity
    this.checkNetworkConnectivity();
    this.onDidFocus = EventRegister.addEventListener('onDidFocus', data => {
      this.refresh();
    });
  }
  componentWillUnmount() {
    EventRegister.removeEventListener(this.onDidFocus);
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
          this.getWishlists();
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
        this.getWishlists();
      }
    });

    // Unsubscribe
    unsubscribe();
  };

  refresh = () => {
    //Check internet connectivity
    this.checkNetworkConnectivity();
  };

  getWishlists = () => {
    this.setState({isDataFetched: false});
    console.log('Token : ', this.props.token);
    if (this.props.token !== '') {
      HttpRequest.getWishlists(this.props.token)
        .then(res => {
          this.setState({isDataFetched: true});
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            //console.log("All Wishlists API result : ",JSON.stringify(result));
            //Method to add AdMob into wishlist array
            this.insertAds(result.data);
          } else if (result.message == 'Operation Failed. Try again.') {
            this.setState({
              data: [],
              result: false,
            });
          } else {
            console.log('All Wishlists API Error : ', result);
            // this.notify('danger','Oops!',result.message != undefined ? result.message : result.status,result.message != undefined ? false : true);
          }
        })
        .catch(err => {
          this.setState({isDataFetched: true});
          console.log('All Wishlists API Catch Exception: ', err);
          // this.notify('danger','Oops!','Something Went Worng!',false);
        });
    } else {
      this.setState({isDataFetched: true});
      console.log('All Wishlists Error: Token not found');
      // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
    }
  };

  callDetailsScreen = item => {
    if (item.isPaid == 2) {
      if (this.props.token != '') {
        console.log('Exclusive content');
        this.props.navigation.navigate('Exclusive', {itemId: item.id, type: item.type, isFavourite: true, refresh: 1});
      } else {
        console.log('Details with exclusive content');

        this.props.navigation.navigate('Details', {itemId: item.id, type: item.type, isFavourite: true, refresh: 1});
      }
    } else {
      console.log('Details content');
      this.props.navigation.navigate('Details', {itemId: item.id, type: item.type, isFavourite: true, refresh: 1});
    }
  };

  addItemEvery = (arr, item, starting, frequency) => {
    for (var i = 0, a = []; i < arr.length; i++) {
      a.push(arr[i]);
      if ((i + 1 + starting) % frequency === 0) {
        item.forEach((element, index) => {
          element['id'] = i + '_' + index.toString();
          a.push(element);
        });
        i++;
        if (arr[i]) a.push(arr[i]);
      }
    }
    return a;
  };

  insertAds = data => {
    let originalData = [];
    originalData.push(...data);

    originalData = this.addItemEvery(
      originalData,
      [
        {type: 'ad', name: 'AdMob'},
        {type: 'dm', name: 'AdMob'},
        {type: 'dm', name: 'AdMob'},
      ],
      3,
      3,
    );

    this.setState({
      data: originalData,
      result: true,
    });
  };

  renderItem = ({item, index}) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }

    return item.type === 'ad' || item.type === 'dm' ? (
      <SequentialBanner />
    ) : (
      <TouchableOpacity style={styles.item} onPress={() => this.callDetailsScreen(item)}>
        <FastImage style={styles.thumbnailImage} source={{uri: item.thumbnail}} resizeMode={FastImage.resizeMode.cover} />
      </TouchableOpacity>
    );
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
    const {isConnected, result, data, isNotify, title, subtitle, type, action} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <HomeHeader {...this.props} />
        {/* <View animation={'slideInLeft'} style={styles.leftContainer}>
                <SideMenu navigation={this.props.navigation} active={'wishlist'} />
            </View> */}
        {/* <LinearGradient colors={['rgba(0,0,0,1)', 'rgba(52,52,54,1) 20%', 'rgba(0,0,0,1)']} style={{flex:1}}> */}
        <SafeAreaView style={styles.rightContainer}>
          {isNotify && <Alerts show={isNotify} type={type} title={title} subtitle={subtitle} navigation={this.props.navigation} action={action} onRef={ref => (this.parentReference = ref)} parentReference={this.updateNotify.bind(this)} />}
          {!isConnected && (
            <View style={{flexGrow: 2, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '2%'}}>
              <Text style={{fontSize: 16, fontWeight: '600', color: '#fff', textAlign: 'center', margin: '5%'}}>There is a problem connecting to Freizeit. Please Try again later.</Text>
              <Button title="Retry" color="#191a1f" onPress={() => this.checkNetworkConnectivity()} />
            </View>
          )}
          {isConnected && (
            <View style={styles.marginContainer}>
              {/* { !result && 
                <View animation={'slideInRight'} style={styles.toolbarContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Icon type= "AntDesign" name='close'style={{fontSize: 35, color: COLORS.primary, alignSelf:'flex-end'}}  />
                    </TouchableOpacity>
                </View>
                } */}
              <View animation={'slideInRight'} style={styles.resultContainer}>
                {!result && (
                  <View style={styles.noResultContainer}>
                    <FastImage style={styles.notFoundImage} source={require('../../../assets/img/wishlist/Whislist2.png')} resizeMode={FastImage.resizeMode.contain} />
                    <Text style={styles.headingText}> Did you know? </Text>
                    <Text style={styles.bodyText}>When you add shows and movies you'll see them on your My Wishlist. One click Entertainment . </Text>
                  </View>
                )}
                {result && (
                  <View style={styles.foundResultContainer}>
                    <View style={[styles.row, {justifyContent: 'space-between'}]}>
                      <Text style={styles.thumbnailHeader}> My Wishlist</Text>
                      {/* <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")} >
                            <Icon type= "AntDesign" name='close'style={{fontSize: 35, color: COLORS.primary, alignSelf:'flex-end'}}  />
                            </TouchableOpacity> */}
                    </View>
                    <Viewport.Tracker><FlatList data={formatData(data, numColumns)} style={{height: '100%'}} renderItem={this.renderItem} numColumns={3} /></Viewport.Tracker>
                  </View>
                )}
              </View>
            </View>
          )}
          {/* <Animatable.View  animation={'slideInUp'} style={styles.footerContainer}>
                    <BottomLine />
                </Animatable.View> */}
        </SafeAreaView>
        {/* </LinearGradient> */}
      </SafeAreaView>
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
    loginToken: bindActionCreators(loginToken, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
