/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {View, Text, ScrollView, TouchableOpacity, AppState, ActivityIndicator, Alert, Platform, Dimensions, FlatList, SafeAreaView} from 'react-native';
import { Viewport } from '@skele/components';
import {Icon} from 'native-base';
import * as Animatable from 'react-native-animatable';
import Orientation from 'react-native-orientation';
import NetInfo from '@react-native-community/netinfo';
//Api
import HttpRequest from '../../utils/HTTPRequest';
import LocalData from '../../utils/LocalData';
//Redux
import {connect} from 'react-redux';
import {slider, recentlyWatched, latestMovies, latestEvents, bannerAds, videoAds, latestSeries, documentaries, comingSoon, trendingNow, vlogs, latestGame, Exclusive, storeBundleId} from '../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';

//components
import FastImage from '../../components/FastImage';
import StatusBar from '../../components/StatusBar';
import Slider from '../../components/Slider';
import Alerts from '../../components/Alerts';
import Banner from '../../components/AdMob/Banner';
import ChatboxImage from '../../../assets/Chatbox.png';
import withSequentialRendering from '../../components/withSequentialRendering';

//style
import styles from './styles';
import colors from '../../constants/colors';
import HomeHeader from '../../components/Header/HomeHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SequentialBanner = withSequentialRendering(Banner);

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHeader: true,
      isDataFetched: false,
      isNotify: false,
      title: '',
      subtitle: '',
      type: '',
      slider: '',
      recentlyWatched: null,
      latestMovies: null,
      latestEvents: null,
      latestGame: null,
      latestSeries: null,
      latestdocumentaries: null,
      comingSoon: null,
      trendingNow: null,
      vlogs: null,
      refreshing: false,
      isConnected: false,
      allMovies: [],
      allSeries: [],
      gameAll: [],
      getEnterAll: [],
      allMovieData: [],
      exclusiveData: [],
      allEvents: [],
      exclusiveDataNew: [],
      exclusiveBundle: [],
      exclusiveBundleNew: [],
      position: {start: null, end: null},
      paused: false,
      adsData: [],
      adsStatus: 0,
      visible: false,
      videoType: '',
      isBuffering: false,
      insertitalAdsShowCount: 0,
      loaded: false,
    };
    this.offset = 0;
    this.threshold = 150;
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount = () => {
    Orientation.lockToPortrait();
    this.checkNetworkConnectivity();
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.setState({ paused: false, isMuted: false });
    });
  
    this.blurListener = this.props.navigation.addListener('blur', () => {
      this.setState({ paused: true, isMuted: true });
    });
  };

  componentWillUnmount() {
    this.appStateSubscription.remove();
    this.focusListener();
    this.blurListener();
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      this.setState({
        paused: false,
        isMuted: false,
      });
    } else {
      this.setState({
        paused: true,
        isMuted: true,
      });
    }
  };

  onDetailPage = item => {
    this.props.navigation.push('Details', {itemId: item.id, type: item.type, refresh: 1});
  };

  onEventDetailsPage = item => {
    let { allEvents } = this.state;
    this.props.navigation.navigate('EventDetails', {
      all_events: allEvents.filter(event => event.id !== item.id) || [],  
      title: item.title, 
      description: item.description, 
      video_id: item.video_id});
  }

  checkNetworkConnectivity = () => {
    this.setState({isDataFetched: false});
    // For Android devices
    if (Platform.OS === 'android') {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          // No Connection to Internet
          LocalData.getSlider().then(info => {
            if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
              this.setState({
                isDataFetched: true,
                isConnected: true,
              });
              this.readRecentlyWatched();
              this.readMovies();
              this.readSeries();
              this.getGenresAllMovies();
              this.readDocumentaries();
              this.readLiveEvent();
              this.readBannerAds();
              this.readVideoAds();
              this.readComingSoon();
              // this.readTrendingNow();
              this.readVlog();
              this.readGames();
            } else {
              // console.log("Data Not Found.")
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
            }
          });
        } else {
          //Connection Found
          this.setState({
            isConnected: true,
          });
          this.getLiveEventBundle();
          if (!!this.props.token && this.props.token != '') {
            this.updateDeviceToken();
          }
        }
      });
    } else {
      // For iOS devices
      this.handleIOSConnectivityChange();
    }
  };

  handleIOSConnectivityChange = () => {
    // Subscribe
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected === false) {
        // No Connection to Internet
        LocalData.getSlider().then(info => {
          if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
            this.setState({
              isDataFetched: true,
              isConnected: true,
            });
            //Slider
            // this.readSlider();
            this.readRecentlyWatched();
            this.readLiveEvent();
            this.readBannerAds();
            this.readVideoAds();
            this.readMovies();
            this.readSeries();
            this.readDocumentaries();
            this.readComingSoon();
            // this.readTrendingNow();
            this.readVlog();
            this.readGames();
          } else {
            // console.log("Data Not Found.")
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
                  this.handleIOSConnectivityChange();
                },
              },
            ]);
          }
        });
      } else {
        //Connection Found
        this.setState({
          isConnected: true,
        });
        //Get Slider

        this.getLiveEventBundle();
        if (!!this.props.token && this.props.token != '') {
          this.updateDeviceToken();
        }
      }
    });

    // Unsubscribe
    unsubscribe();
  };

  readRecentlyWatched = () => {
    LocalData.getRecentlyWatched().then(info => {
      if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
        this.props.recentlyWatched(JSON.parse(info));
      }
    });
  };

  readLiveEvent = () => {
    LocalData.getLiveEvent().then(info => {
      if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
        this.props.latestEvents(JSON.parse(info));
      }
    });
  };

  readBannerAds = () => {
    LocalData.getBannerAds().then(info => {
      if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
        this.props.bannerAds(JSON.parse(info));
      }
    });
  };

  readVideoAds = () => {
    LocalData.getVideoAds().then(info => {
      if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
        this.props.videoAds(JSON.parse(info));
      }
    });
  };

  readMovies = () => {
    LocalData.getMovies().then(info => {
      if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
        this.props.latestMovies(JSON.parse(info));
      }
    });
  };

  readGames = () => {
    LocalData.getGames().then(info => {
      if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
        this.props.latestGame(JSON.parse(info));
      }
    });
  };

  readSeries = () => {
    LocalData.getSeries().then(info => {
      if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
        this.props.latestSeries(JSON.parse(info));
      }
    });
  };

  readDocumentaries = () => {
    LocalData.getDocumentaries().then(info => {
      if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
        console.log('Documentaries: ', JSON.parse(info));
        this.props.documentaries(JSON.parse(info));
      }
    });
  };

  readComingSoon = () => {
    LocalData.getComingSoon().then(info => {
      if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
        this.props.comingSoon(JSON.parse(info));
      }
    });
  };

  // readTrendingNow = () => {
  //     LocalData.getTrendingNow().then(info => {
  //         if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
  //             this.props.trendingNow(JSON.parse(info));
  //         }
  //     });
  // }

  readVlog = () => {
    console.log('Called');
    LocalData.getVlogs().then(info => {
      console.log('Vlogs', info);
      if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
        console.log('Vlogs', JSON.parse(info));
        this.props.vlogs(JSON.parse(info));
      }
    });
  };

  readExclusive = () => {
    LocalData.getExculusive().then(info => {
      if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
        this.props.Exclusive(JSON.parse(info));
      }
    });
  };

  // Get Live Event Bundle
  getLiveEventBundle = () => {
    this.setState({isDataFetched: false});
    HttpRequest.getLiveEvent(this.props.token)
      .then(res => {
        this.setState({isDataFetched: true});
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          // console.log('All Live Event Bundle data  : ', result.data);
          this.setState({allEvents: result.data});
          this.props.latestEvents(result.data);
          LocalData.setLiveEvent(result.data);
        } else {
          console.log('All Live Event Bundle API Error : ', result);
          // this.notify('danger','Oops!',result.message != undefined ? result.message : result.status,result.message != undefined ? false : true);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true});
        console.log('All Live Event Bundle API Catch Exception: ', err);
        // this.notify('danger','Oops!','Something Went Worng!',false);
      });
    this.getBannerAdBundle();
  };

  // Get Banner Ad Bundle
  getBannerAdBundle = () => {
    HttpRequest.getBannerAds(this.props.token)
      .then(res => {
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          // console.log('All Banner Ads Bundle data  : ', result.data);
          this.props.bannerAds(result.data);
          LocalData.setBannerAds(result.data);
        } else {
          // console.log('All Banner Ads Bundle API Error : ', result);
        }
      })
      .catch(err => {
        // console.log('All Banner Ads Bundle API Catch Exception: ', err);
      });
    this.getVideoAdBundle();
  };

  // Get Video Ad Bundle
  getVideoAdBundle = () => {
    HttpRequest.getVideoAds(this.props.token)
      .then(res => {
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          // console.log('All Video Ads Bundle data  : ', result.data);
          this.props.videoAds(result.data);
          LocalData.setVideoAds(result.data);
        } else {
          // console.log('All Video Ads Bundle API Error : ', result);
        }
      })
      .catch(err => {
        // console.log('All Video Ads Bundle API Catch Exception: ', err);
      });
    this.getExclusiveBundle();
  };

  // Get All Exclusive Bundle
  getExclusiveBundle = () => {
    // console.log('All exclusive Bundle data token : ', this.props.token);
    this.setState({isDataFetched: false});
    HttpRequest.getEclusiveBundle(this.props.token)
      .then(res => {
        this.setState({isDataFetched: true});
        const result = res.data;
        // console.log('All exclusive Bundle data  : ', JSON.stringify(result.data));
        if (res.status == 200 && result.error == false) {
          this.setState({exclusiveBundle: result.data});
        } else {
          console.log('All Exclusive Bundle API Error : ', result);
          this.setState({exclusiveBundle: []});
          // this.notify('danger','Oops!',result.message != undefined ? result.message : result.status,result.message != undefined ? false : true);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true, exclusiveBundle: []});
        console.log('All Exclusive Bundle API Catch Exception: ', err);
        // this.notify('danger','Oops!','Something Went Worng!',false);
      });
    this.getAllMovies();
  };

  updateDeviceToken = async () => {
    let device_token = await AsyncStorage.getItem('DeviceToken');
    console.log('====================================');
    console.log({chk12345: !!this.props.token && !!device_token});
    console.log('====================================');
    if (!!device_token && !!this.props.token) {
      let payload = {device_token, drviceType: Platform.OS};
      HttpRequest.postUpdateToken(this.props.token, payload)
        .then(res => {
          const result = res.data;
          console.log('updateDevice: ', JSON.stringify(result));
        })
        .catch(err => {
          console.log('updateDevice API Catch Exception: ', err);
          // this.notify('danger','Oops!','Something Went Worng!',false);
        });
    } else {
      console.log('=================else===================');
      console.log({device_token});
      console.log('====================================');
    }
  };

  //Get All Movies
  getAllMovies = () => {
    this.setState({isDataFetched: false});
    // if (this.props.token !== '') {
    HttpRequest.getMovies(this.props.token)
      .then(res => {
        this.setState({isDataFetched: true});
        // console.log('login', res.status);
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          const myNewData = result.data.filter(items => items.game_enter === null);
          // console.log('Trending Now data show ', myNewData);
          this.setState({allMovies: myNewData});
          this.props.latestMovies(myNewData);
          LocalData.setMovies(myNewData);
        } else {
          console.log('Latest Release API Error : ', result);
          // if(result.message == undefined ){
          //     this.notify('danger','Oops!',result.status, false);
          // }
          // this.notify('danger','Oops!',result.message != undefined ? result.message : result.status);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true});
        console.log('Latest Release API Catch Exception: ', err);
        // this.notify('danger','Oops!','Something Went Worng!', false);
      });
    // } else {
    //     this.setState({ isDataFetched: true })
    //     console.log("Latest Release Error: Token not found");
    //     // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.', false);
    // }
    // this.getGenresAllMovies();
    this.getSeries();
  };

  //Get All Series
  getSeries = () => {
    this.setState({isDataFetched: false});
    // if (this.props.token !== '') {
    HttpRequest.getSeries(this.props.token)
      .then(res => {
        this.setState({isDataFetched: true});
        // console.log('All Series Status', res.status);
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          this.setState({allSeries: result.data});
          this.props.latestSeries(result.data);
          LocalData.setSeries(result.data);
        } else {
          console.log('All Series API Error : ', result);
          // if(result.message == undefined ){
          //     this.notify('danger','Oops!',result.status, false);
          // }
          // this.notify('danger','Oops!',result.message != undefined ? result.message : result.status);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true});
        console.log('All Series API Catch Exception: ', err);
        this.notify('danger', 'Oops!', 'Something Went Worng!', false);
      });
    // } else {
    //     this.setState({ isDataFetched: true })
    //     console.log("All Series Error: Token not found");
    //     this.notify('danger', 'Oops!', 'We are unable to process your request at the moment! Please try again later.', false);
    // }
    this.getDocumentaries();
  };

  //Get Documentries
  getDocumentaries = () => {
    this.setState({isDataFetched: false});
    // if (this.props.token !== '') {
    HttpRequest.getDocumentaries(this.props.token)
      .then(res => {
        this.setState({isDataFetched: true});
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          // console.log('Documentaries Data: ', result.data);
          this.props.documentaries(result.data);
          LocalData.setDocumentaries(result.data);
        } else {
          console.log('Documentaries API Error : ', result);
          // if(result.message == undefined ){
          //     this.notify('danger','Oops!',result.status, false);
          // }
          // this.notify('danger','Oops!',result.message != undefined ? result.message : result.status);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true});
        console.log('Documentaries API Catch Exception: ', err);
        // this.notify('danger','Oops!','Something Went Worng!', false);
      });
    // } else {
    //     this.setState({ isDataFetched: true })
    //     console.log("Documentaries Error: Token not found");
    //     // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.', false);
    // }
    this.getComingSoon();
  };

  //Get Coming Soon
  getComingSoon = () => {
    this.setState({isDataFetched: false});
    // if (this.props.token !== '') {
    HttpRequest.getComingSoon(this.props.token)
      .then(res => {
        this.setState({isDataFetched: true});
        // console.log('Coming Soon Status', res.status);
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          this.props.comingSoon(result.data);
          LocalData.setComingSoon(result.data);
        } else {
          // console.log('Coming Soon API Error : ', result);
          // if(result.message == undefined ){
          //     this.notify('danger','Oops!',result.status, false);
          // }
          // this.notify('danger','Oops!',result.message != undefined ? result.message : result.status);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true});
        console.log('Coming Soon API Catch Exception: ', err);
        // this.notify('danger','Oops!','Something Went Worng!', false);
      });
    // } else {
    //     this.setState({ isDataFetched: true })
    //     console.log("Coming Soon Error: Token not found");
    //     // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.', false);
    // }

    // this.getTrendingNow();
    this.getVlog();
  };

  //Get vlog
  getVlog = () => {
    this.setState({isDataFetched: false});
    // if (this.props.token !== '') {
    HttpRequest.getVlogs(this.props.token)
      .then(res => {
        this.setState({isDataFetched: true});
        // console.log('Vlog Status', res.data);
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          this.props.vlogs(result.data);
          LocalData.setVlogs(result.data);
        } else {
          // console.log('vlog API Error : ', result);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true});
        // console.log('vlog API Catch Exception: ', err);
      });
    // } else {
    //     this.setState({ isDataFetched: true })
    //     console.log("vlog Error: Token not found");
    // }\
    this.getGenresAllMovies();
  };

  getGenresAllMovies = () => {
    this.setState({isDataFetched: false, activeGenre: '', allMovieData: []});
    // if (this.props.token !== '') {
    HttpRequest.getGenresAllMovies(this.props.token)
      .then(res => {
        this.setState({isDataFetched: true});
        const result = res.data;
        // console.log('All Movies length  : ', result.data.length);
        if (res.status == 200 && result.error == false) {
          this.setState({allMovieData: result.data});
        } else {
          // console.log('All Movies API Error : ', result);
          this.setState({allMovieData: []});
          // this.notify('danger','Oops!',result.message != undefined ? result.message : result.status,result.message != undefined ? false : true);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true, allMovieData: []});
        console.log('All Movies API Catch Exception: ', err);
        // this.notify('danger','Oops!','Something Went Worng!',false);
      });
    // } else {
    //     this.setState({ isDataFetched: true, data: [] });
    //     console.log("All Movies Error: Token not found");
    //     // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
    // }
    this.getRecentlyWatched();
  };

  getRecentlyWatched = () => {
    // this.props.navigation.openDrawer();
    this.setState({isDataFetched: false});
    // if (this.props.token !== '') {
    HttpRequest.getRecentlyWatched(this.props.token)
      .then(res => {
        this.setState({isDataFetched: true});
        const result = res.data;
        // console.log("Recently Watched API DATA : ", result.data);
        if (res.status == 200 && result.error == false) {
          this.props.recentlyWatched(result.data);
          LocalData.setRecentlyWatched(result.data);
        } else {
          // console.log('Recently Watched API Error : ', result);
          // if(result.message == undefined ){
          //     this.notify('danger','Oops!',result.status, false);
          // }
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true});
        console.log('Recently Watched API Catch Exception: ', err);
        // this.notify('danger','Oops!','Something Went Worng!', false);
      });
    // }
    // else {
    //     this.setState({ isDataFetched: true })
    //     console.log("Recently Watched Error: Token not found");
    //     // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.', false);
    // }
    this.getExclusiveBundleNew();
  };

  // Get All Exclusive Bundle
  getExclusiveBundleNew = () => {
    // console.log('All exclusive Bundle new data token : ', this.props.token);
    this.setState({isDataFetched: false});
    HttpRequest.getEclusiveBundleNew(this.props.token)
      .then(res => {
        this.setState({isDataFetched: true});
        const result = res.data;
        // console.log('All exclusive Bundle new data  : ', JSON.stringify(result.data?.[0]._id));
        if (res.status == 200 && result.error == false) {
          LocalData.setExclusive(result.data?.[0]);
          this.props.storeBundleId(result.data?.[0]._id);
          this.setState({exclusiveBundleNew: result.data});
        } else {
          // console.log('All Exclusive Bundle new API Error : ', result);
          this.setState({exclusiveBundleNew: []});
          // this.notify('danger','Oops!',result.message != undefined ? result.message : result.status,result.message != undefined ? false : true);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true, exclusiveBundleNew: []});
        console.log('All Exclusive Bundle new API Catch Exception: ', err);
        // this.notify('danger','Oops!','Something Went Worng!',false);
      });
    // this.getAllMovies();
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

  onScroll(event) {
    const {showHeader} = this.state;

    let show = showHeader;
    const currentOffset = event.nativeEvent.contentOffset.y;
    show = currentOffset < this.offset;

    if (currentOffset <= 0) {
      this.setState({showHeader: true});
    } else {
      this.setState({showHeader: false});
    }
  }

  renderItems = type => {
    if (type == '1') {
      return this.props.recentlywatched.slice(0, 10).map(item => {
        return (
          <View style={[styles.thumbnailView, {borderBottomLeftRadius: 0, borderBottomRightRadius: 0}]} key={item.id}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.onDetailPage(item)}>
              <View style={[styles.thumbnailView, {justifyContent: 'center'}]}>
                <FastImage
                  style={styles.thumbnailImage}
                  source={{
                    uri: item.thumbnail,
                  }}
                  resizeMode={'cover'}
                />
                <View style={styles.buttonPlay}>
                  <Icon type="FontAwesome5" name="play-circle" style={{fontSize: 25, color: '#fff'}} />
                </View>
                <View style={styles.progressContainer}>
                  <View style={[styles.progress, {width: '' + item.progress + '%'}]} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      });
    } else if (type == '2') {
      return this.props.latestmovies.slice(0, 5).map(item => {
        return (
          <View style={styles.thumbnailView} key={item.id}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.onDetailPage(item)}>
              <FastImage
                style={styles.thumbnailImage}
                source={{
                  uri: item.thumbnail,
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          </View>
        );
      });
    } else if (type == '3') {
      return this.props.latestseries.slice(0, 10).map(item => {
        return (
          <View style={styles.thumbnailView} key={item.id}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.onDetailPage(item)}>
              <FastImage
                style={styles.thumbnailImage}
                source={{
                  uri: item.thumbnail,
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          </View>
        );
      });
    } else if (type == '4') {
      return this.props.documentary.slice(0, 10).map(item => {
        return (
          <View style={styles.thumbnailView} key={item.id}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.onDetailPage(item)}>
              <FastImage
                style={styles.thumbnailImage}
                source={{
                  uri: item.thumbnail,
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          </View>
        );
      });
    } else if (type == '5') {
      return this.props.comingsoon.slice(0, 10).map(item => {
        return (
          <View style={styles.thumbnailView} key={item.id}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.push('ComingSoonDetails', {itemId: item.id, type: item.type})}>
              <FastImage
                style={styles.thumbnailImage}
                source={{
                  uri: item.thumbnail,
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          </View>
        );
      });
    } else if (type == '7') {
      return this.state.exclusiveBundle[0].MovieDetail.slice(0, 10).map(item => {
        return (
          <View style={styles.thumbnailView} key={item.id}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.onDetailPage(item)}>
              <FastImage
                style={styles.thumbnailImage}
                source={{
                  uri: item.thumbnail,
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
            <View style={{position: 'absolute', top: 3, right: 5, padding: 5, backgroundColor: colors.brandPrimary, borderRadius: 5}}>
              <Text style={{fontSize: 8, color: colors.white}}>Exclusive</Text>
            </View>
          </View>
        );
      });
    } else if (type == '8') {
      return this.state.exclusiveBundleNew[0].getMovieDetail.slice(0, 10).map(item => {
        return (
          <View style={styles.thumbnailView} key={item.id}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.push('Exclusive', {itemId: item.id, type: item.type})}>
              <FastImage
                style={styles.thumbnailImage}
                source={{
                  uri: item.thumbnail,
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
            <View style={{position: 'absolute', top: 3, right: 5, padding: 5, backgroundColor: colors.brandPrimary, borderRadius: 5}}>
              <Text style={{fontSize: 8, color: colors.white}}>Exclusive</Text>
            </View>
          </View>
        );
      });
    } else if (type == '9') {
      return this.props.latestevents.slice(0, 5).map(item => {
        return (
          <View style={styles.thumbnailView} key={item.id}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.onEventDetailsPage(item)}>
              <FastImage
                style={styles.thumbnailImage}
                source={{
                  uri: item.thumbnail,
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
            <View style={{position: 'absolute', top: 3, right: 5, padding: 5, backgroundColor: colors.brandPrimary, borderRadius: 5}}>
              <Text style={{fontSize: 8, color: colors.white}}>LIVE</Text>
            </View>
          </View>
        );
      });
    } else {
      return this.props.Vlogs.slice(0, 10).map(item => {
        return (
          <View style={styles.thumbnailView} key={item.id}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.onDetailPage(item)}>
              <FastImage
                style={styles.thumbnailImage}
                source={{
                  uri: item.thumbnail,
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          </View>
        );
      });
    }
  };

  renderItem = ({item, index}) => {
    if (item.content.length > 0) {
      return (
        <View style={styles.middleContainer} key={item?._id}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 10}}>
            <Text style={styles.thumbnailHeader}>{item.name + ' ' + this.state.activeGenre}</Text>
            {item.content.length > 3 && (
              <TouchableOpacity onPress={() => this.props.navigation.push('SeeMore', {itemId: item})}>
                <Text style={[styles.thumbnailHeader, {fontSize: 12}]}>See More</Text>
              </TouchableOpacity>
            )}
          </View>
          <View
            onLayout={({nativeEvent}) => {
              this.setState({
                measuresSeason: nativeEvent.layout.y + 10,
              });
            }}>
            <ScrollView horizontal={true} scrollEventThrottle={200} decelerationRate="fast">
              {item.content.slice(0, 5).map((childItem, nn) => {
                // console.log(
                //   'data childItem',
                //   item.name + ' - ' + childItem?.name,
                // );
                return (
                  <View style={styles.thumbnailView} key={nn}>
                    <TouchableOpacity onPress={() => this.onDetailPage(childItem)}>
                      <FastImage
                        style={styles.thumbnailImage}
                        source={{
                          uri: childItem.thumbnail,
                        }}
                        resizeMode={'cover'}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          {index % 2 == 0 && <SequentialBanner/>}
        </View>
      );
    }
  };

  onVideoLayout = event => {
    const {height} = Dimensions.get('window');
    let start = -(event.nativeEvent.layout.y - height + this.threshold);
    let end = event.nativeEvent.layout.y + event.nativeEvent.layout.height - this.threshold;
    this.setState({position: start, end});
  };

  callDetailsScreen = item => {
    console.log('Addvertizement content', item);
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

  _onLoadStart = () => {
    this.setState({isBuffering: true});
  };

  _onLoad = data => {
    this.setState({isBuffering: false});
  };

  _onProgress = progress => {
    this.setState({
      isBuffering: false,
    });
  };

  render() {
    let {isConnected, paused, isMuted, refreshing, isDataFetched, isNotify, title, subtitle, type, action, allMovies, allEvents, gameAll, getEnterAll, allMovieData, exclusiveData, exclusiveDataNew, exclusiveBundle, exclusiveBundleNew, allSeries, adsData, adsStatus} = this.state;
    let {recentlywatched, latestmovies, latestseries, documentary, comingsoon, trendingnow, Vlogs, latestGame, Exclusive} = this.props;
    let sortedObj = [{}];
    let sortedObj1 = allMovieData.sort(function (a, b) {
      if (b.content != undefined) {
        return b.content.length - a.content.length;
      }
    });
    sortedObj1?.map((x, n) => {
      if (x?.name !== 'Talk Show') {
        sortedObj.push(x);
      } else {
        sortedObj[0] = x;
      }
      if (n == allMovieData?.length - 1 && !sortedObj?.[0]?.name) {
        sortedObj.shift();
      }
    });
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={false} />
        <View style={styles.rightContainer}>
          {/* Header */}
          {this.state.showHeader && <HomeHeader {...this.props} />}
          {!isDataFetched && isConnected && (
            <View style={styles.noResultContainer}>
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            </View>
          )}
          {isConnected && isDataFetched && (
            <Viewport.Tracker>
            <ScrollView
              onScroll={this.onScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}>
              <View style={{height: 180, borderRadius: 10}}>
                <Slider navigation={this.props.navigation} isPaused={paused} isMuted={isMuted} />
                {isNotify && <Alerts show={isNotify} type={type} title={title} subtitle={subtitle} navigation={this.props.navigation} action={action} onRef={ref => (this.parentReference = ref)} parentReference={this.updateNotify.bind(this)} />}
              </View>

              {recentlywatched.length > 0 && (
                <View animation={this.state.isSideBarHidden ? 'slideInLeft' : 'slideInLeft'} delay={4} style={styles.middleContainer}>
                  <View style={styles.row}>
                    <Text style={styles.thumbnailHeader}>Recently Watched</Text>
                  </View>
                  <View
                    onLayout={({nativeEvent}) => {
                      this.setState({
                        measuresSeason: nativeEvent.layout.y + 10,
                      });
                    }}>
                    <ScrollView horizontal={true} scrollEventThrottle={200} decelerationRate="fast">
                      {this.renderItems('1')}
                    </ScrollView>
                  </View>
                </View>
              )}
              {this.props.token !== '' ? (
                <View>
                  {exclusiveBundleNew.length > 0 && (
                    <View animation={this.state.isSideBarHidden ? 'slideInLeft' : 'slideInLeft'} delay={4} style={styles.middleContainer}>
                      <View style={styles.row}>
                        <Text style={styles.thumbnailHeader}>Exclusive</Text>
                      </View>
                      <View
                        onLayout={({nativeEvent}) => {
                          this.setState({
                            measuresSeason: nativeEvent.layout.y + 10,
                          });
                        }}>
                        <ScrollView horizontal={true} scrollEventThrottle={200} decelerationRate="fast">
                          {this.renderItems('8')}
                        </ScrollView>
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  {exclusiveBundle.length > 0 && (
                    <View animation={this.state.isSideBarHidden ? 'slideInLeft' : 'slideInLeft'} delay={4} style={styles.middleContainer}>
                      <View style={styles.row}>
                        <Text style={styles.thumbnailHeader}>Exclusive</Text>
                      </View>
                      <View
                        onLayout={({nativeEvent}) => {
                          this.setState({
                            measuresSeason: nativeEvent.layout.y + 10,
                          });
                        }}>
                        <ScrollView horizontal={true} scrollEventThrottle={200} decelerationRate="fast">
                          {this.renderItems('7')}
                        </ScrollView>
                      </View>
                    </View>
                  )}
                </View>
              )}
              <SequentialBanner/>

              {trendingnow.length > 0 && (
                <View animation={this.state.isSideBarHidden ? 'slideInLeft' : 'slideInLeft'} delay={4} style={[styles.middleContainer, {margin: 10}]}>
                  <View style={styles.row}>
                    <Text style={styles.thumbnailHeader} onPress={() => this.props.navigation.navigate('TrendingNow')}>
                      Trending Now
                    </Text>
                    {trendingnow.length > 4 ? (
                      <Text style={[styles.thumbnailHeader, {fontSize: 12}]} onPress={() => this.props.navigation.navigate('TrendingNow')}>
                        See More
                      </Text>
                    ) : null}
                  </View>
                  <View
                    onLayout={({nativeEvent}) => {
                      this.setState({
                        measuresSeason: nativeEvent.layout.y + 10,
                      });
                    }}>
                    <ScrollView horizontal={true} scrollEventThrottle={200} decelerationRate="fast">
                      {this.renderItems('6')}
                    </ScrollView>
                  </View>
                </View>
              )}

              {allEvents.length > 0 && (
                <View animation={this.state.isSideBarHidden ? 'slideInLeft' : 'slideInLeft'} delay={4} style={styles.middleContainer}>
                  <View style={styles.row}>
                    <Text style={styles.thumbnailHeader}>Live Events</Text>
                  </View>

                  <View
                    onLayout={({nativeEvent}) => {
                      this.setState({
                        measuresSeason: nativeEvent.layout.y + 10,
                      });
                    }}>
                    <ScrollView horizontal={true} scrollEventThrottle={200} decelerationRate="fast">
                      {allEvents.slice(0, 5).map(item => {
                        return (
                          <View style={styles.thumbnailView} key={item.id}>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => this.onEventDetailsPage(item)}>
                              <FastImage
                                style={styles.thumbnailImage}
                                source={{
                                  uri: item.thumbnail,
                                }}
                                resizeMode={'cover'}
                              />
                            </TouchableOpacity>
                            <View style={{position: 'absolute', top: 3, right: 5, padding: 5, backgroundColor: colors.brandPrimary, borderRadius: 5}}>
                              <Text style={{fontSize: 8, color: colors.white}}>LIVE</Text>
                            </View>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>
              )}

              {allMovies.length > 0 && (
                <View animation={this.state.isSideBarHidden ? 'slideInLeft' : 'slideInLeft'} delay={4} style={styles.middleContainer}>
                  <View style={styles.row}>
                    <Text style={styles.thumbnailHeader} onPress={() => this.props.navigation.navigate('Movies')}>
                      Movies
                    </Text>
                    {allMovies.length > 4 ? (
                      <Text style={[styles.thumbnailHeader, {fontSize: 12}]} onPress={() => this.props.navigation.navigate('Movies')}>
                        See More
                      </Text>
                    ) : null}
                  </View>

                  <View
                    onLayout={({nativeEvent}) => {
                      this.setState({
                        measuresSeason: nativeEvent.layout.y + 10,
                      });
                    }}>
                    <ScrollView horizontal={true} scrollEventThrottle={200} decelerationRate="fast">
                      {this.renderItems('2')}
                    </ScrollView>
                  </View>
                </View>
              )}

              {allSeries.length > 0 && (
                <View animation={this.state.isSideBarHidden ? 'slideInLeft' : 'slideInLeft'} delay={4} style={styles.middleContainer}>
                  <View style={styles.row}>
                    <Text style={styles.thumbnailHeader} onPress={() => this.props.navigation.navigate('Series')}>
                      Web Series
                    </Text>
                    {allSeries.length > 4 ? (
                      <Text style={[styles.thumbnailHeader, {fontSize: 12}]} onPress={() => this.props.navigation.navigate('Series')}>
                        See More
                      </Text>
                    ) : null}
                  </View>
                  <View
                    onLayout={({nativeEvent}) => {
                      this.setState({
                        measuresSeason: nativeEvent.layout.y + 10,
                      });
                    }}>
                    <ScrollView horizontal={true} scrollEventThrottle={200} decelerationRate="fast">
                      {this.renderItems('3')}
                    </ScrollView>
                  </View>
                </View>
              )}

              {comingsoon.length > 0 && (
                <View animation={this.state.isSideBarHidden ? 'slideInLeft' : 'slideInLeft'} delay={4} style={styles.middleContainer}>
                  <View style={styles.row}>
                    <Text style={styles.thumbnailHeader} onPress={() => this.props.navigation.navigate('ComingSoon')}>
                      Coming Soon
                    </Text>
                    {comingsoon.length > 4 ? (
                      <Text style={[styles.thumbnailHeader, {fontSize: 12}]} onPress={() => this.props.navigation.navigate('ComingSoon')}>
                        See More
                      </Text>
                    ) : null}
                  </View>
                  <View
                    onLayout={({nativeEvent}) => {
                      this.setState({
                        measuresSeason: nativeEvent.layout.y + 10,
                      });
                    }}>
                    <ScrollView horizontal={true} scrollEventThrottle={200} decelerationRate="fast">
                      {this.renderItems('5')}
                    </ScrollView>
                  </View>
                </View>
              )}

              <SequentialBanner/>
              
              {allMovieData != 0 ? null : (
                <Animatable.View animation={'slideInRight'} style={styles.noResultContainer}>
                  <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#ff0000" />
                  </View>
                </Animatable.View>
              )}
              {allMovieData.length > 0 && (
                <FlatList
                  // keyExtractor={(index, item) => index}
                  data={sortedObj}
                  style={{height: '100%'}}
                  renderItem={this.renderItem}
                />
              )}
            </ScrollView>
            </Viewport.Tracker>
          )}
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Chat')} animation={'slideInUp'} style={styles.footerContainer}>
            <FastImage style={{width: 35, height: 40, alignSelf: 'center', marginTop: 3}} source={ChatboxImage} resizeMode={'contain'} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  // console.log(`map state to props home `, state);
  return {
    token: state.token,
    sliderImages: state.slider,
    recentlywatched: state.recentlywatched,
    latestmovies: state.latestmovies,
    latestGame: state.latestGame,
    latestseries: state.latestseries,
    documentary: state.documentary,
    comingsoon: state.comingsoon,
    trendingnow: state.trendingnow,
    latestevents: state.latestevents,
    Vlogs: state.vlogs,
    Exclusive: state.Exclusive,
    bundleId: state.bundleId,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({slider, recentlyWatched, latestMovies, bannerAds, videoAds, latestSeries, documentaries, comingSoon, trendingNow, latestEvents, vlogs, latestGame, Exclusive, storeBundleId}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
