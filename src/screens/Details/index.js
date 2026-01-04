import React, {Component} from 'react';
import {View, Alert, Text, Image, ScrollView, TouchableOpacity, Share, PermissionsAndroid, Platform, ActivityIndicator, TouchableWithoutFeedback, AppState, Button, SafeAreaView} from 'react-native';
//Library
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import Orientation from 'react-native-orientation';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import { getVideoDuration } from 'react-native-video-duration';
import RNBackgroundDownloader from 'react-native-background-downloader';
import NetInfo from '@react-native-community/netinfo';
import ProgressCircle from 'react-native-progress-circle';
import {hideNavigationBar, showNavigationBar} from 'react-native-navigation-bar-color';
import RazorpayCheckout from 'react-native-razorpay';
import { Viewport } from '@skele/components';
//API
import HttpRequest from '../../utils/HTTPRequest';
import LocalData from '../../utils/LocalData';
//Redux
import {connect} from 'react-redux';
import {userInfo, loginToken, latestMovies, comingSoon} from '../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';
//components
import BottomLine from '../../components/BottomHorizontalLine/';
import Episodes from '../../components/Episodes/';
import StatusBar from '../../components/StatusBar/';
import Alerts from '../../components/Alerts/';
import Banner from '../../components/AdMob/Banner';
import withSequentialRendering from '../../components/withSequentialRendering';
import {EventRegister} from 'react-native-event-listeners';
//style
import styles from './styles';
import {Icon} from 'native-base';
import HeaderWithTittle from '../../components/Header/HeaderWithText';
import colors from '../../constants/colors';
const localImage = require('../../../assets/img/fzlogo.jpg');

function getNewOrderID() {
  var update = '';
  var r = Math.random() * new Date().getMilliseconds();
  update = 'FZ' + (1 + Math.floor(r % 2000) + 10000) + 'b' + (Math.floor(r % 100000) + 10000);
  return update;
}

const SequentialBanner = withSequentialRendering(Banner);

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDataFetched: false,
      isModalVisible: false,
      isFavourite: false,
      details: {},
      related_items: [],
      isNotify: false,
      title: '',
      subtitle: '',
      type: '',
      action: false,
      isPaused: false,
      isStarted: true,
      isPushed: false,
      isMuted: true,
      isDownloading: false,
      progress: 0,
      progressPlayer: 0,
      videoDuration: 0,
      video: '',
      isBuffering: false,
      appState: AppState.currentState,
      wifi: this.props.wifi,
      videoQuality: 2,
      isDownloaded: 0,
      isConnected: false,
      showControls: true,
      lastRefresh: Date(Date.now()).toString(),
      insertitalAdsShowCount: 0,
      loaded: false,
      path: null,
      play_details: null,
      series_id: null,
      loadingAd: false,
    };
    this.refreshScreen = this.refreshScreen.bind(this);
    this.Listener = null;
  }

  async componentDidMount() {
    EventRegister.emit('videoPaused', {
      isClosed: 'false',
    });
    Orientation.lockToPortrait();
    showNavigationBar();
    this.checkConnectivity();
    this.appStateSubscription = AppState.addEventListener('change', this._handleAppStateChange);
    this._toggleTrailer();
  }
  _toggleVideoPlayer = (path, details, series_id = null) => {
    this.setState({
        loaded: false,
        path: path,
        play_details: details,
        series_id: series_id,
        loadingAd: true,
        isPaused: true,
    });
    if (path && details) {
      if (series_id) {
        // Is a Series
        this._freePlay(path, details, 'series');
      } else {
        // Is a Movie
        this._freePlay(path, details, 'movie');
      }
    } else {
      console.log('Can not start player. No Details Found.');
    }
  }
  refreshScreen() {
    showNavigationBar();
    this.setState({lastRefresh: Date(Date.now()).toString()});
  }
  componentWillUnmount() {
    this.setState({
      isStarted: true,
      isMuted: true,
    });
    this.onBlur();
    // EventRegister.removeEventListener(this.onDidFocus);
    this.appStateSubscription.remove();
    if (this.Listener !== null) {
      this.Listener();
    }
  }
  loadAd = (path, details, id = null) => {
    this.setState(
      {
        loaded: false,
        path: path,
        play_details: details,
        series_id: id,
        loadingAd: true,
        isPaused: true,
      },
      () => {

      },
    );
  };

  showAds = () => {
    if (!this.state.loaded) {
      console.log('null');
      return null;
    } else {
      this._toggleTrailer();
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps?.route?.params?.itemId !== this.props.route?.params?.itemId) {
      this.setState({
        isPushed: false,
        isDownloading: false,
        isDownloaded: 0,
      });
      this._replay();
      this.checkConnectivity();
    }
  }

  refresh = () => {
    // this.checkConnectivity();
    // this._replay();
  };

  onBlur = () => {
    this.setState({
      isStarted: true,
      isMuted: true,
    });
  };

  getDownloads = item => {
    LocalData.getDownloads().then(info => {
      console.log('Get Downloaded Data Method:', JSON.parse(info));
      if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
        console.log('Data found in Local Storage');
        const myData = JSON.parse(info);
        const itemData = myData.filter(data => data.id === item.id);
        console.log('Data found  is Dowloaded ', itemData);
        if (itemData.length > 0) {
          this.setState({
            isDownloaded: 1,
          });
        } else {
          this.setState({
            isDownloaded: 0,
          });
        }
        // this.setState({ isDownloaded: 1 })
      } else {
        console.log('Data Not found in Local Storage');
      }
    });
  };

  //Handle App State Foreground/Background
  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.setState({appState: nextAppState, isStarted: true, isMuted: true});
    } else {
      this.setState({appState: nextAppState, isStarted: true, isMuted: true});
    }
  };
  //Check Internet Connectivity
  checkConnectivity = () => {
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
                this.checkConnectivity();
              },
            },
          ]);
        } else {
          this.setState({
            isConnected: true,
          });
          //Get  Details Results
          if (this.props.route?.params?.type == 1) {
            if (this.props.token != '') {
              if (this.props.route?.params?.tvMovies) {
                this.getTVMovieDetails();
              } else {
                this.getUserMovieDetails();
              }
            } else {
              this.getMovieDetails();
            }
            this.checkBackgroundDownloadPending();
          } else {
            if (this.props.token != '') {
              this.getUserSeriesDetails();
            } else {
              this.getSeriesDetails();
            }
          }
          this.getSettings();
        }
      });
    } else {
      // For iOS devices
      this.handleFirstConnectivityChange();
    }
  };
  //Check Iternet Connectivity IOS
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
              this.checkConnectivity();
            },
          },
        ]);
      } else {
        this.setState({
          isConnected: true,
        });
        //Get  Details Results
        if (this.props.route?.params?.type == 1) {
          if (this.props.token != '') {
            this.getUserMovieDetails();
          } else {
            this.getMovieDetails();
          }
          this.checkBackgroundDownloadPending();
        } else {
          if (this.props.token != '') {
            this.getUserSeriesDetails();
          } else {
            this.getSeriesDetails();
          }
        }
        this.getSettings();
      }
    });

    // Unsubscribe
    unsubscribe();
  };
  //Get All setting Details
  getSettings = () => {
    // if(this.props.token !== ''){
    HttpRequest.getSettings(this.props.token)
      .then(res => {
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          this.setState({
            videoQuality: result.video_quality,
          });
        } else {
          console.log('Setting Detail API Error : ', result);
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
        console.log('Setting Detail API Catch Exception: ', err);
      });
    // } else {
    //     this.setState({ isLoading: false})
    //     console.log("Setting Details Error: Token not found");
    // }
  };
  //Initial Background Downloader To check any pending Dowloads for respective movies
  checkBackgroundDownloadPending = async () => {
    // console.log('Called To check pending downloads')
    let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
    for (this.task of lostTasks) {
      //if the task is pending for the respective id
      if (this.task.id == this.props.route?.params?.itemId) {
        let videoDest = `${RNBackgroundDownloader.directories.documents}/content/data/util/sync/.dir/${this.task.id}.mp4`;
        // console.log(`Task ${this.task.id} was found!`);
        this.task
          .progress(percent => {
            this.setState({
              isDownloading: true,
              progress: percent * 100,
            });
          })
          .done(() => {
            this.task.stop();
            this.setState({
              progress: 100,
              isDownloading: false,
              isDownloaded: 1,
              video: videoDest,
            });
            this.downloadDetailsToServer(this.task.id, videoDest);
            //Store Donwloaded File Details in Local Storage
            this.storeInLocalStorage(videoDest);
          })
          .error(error => {
            console.log('Download canceled due to error: ', error);
            this.setState({
              progress: 0,
              isDownloading: false,
              isDownloaded: 0,
              video: videoDest,
            });
          });
      }
    }
  };
  // Get Details of Movie From Server
  getMovieDetails = () => {
    this.setState({isDataFetched: false, isDownloaded: 0, details: {}});
    // if(this.props.token !== ''){
    HttpRequest.getMovieDetails(this.props.token, this.props.route?.params?.itemId)
      .then(res => {
        this.setState({isDataFetched: true});
        const result = res.data;
        // console.log('====================================');
        // console.log({'res.status': result.data});
        // console.log('====================================');
        if (res.status == 200 && result.error == false) {
          this.setState({
            isDownloaded: result.isDownloaded,
            details: result.data,
            isFavourite: result.favorite == 1 ? true : false,
          });
          // console.log('Details: ', result.data);
          this.getDownloads(result.data);
          this.getRelatedMovies();
        } else {
          this.setState({details: {}, isDownloaded: 0});
          console.log('Movie Detail API Error : ', result);
          this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, result.message != undefined ? true : true);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true, details: {}, isDownloaded: 0});
        console.log('Movie Detail API Catch Exception: ', err);
        this.notify('danger', 'Oops!', 'Something Went Worng!', false);
      });
    // } else {
    //     this.setState({ isDataFetched: true, details: {}, isDownloaded: 0 })
    //     console.log("Series Detail Error: Token not found");
    //     this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
    // }
  };

  getUserMovieDetails = () => {
    this.setState({isDataFetched: false, isDownloaded: 0, details: {}});
    // if(this.props.token !== ''){
    HttpRequest.getMovieDetails(this.props.token, this.props.route?.params?.itemId)
      .then(res => {
        this.setState({isDataFetched: true});
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          this.setState({
            isDownloaded: result.isDownloaded,
            details: result.data,
            isFavourite: result.favorite == 1 ? true : false,
          });
          console.log('Details: ', result.data);
          this.getDownloads(result.data);
          this.getRelatedMovies();
        } else {
          this.setState({details: {}, isDownloaded: 0});
          console.log('Movie Detail API Error : ', result);
          this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, result.message != undefined ? true : true);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true, details: {}, isDownloaded: 0});
        console.log('Movie Detail API Catch Exception: ', err);
        this.notify('danger', 'Oops!', 'Something Went Worng!', false);
      });
    // } else {
    //     this.setState({ isDataFetched: true, details: {}, isDownloaded: 0 })
    //     console.log("Series Detail Error: Token not found");
    //     this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
    // }
  };

  getTVMovieDetails = () => {
    this.setState({isDataFetched: false, isDownloaded: 0, details: {}});
    HttpRequest.getTVMovieDetails(this.props.token, this.props.route?.params?.itemId)
      .then(res => {
        this.setState({isDataFetched: true});
        const result = res.data;
        if (result.error == false) {
          if (result.data?.id)
            this.setState({
              isDownloaded: result.isDownloaded,
              details: {...result.data, exclusiveamount: result?.exclusiveamountbundel || result?.data?.exclusiveamount || 0},
              isFavourite: result.favorite == 1 ? true : false,
            });
          console.log(' user Details movies: ', result.data);
          this.getDownloads(result.data);
          this.setState({
            related_items: result.reletedproducts,
          });
          // this.getRelatedMovies();
        } else {
          this.setState({details: {}, isDownloaded: 0});
          console.log('Movien User Detail API Error : ', result);
          this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, result.message != undefined ? true : true);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true, details: {}, isDownloaded: 0});
        console.log('Movie User Detail API Catch Exception: ', err);
        this.notify('danger', 'Oops!', 'Something Went Worng!', false);
      });
  };
  //Get All Related Movies
  getRelatedMovies = () => {
    // if(this.props.token !== ''){
    HttpRequest.getRelatedMovies(this.props.token, this.props.route?.params?.itemId)
      .then(res => {
        const result = res.data;
        // console.log('Related Movies API  : ', result);
        if (res.status == 200 && result.error == false) {
          this.setState({
            related_items: result.data,
          });
        } else {
          // console.log("Related Movies API Error : ",result);
          this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, result.message != undefined ? false : true);
        }
      })
      .catch(err => {
        // console.log("Related Movies API Catch Exception: ",err);
        this.notify('danger', 'Oops!', 'Something Went Worng!', false);
      });
    // } else {
    //     // console.log("Related Movies Error: Token not found");
    //     this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
    // }
  };
  //Get Details of Series from Server
  getSeriesDetails = () => {
    this.setState({isDataFetched: false, details: {}});
    // if(this.props.token !== ''){
    HttpRequest.getSeriesDetails(this.props.token, this.props.route?.params?.itemId)
      .then(res => {
        this.setState({isDataFetched: true});
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          console.log('Get Series Details', JSON.stringify(result.data));
          this.setState({
            details: result.data,
            isFavourite: result.favorite == 1 ? true : false,
          });

          this.getRelatedSeries();
        } else {
          this.setState({details: {}});
          // console.log("Series Detail API Error : ",result);
          this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, result.message != undefined ? true : true);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true, details: {}});
        // console.log("Series Detail API Catch Exception: ",err);
        this.notify('danger', 'Oops!', 'Something Went Worng!', false);
      });
    // } else {
    //     this.setState({ isDataFetched: true, details: {}  })
    //     // console.log("Series Detail Error: Token not found");
    //     this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.');
    // }
  };

  getUserSeriesDetails = () => {
    this.setState({isDataFetched: false, details: {}});
    if (this.props.token !== '') {
      HttpRequest.getUserSeriesDetails(this.props.token, this.props.route?.params?.itemId)
        .then(res => {
          this.setState({isDataFetched: true});
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            console.log('Get Series Details', JSON.stringify(result.data));
            this.setState({
              details: result.data,
              isFavourite: result.favorite == 1 ? true : false,
            });

            this.getRelatedSeries();
          } else {
            this.setState({details: {}});
            // console.log("Series Detail API Error : ",result);
            this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, result.message != undefined ? true : true);
          }
        })
        .catch(err => {
          this.setState({isDataFetched: true, details: {}});
          // console.log("Series Detail API Catch Exception: ",err);
          this.notify('danger', 'Oops!', 'Something Went Worng!', false);
        });
    } else {
      this.setState({isDataFetched: true, details: {}});
      // console.log("Series Detail Error: Token not found");
      this.notify('danger', 'Oops!', 'We are unable to process your request at the moment! Please try again later.');
    }
  };

  //Get All Related Series
  getRelatedSeries = () => {
    // if(this.props.token !== ''){
    HttpRequest.getRelatedSeries(this.props.token, this.props.route?.params?.itemId)
      .then(res => {
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          console.log('Related Series API data : ', result.data);
          this.setState({
            related_items: result.data,
          });
        } else {
          console.log('Related Series API Error : ', result);
          this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, result.message != undefined ? false : true);
        }
      })
      .catch(err => {
        // console.log("Related Series API Catch Exception: ",err);
        this.notify('danger', 'Oops!', 'Something Went Worng!', false);
      });
    // } else {
    //     // console.log("Related Series Error: Token not found");
    //     this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.');
    // }
  };
  //Add To Wishlist on Server
  addToWishlist = () => {
    this.setState({isDataFetched: false});
    if (this.props.token !== '' && this.props.route?.params?.itemId) {
      if (this.props.route?.params?.itemId) {
        HttpRequest.addToWishlist(this.props.token, {
          wishlist_id: this.props.route?.params?.itemId,
          type: this.state.details.type,
        })
          .then(res => {
            this.setState({isDataFetched: true});
            const result = res.data;
            if (res.status == 200 && result.error == false) {
              this.setState({isFavourite: !this.state.isFavourite});
              this.notify('success', 'Great!', 'Successfully added to your Wishlist.', false);
            } else {
              // console.log("Add Wishlist API Error : ",result);
              this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, false);
            }
          })
          .catch(err => {
            this.setState({isDataFetched: true});
            console.log('Add Wishlist API Catch Exception: ', err);
            this.notify('danger', 'Oops!', 'Something Went Worng!', false);
          });
      } else {
        this.setState({isDataFetched: true});
        console.log('Add Wishlist Error: Token not found');
        this.notify('danger', 'Oops!', 'We are unable to process your request at the moment! Please try again later.', false);
      }
    } else {
      this.setState({isDataFetched: true});
      console.log('Add Wishlist Error: Token not found');
      alert('Please login first');
    }
  };
  //Remove Wishlist from Server
  removeFromWishlist = () => {
    this.setState({isDataFetched: false});
    // if(this.props.token !== '' && this.props.route?.params?.itemId ){

    if (this.props.route?.params?.itemId) {
      HttpRequest.removeFromWishlist(this.props.token, this.props.route?.params?.itemId)
        .then(res => {
          this.setState({isDataFetched: true});
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            this.setState({isFavourite: !this.state.isFavourite});
            this.notify('success', 'Great!', 'Successfully removed from your Wishlist.', false);
          } else {
            // alert(result.message);
            console.log('Remove Wishlist API Error : ', result);
            this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, false);
          }
        })
        .catch(err => {
          this.setState({isDataFetched: true});
          console.log('Remove Wishlist API Catch Exception: ', err);
          this.notify('danger', 'Oops!', 'Something Went Worng!', false);
        });
    } else {
      this.setState({isDataFetched: true});
      console.log('Remove Wishlist Error: Token not found');
      this.notify('danger', 'Oops!', 'We are unable to process your request at the moment! Please try again later.', false);
    }
  };
  //Share Button Press
  shareButton = () => {
    let {details} = this.state;
    let link = Platform.OS == 'android' ? 'https://play.google.com/store/apps/details?id=com.freizeitMedia&hl=en_US' : 'https://apps.apple.com/in/app/freizeit-media/id1529561669';
    Share.share({
      message: 'Seen "' + details.name + '" on Freizeit yet? ' + link,
    })
      .then(result => console.log(result))
      .catch(errorMsg => console.log(errorMsg));
  };
  //Wishlist Button Press
  wishlistButton = () => {
    const {isFavourite} = this.state;
    console.log('isFavourite movies details ', isFavourite);
    if (isFavourite) {
      this.removeFromWishlist();
    } else {
      this.addToWishlist();
    }
  };
  /************************* Methods For Download ****************************************************/
  //Download Button Press
  downloadtButton = id => {
    let {details} = this.state;
    if (details.isSubscribed == 0) {
      if (details.isPaid == 1) {
        this.props.navigation.navigate('Subscriptions');
      } else if (details.isPaid == 2) {
        console.log('Exclusive video', this.props.info);
        if (this.props.token !== '') {
          this.getExclusive();
        } else {
          this.props.navigation.navigate('Signin');
        }
      } else {
        this.freeDownload(id);
      }
    } else {
      this.freeDownload(id);
    }
  };

  freeDownload = id => {
    const {details} = this.state;
    let {wifi} = this.props;
    //Check for setting before download begins if download allowed only over wifi or not
    if (wifi == 0) {
      //Proceed to check permission
      if (Platform.OS == 'android') {
        this.requestStoragePermission(id);
        this.backgroundDownloader(id);
      } else {
        //Download Process
        this.backgroundDownloader(id);
      }
    } else {
      //Check if wifi is enabled or not
      this.checkNetworkConnectivity(id);
    }
  };
  //Check Wifi Status fro Download Initiate
  checkNetworkConnectivity = id => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (state.isConnected) {
        if (state.type == 'wifi') {
          //Proceed to check permission
          if (Platform.OS == 'android') {
            this.requestStoragePermission(id);
          } else {
            //Download Process
            this.backgroundDownloader(id);
          }
        } else {
          this.backgroundDownloader(id);
          // this.notify('info','Oops!','Turn off "Wifi Only" setting to download over mobile network.','Settings')
        }
      } else {
        this.notify('warning', 'Oops!', 'No Internet Connection.');
      }
    });
  };
  //Check if Permission is granted for storing media in storage
  requestStoragePermission = async id => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
        title: 'Freizeit Storage Permission',
        message: 'Freizeit App needs access to your storage ' + 'so that you can download .',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the storage');
        this.backgroundDownloader(id);
        //ALso check if WIFI or not
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  //Initiat Donwload
  backgroundDownloader = id => {
    let {details} = this.state;
    this.setState({
      isDownloading: true,
      isDownloaded: 0,
      progress: 0,
    });
    let videoDest = `${RNBackgroundDownloader.directories.documents}/content/data/util/sync/.dir/${id}.mp4`;
    this.task = RNBackgroundDownloader.download({
      id: id,
      url: details.link,
      destination: videoDest,
    })
      .begin(expectedBytes => {
        console.log(`Going to download ${expectedBytes} bytes!`);
      })
      .progress(percent => {
        console.log(`Downloaded: ${percent * 100}%`);
        this.setState({
          progress: percent * 100,
        });
      })
      .done(() => {
        this.task.stop();
        this.setState({
          isDownloading: false,
          isDownloaded: 1,
          progress: 100,
          video: videoDest,
        });
        //Store Donwloaded File Details on Server
        this.downloadDetailsToServer(id, videoDest);
        //Store Donwloaded File Details in Local Storage
        this.storeInLocalStorage(videoDest);
      })
      .error(error => {
        console.log('Download canceled due to error: ', error);
        this.setState({
          isDownloading: false,
          isDownloaded: 0,
          progress: 0,
          video: videoDest,
        });
      });
  };
  //Store Downloaded File Details on Server
  downloadDetailsToServer = (file_name, path) => {
    let {details} = this.state;
    this.setState({isDataFetched: false});
    // if(this.props.token !== ''){
    HttpRequest.downloadSpecificVideo(this.props.token, {
      content_id: this.props.route?.params?.itemId,
      type: this.state.details.type,
      file_name: file_name,
      path: path,
    })
      .then(res => {
        this.setState({isDataFetched: true});
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          console.log('Download Specific Video API Success : ', result.message);
        } else {
          console.log('Download Specific Video API Error : ', result);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true});
        console.log('Download Specific VideoAPI Catch Exception: ', err);
      });
    // } else {
    //     this.setState({ isDataFetched: true })
    //     console.log("Download Specific Video Error: Token not found");
    // }
  };
  //Store Details of downloaded File in Async Store( Local Data )
  storeInLocalStorage = path => {
    let {details} = this.state;
    //Reset
    // LocalData.setDownloads('');
    //Fetch Local Storage Data
    LocalData.getDownloads()
      .then(info => {
        let store = [];
        store = JSON.parse(info) !== '' ? (JSON.parse(info) !== null ? JSON.parse(info) : []) : [];
        details['path'] = path;
        store.push(details);
        LocalData.setDownloads(store);
      })
      .catch(error => {
        // Error retrieving data
        console.log('There was an error processing your request for download. Please try again Later.', error);
      });
  };
  //Cancel Download Alert
  cancelDownload = id => {
    // cancel the HTTP request
    Alert.alert('Cancel Download', 'Are you sure you want to cancel the download?', [
      {
        text: 'Yes',
        onPress: () => {
          this.stopDownload();
        },
      },
      {text: 'No'},
    ]);
  };
  //Stop Download Progress completely
  stopDownload = () => {
    // console.log("Stopped");
    this.task.stop();
    this.setState({
      isDownloading: false,
      isDownloaded: 0,
      progress: 0,
      video: '',
    });
  };
  /************************* Methods For Download ****************************************************/
  // Format The Timing
  convertMinsToTime = mins => {
    // var  getUpdate = ""
    // if(mins.contain(":")){
    //     var getMins = []
    //     getMins = mins.split(":");
    //     getUpdate = getMins[0] > 0 ? `${getMins[0]} hr ${getMins[1]} min.` : `${getMins[1]} min.`
    // }else {
    //     getUpdate = `${getMins[0]} min.`
    // }
    // console.log("getUpdate"+getUpdate)
    return mins;
  };
  //Push To Details of Related movies
  navigate = (itemId, itemType) => {
    const {isPushed} = this.state;
    if (!isPushed) {
      this.setState({
        isStarted: true,
        isMuted: true,
        isPushed: true,
      });
      this.props.navigation.push('Details', {
        itemId: itemId,
        type: itemType,
        refresh: 1,
      });
    }
  };
  //Render Related Movies View
  renderRelatedItems = () => {
    return this.state.related_items.map(item => {
      return (
        <View style={styles.thumbnailView} key={item.id}>
          <TouchableOpacity onPress={() => this.navigate(item.id, item.type)}>
            <FastImage style={styles.thumbnailImage} source={{uri: item.thumbnail}} resizeMode={FastImage.resizeMode.cover} />
          </TouchableOpacity>
        </View>
      );
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
      isStarted: true,
    });
  };
  //Notification Alerts CLose
  updateNotify() {
    this.setState({
      isStarted: true,
      isNotify: false,
    });
  }
  /************************* Methods For Player ****************************************************/
  _back = () => {
    this.setState({
      isStarted: true,
    });
    this.props.navigation.navigate('Home');
  };

  _playAd = (path, details, id) => {
    //Free Play For Series
    this._toggleVideoPlayer(path, details, id);
    // this.loadAd(path, details, id);
  };

  _play = (path, details) => {
    if (details.isSubscribed == 0) {
      if (details.isPaid == 1) {
        this.props.navigation.navigate('Subscriptions');
      } else if (details.isPaid == 2) {
        // console.log('Exclusive video', this.props.info);
        if (this.props.token !== '') {
          this.getPlaceOrder();
        } else {
          this.props.navigation.navigate('Signin');
        }
      } else {
        // this.loadAd(path, details);
        console.log('_play');
        this._toggleVideoPlayer(path, details);
      }
    } else {
      console.log('_play');
      // this.loadAd(path, details);
      this._toggleVideoPlayer(path, details);
    }
  };

  getPlaceOrder = () => {
    this.setState({isLoading: true});
    var OrderID = getNewOrderID();
    let order_Data = {
      order_id: OrderID,
      movies_id: this.state.details.id || this.state.details._id,
      user_id: this.props.info._id,
      emailid: this.props.info.email,
      bundel_id: this.props.route?.params?.bundleId || '',
      payment_id: '',
      amount: this.state.details.exclusiveamount,
      method: '',
      description: 'desc',
      data: 'ssss',
      paymentstatus: 'pending',
      orderstatus: 'pending',
    };
    HttpRequest.placeOrder(order_Data)
      .then(res => {
        this.setState({isLoading: false});
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          console.log('Order Place order ', result);
          this.getExclusive(OrderID);
        } else {
          console.log('Order Place order ', result.message);
          this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, false);
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
        console.log('Place Order Catch Exception: ', err);
        this.notify('danger', 'Oops!', 'Something Went Worng!', false);
      });
    //   console.log('result:', user);
  };
  getExclusive = OrderID => {
    this.setState({isLoading: true});

    var options = {
      description: 'Order id :' + OrderID + ' Payment',
      currency: 'INR',
      // key: 'rzp_test_hG7Sw2LJ6l2Ks8', //test key
      key: 'rzp_live_fnfIrfDZz7joBd', // live key
      amount: parseInt(this.state.details.exclusiveamount) * 100,
      name: 'Freizit Media',
      // order_id: 'order_'+OrderID,//Replace this with an order_id created using Orders API.
      prefill: {
        email: this.props.info.email,
        contact: this.props.info.phone,
        name: this.props.info.name,
      },
      theme: {color: '#D65050'},
    };
    RazorpayCheckout.open(options)
      .then(data => {
        this.setState({isLoading: false});
        // handle success
        console.log('SUccess data', JSON.stringify(data));
        // alert(`Success: ${data.razorpay_payment_id}`);
        this.getOrderStatus(data.razorpay_payment_id, OrderID);
      })
      .catch(error => {
        this.setState({isLoading: false});
        // handle failure
        console.log('Failure data', error);
        alert(`Error: ${error.code} | ${error.description}`);
      });
  };

  getOrderStatus = (paymentid, orderid) => {
    this.setState({isLoading: true});
    let statusData = {
      razorpay_payment_id: paymentid,
      order_id: orderid,
    };
    HttpRequest.getOrderStatus(statusData)
      .then(res => {
        this.setState({isLoading: false});
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          console.log('Get order status true ', result);
        } else {
          console.log('Get order status false', result.message);
          this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, false);
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
        console.log('Get Order staus Catch Exception: ', err);
        this.notify('danger', 'Oops!', 'Something Went Worng!', false);
      });
    //   console.log('result:', user);
  };

  _freePlay = async (path, details, type) => {
    this.setState({
      isStarted: true,
      isPaused: false,
    });
  
    const navigationParams = {
      videoPath: path,
      details: details
    };
  
    if (type === 'series') {
      navigationParams.series_id_details = series_id;
    }
   
    this.props.navigation.navigate('Video', navigationParams);
  }

  _toggleTrailer = () => {
    const {isStarted, isMuted, isPaused} = this.state;
    if (isStarted) {
      this.setState({
        isStarted: false,
        isPaused: false,
        isMuted: false,
        isBuffering: false,
      });
    } else {
      if (isPaused) {
        this.setState({
          isStarted: false,
          isPaused: false,
          isMuted: false,
          isBuffering: false,
        });
      } else {
        this.setState({
          isStarted: false,
          isPaused: true,
          isMuted: false,
          isBuffering: false,
        });
      }
    }
  };
  _toggleVolume = () => {
    const {isMuted} = this.state;
    this.setState({
      isMuted: !isMuted,
    });
  };
  _onLoadStart = () => {
    this.setState({isBuffering: true});
  };
  _onLoad = data => {
    this.setState({isBuffering: false, videoDuration: data.duration});
    if (this.state.showControls) {
      this.setControlTimeout();
    }
  };
  _onProgress = progress => {
    this.setState({
      isBuffering: false,
      progressPlayer: progress.currentTime,
    });
  };
  _onForworBackword = type => {
    if (type == 'Forword') {
      let state = this.state;
      this.playbackObject.seek(state.progressPlayer + 10);
      state.progressPlayer += 10;
      this.setState(state);
    } else if (type == 'Backword') {
      let state = this.state;
      this.playbackObject.seek(state.progressPlayer - 10);
      state.progressPlayer -= 10;
      this.setState(state);
    }
  };
  _onError = err => {
    this.setState({isBuffering: false});
  };
  _replay = async () => {
    const {isConnected, details, isDataFetched, isStarted} = this.state;
    if ((details.trailer !== null || details.trailer != undefined) && isDataFetched && isConnected) {
      try {
        this.setState({
          isStarted: true,
          isMuted: true,
          isPushed: false,
        });
        if (!isStarted) {
          this.playbackObject.seek(0);
        }
      } catch (e) {
        console.log(e);
        this.notify('danger', 'Oops!', e, true);
      }
    }
  };
  setControlTimeout = () => {
    setTimeout(() => {
      let state = this.state;
      state.showControls = false;
      this.setState(state);
    }, 1200);
  };
  _onScreenTouch = () => {
    if (!this.state.showControls) {
      let state = this.state;
      state.showControls = true;
      this.setState(state);
      this.setControlTimeout();
    }
  };

  onToggleMute = () => {
    this.setState({
      isMuted: !this.state.isMuted,
    });
  };

  // Render Details View
  render() {
    const {loadingAd, isConnected, isDataFetched, isDownloaded, details, isNotify, title, subtitle, type, action, isDownloading, progress, video, isStarted, isPaused, isMuted, isBuffering, videoQuality, showControls} = this.state;
    let videoPath = details.trailer;
    if (videoPath && Platform.OS === 'android') {
      videoPath = videoPath.replace('https://', 'http://');
    }
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.backgroudColor}}>
        <StatusBar hidden={false} />
        {isNotify && <Alerts show={true} type={type} title={title} subtitle={subtitle} navigation={this.props.navigation} action={action} onRef={ref => (this.parentReference = ref)} parentReference={this.updateNotify.bind(this)} />}
        <LinearGradient colors={['rgba(0,0,0,1)', 'rgba(50,52,54,1)', 'rgba(0,0,0,1)']} style={{flex: 1}}>
          <View style={styles.rightContainer}>
            {!isConnected && (
              <View
                style={{
                  flexGrow: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '2%',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#fff',
                    textAlign: 'center',
                    margin: '5%',
                  }}>
                  There is a problem connecting to Freizeit. Please Try again later.
                </Text>
                <Button title="Retry" color="#191a1f" onPress={() => this.checkConnectivity()} />
              </View>
            )}
            {isConnected && (
              <Viewport.Tracker>
              <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <Animatable.View animation={'slideInLeft'} style={styles.bannerContainer}>
                  <HeaderWithTittle name={details.name} navigation={this.props.navigation} />
                  {details.trailer !== null ? (
                    <LinearGradient colors={['rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'rgba(0,0,0,1)']} style={{flex: 1, justifyContent: 'center'}}>
                      {!isStarted ? (
                        <TouchableWithoutFeedback onPress={this._onScreenTouch} style={{flex: 1, height: 500}}>
                          <Video
                            source={{uri: videoPath}}
                            ref={e => (this.playbackObject = e)}
                            onBuffer={this._onBuffer}
                            onProgress={this._onProgress}
                            onLoadStart={this._onLoadStart}
                            onError={this._onError}
                            onLoad={this._onLoad}
                            onEnd={() => this.setState({isStarted: true, isMuted: true})}
                            bufferConfig={{
                              minBufferMs: 5000,
                              maxBufferMs: 10000,
                            }}
                            rate={1.0}
                            volume={1}
                            muted={isMuted}
                            poster={details.Image}
                            posterResizeMode={'cover'}
                            repeat={false}
                            paused={isPaused} //true
                            resizeMode={'contain'}
                            style={{flex: 1, height: 500}}
                            ignoreSilentSwitch="ignore"
                          />
                        </TouchableWithoutFeedback>
                      ) : (
                        <View style={{flex: 1}}>
                          <Image blurRadius={Platform.OS == 'ios' ? 10 : 5} source={{uri: details.thumbnail}} style={{flex: 1}} />
                          <View style={[styles.episodeImageView, {position: 'absolute'}]}>
                            <View style={styles.episodeImageView}>
                              <Image source={{uri: details.thumbnail}} style={styles.episodeImage} />
                            </View>
                            {details.isSubscribed == 0 ? (
                              details.isPaid == 1 ? (
                                <TouchableOpacity activeOpacity={0.4} style={styles.premiumBadge}>
                                  <Text style={styles.premiumBadgeText}>PAID</Text>
                                </TouchableOpacity>
                              ) : null
                            ) : null}
                          </View>
                        </View>
                      )}
                      {!isBuffering ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            position: 'absolute',
                            alignSelf: 'center',
                          }}>
                          {showControls && this.state.progressPlayer > 1 ? (
                            <TouchableOpacity activeOpacity={0.4} onPress={() => this._onForworBackword('Backword')} style={{marginRight: 20, flexDirection: 'row'}}>
                              <Icon type="AntDesign" name="doubleleft" style={{fontSize: 30, color: '#fff'}} />
                              <Text
                                style={{
                                  fontSize: 18,
                                  color: 'white',
                                  marginLeft: 5,
                                  alignSelf: 'center',
                                }}>
                                10
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                          <TouchableOpacity activeOpacity={0.4} onPress={() => this._toggleTrailer()}>
                            {isStarted || isPaused ? <Icon type="FontAwesome5" name="play" style={{fontSize: 30, color: '#fff'}} /> : showControls ? <Icon type="AntDesign" name="pause" style={{fontSize: 30, color: '#fff'}} /> : null}
                          </TouchableOpacity>
                          {showControls && this.state.progressPlayer > 1 ? (
                            <TouchableOpacity activeOpacity={0.4} onPress={() => this._onForworBackword('Forword')} style={{marginLeft: 20, flexDirection: 'row'}}>
                              <Text
                                style={{
                                  fontSize: 18,
                                  color: 'white',
                                  marginRight: 5,
                                  alignSelf: 'center',
                                }}>
                                10
                              </Text>
                              <Icon type="AntDesign" name="doubleright" style={{fontSize: 30, color: '#fff'}} />
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      ) : null}
                      {isBuffering ? (
                        <View style={{position: 'absolute', alignSelf: 'center'}}>
                          <ActivityIndicator size="large" color="#fff" style={{justifySelf: 'center'}} />
                        </View>
                      ) : null}
                      {/*********************** videoQuality state to check which link to send ***************************/}
                      {details.type != 2 && (
                        <TouchableOpacity activeOpacity={0.7} onPress={() => this._play(details.link, details)} style={styles.videoButtonContainer}>
                          <Icon type="Entypo" name="controller-play" style={{fontSize: 30, color: '#fff'}} />
                          <Text
                            style={{
                              fontSize: 18,
                              color: 'white',
                              fontWeight: 'bold',
                              marginLeft: 5,
                              alignSelf: 'center',
                            }}>
                            Watch Movie
                          </Text>
                        </TouchableOpacity>
                      )}

                      {isMuted ? (
                        <TouchableOpacity
                          activeOpacity={0.4}
                          style={styles.zoomButtonContainer}
                          // style={{ justifyContent:'center',alignItems:'center', position: 'absolute', bottom: 15, right: 25 }}
                          onPress={() => this.onToggleMute()}>
                          <Icon type="FontAwesome5" name="volume-mute" style={{fontSize: 20, color: '#fff'}} />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          activeOpacity={0.4}
                          style={styles.zoomButtonContainer}
                          onPress={() => this.onToggleMute()}
                          // style={{ justifyContent:'center',alignItems:'center', position: 'absolute', bottom: 15, right: 25 }}
                        >
                          <Icon type="FontAwesome5" name="volume-up" style={{fontSize: 20, color: '#fff'}} />
                        </TouchableOpacity>
                      )}
                    </LinearGradient>
                  ) : (
                    <View style={{flex: 1}}>
                      <Image blurRadius={Platform.OS == 'ios' ? 10 : 5} source={{uri: details.thumbnail}} style={{flex: 1}} />
                      <View style={[styles.episodeImageView, {position: 'absolute'}]}>
                        <View style={styles.episodeImageView}>
                          <Image source={{uri: details.thumbnail}} style={styles.episodeImage} />
                        </View>
                        {details.isSubscribed == 0 ? (
                          details.isPaid == 1 ? (
                            <TouchableOpacity activeOpacity={0.4} style={styles.premiumBadge}>
                              <Text style={styles.premiumBadgeText}>PAID</Text>
                            </TouchableOpacity>
                          ) : null
                        ) : null}
                        {/* <TouchableOpacity activeOpacity={0.4} onPress={() => this._back()} style={styles.closeButtonContainer}>
                                    <Icon type= "AntDesign" name='close'style={{size: 25, color: '#ff0000'}}/>
                                    </TouchableOpacity> */}
                      </View>
                      {details.type != 2 && (
                        <TouchableOpacity activeOpacity={0.7} onPress={() => this._play(details.link, details)} style={styles.videoButtonContainer}>
                          <Icon type="Entypo" name="controller-play" style={{fontSize: 30, color: '#fff'}} />
                          <Text
                            style={{
                              fontSize: 18,
                              color: 'white',
                              fontWeight: 'bold',
                              marginLeft: 5,
                              alignSelf: 'center',
                            }}>
                            Watch Movie
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </Animatable.View>
                <Animatable.View animation={'slideInRight'} delay={4} style={styles.iconContainer}>
                  <View style={styles.iconView}>
                    <Text style={[styles.headerText, {flex: 1}]} numberOfLines={1}>
                      {details.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => this.shareButton()}
                      style={{
                        flex: 0.2,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                      }}>
                      <Icon type="AntDesign" name="sharealt" style={{fontSize: 25, color: '#fff'}} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.wishlistButton()}
                      style={{
                        flex: 0.2,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                      }}>
                      {/* <Icon  type= "Entypo" name={this.state.isFavourite ? "star" : "star-outlined"}  style={{fontSize: 25, color: '#fff'}} size={this.state.isFavourite ? 22 : 25} color={this.state.isFavourite ? '#FFDF00' : '#fff'} /> */}
                      <Icon type="Entypo" name={this.state.isFavourite ? 'star' : 'star-outlined'} style={{fontSize: 25, color: '#fff'}} />
                    </TouchableOpacity>
                    {!isDownloading && this.props.route?.params?.type == 1 && isDownloaded == 0 && (
                      <TouchableOpacity
                        onPress={() => this.downloadtButton(details.id)}
                        style={{
                          flex: 0.2,
                          justifyContent: 'center',
                          alignItems: 'flex-end',
                        }}>
                        <Icon type="FontAwesome" name="cloud-download" style={{fontSize: 25, color: '#fff'}} />
                      </TouchableOpacity>
                    )}

                    {isDownloading && isDownloaded == 0 && (
                      <View
                        style={{
                          flex: 0.2,
                          justifyContent: 'center',
                          alignItems: 'flex-end',
                        }}>
                        {Math.round(progress) == 0 && <ActivityIndicator size="small" color="#ff0000" />}
                        {Math.round(progress) > 0 && (
                          <TouchableOpacity onPress={() => this.cancelDownload(details.id)}>
                            <ProgressCircle percent={Math.round(progress)} radius={12} borderWidth={2} color="#ff0000" shadowColor="#bbb" bgColor="rgba(50,52,54,1)" />
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                    {!isDownloading && this.props.route?.params?.type == 1 && isDownloaded == 1 && (
                      <View
                        style={{
                          flex: 0.2,
                          justifyContent: 'center',
                          alignItems: 'flex-end',
                        }}>
                        <Icon type="Entypo" name="thumbs-up" style={{fontSize: 30, color: '#fff'}} />
                      </View>
                    )}
                  </View>
                </Animatable.View>

                <Animatable.View animation={'slideInLeft'} delay={4} style={styles.statsContainer}>
                  <View style={styles.statsView}>
                    <Text style={styles.statsHeader}>YEAR</Text>
                    <Text style={styles.statsText}>{details.year}</Text>
                  </View>
                  <View style={styles.statsView}>
                    <Text style={styles.statsHeader}>COUNTRY</Text>
                    <Text style={styles.statsText}>{details.country != null ? details.country : 'None'}</Text>
                  </View>
                  <View style={styles.statsView}>
                    <Text style={styles.statsHeader}>LANGUAGE</Text>
                    <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.statsText, {width: '63%'}]}>
                      {details.language != null ? details.language : 'None'}
                    </Text>
                  </View>
                  {this.props.route?.params?.type == 1 && (
                    <View style={styles.statsView}>
                      <Text style={styles.statsHeader}>LENGTH</Text>
                      <Text style={styles.statsText}>{this.convertMinsToTime(details.runtime)}</Text>
                    </View>
                  )}
                  {this.props.route?.params?.type == 2 && (
                    <View style={styles.statsView}>
                      <Text style={styles.statsHeader}>GENRE</Text>
                      <Text style={styles.statsText} numberOfLines={1}>
                        {details.generes}
                      </Text>
                    </View>
                  )}
                </Animatable.View>
                {this.props.route?.params?.type == 1 && (
                  <Animatable.View animation={'slideInRight'} delay={4} style={styles.descriptionContainer}>
                    <View style={styles.descriptionView}>
                      <Text style={styles.descriptionText} numberOfLines={4}>
                        {details.description}
                      </Text>
                    </View>
                    <View style={styles.subDescriptionView}>
                      <Text style={styles.subDescriptionText} numberOfLines={1}>
                        Director: {details.director != null ? details.director : 'Colin Morgan, Bradley James'}
                      </Text>
                      <Text style={styles.subDescriptionText} numberOfLines={1}>
                        Cast: {details.cast != null ? details.cast : 'Julian Jones, Jake Michie'}
                      </Text>
                    </View>
                  </Animatable.View>
                )}

                <SequentialBanner />

                {/* Episode if any */}
                {this.state.details.type == 2 && <Episodes details={this.state.details} navigation={this.props.navigation} playAd={this._playAd} />}
                {/* Episode if any */}
                {this.state.related_items.length > 0 && (
                  <Animatable.View animation={'slideInUp'} delay={4} style={styles.middleContainer}>
                    <View style={styles.thumbnailHeaderContainer}>
                      <Text style={styles.thumbnailHeader}> More Like This</Text>
                    </View>
                    <View style={styles.thumbnailHeaderDivider} />
                    <View style={styles.contentContainer}>
                      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {this.renderRelatedItems()}
                      </ScrollView>
                    </View>
                  </Animatable.View>
                )}
              </ScrollView>
              </Viewport.Tracker>
            )}
          </View>
        </LinearGradient>
        {!!loadingAd && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  // console.log(`map state to props home `, state);
  return {
    info: state.info,
    token: state.token,
    movies: state.movies,
    latestmovies: state.latestmovies,
    wifi: state.wifi,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userInfo: bindActionCreators(userInfo, dispatch),
    loginToken: bindActionCreators(loginToken, dispatch),
    latestMovies: bindActionCreators(latestMovies, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);
