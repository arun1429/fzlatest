import React, {Component} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity, Share, Platform, ActivityIndicator, TouchableWithoutFeedback, AppState, Alert, Button} from 'react-native';
//Library
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Orientation from 'react-native-orientation';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
//API
import HttpRequest from '../../../utils/HTTPRequest';
//Redux
import {connect} from 'react-redux';
import {userInfo, loginToken, latestMovies} from '../../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';
//components
import BottomLine from '../../../components/BottomHorizontalLine/';
import StatusBar from '../../../components/StatusBar/';
import Alerts from '../../../components/Alerts/';
//style
import styles from './styles';
import {EventRegister} from 'react-native-event-listeners';

class ComingSoonDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDataFetched: false,
      details: {},
      related_items: [],
      isNotify: false,
      title: '',
      subtitle: '',
      type: '',
      action: false,
      isPaused: true,
      isPushed: false,
      isMuted: true,
      video: '',
      isBuffering: false,
      appState: AppState.currentState,
      isConnected: false,
      videoQuality: 2,
      showControls: true,
    };
  }

  componentDidMount() {
    Orientation.lockToPortrait();
    this.checkNetworkConnectivity();
    this.listener = EventRegister.addEventListener('onDidFocus', data => {
      this.refresh();
    });
    this.appStateSubscription = AppState.addEventListener('change', this._handleAppStateChange);
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
          //Get ComingSoon Details Results
          this.getComingSoonDetails();
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
        //Get ComingSoon Details Results
        this.getComingSoonDetails();
        this.getSettings();
      }
    });

    // Unsubscribe
    unsubscribe();
  };

  componentWillUnmount() {
    this.setState({
      isPaused: true,
      isMuted: true,
    });
    EventRegister.removeEventListener(this.listener);
    this.onBlur();
    this.appStateSubscription.remove();
  }

  _handleAppStateChange = nextAppState => {
    this.setState({appState: nextAppState, isPaused: true, isMuted: true});
  };

  onBlur = () => {
    this.setState({
      isPaused: true,
      isMuted: true,
    });
  };

  refresh = () => {
    this.checkNetworkConnectivity();
    this._replay();
  };

  getComingSoonDetails = () => {
    this.setState({isDataFetched: false, details: {}});
    if (this.props.token !== '') {
      HttpRequest.getComingSoonDetails(this.props.token, this.props.route?.params?.itemId)
        .then(res => {
          this.setState({isDataFetched: true});
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            this.setState({
              details: result.data,
            });
            // console.log("Coming Soon Details",result.data)
            if (this.props.route?.params?.type == 1) {
              this.getRelatedMovies();
            } else {
              this.getRelatedSeries();
            }
          } else {
            this.setState({details: {}});
            console.log('Coming Soon Detail API Error : ', result);
            this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, result.message != undefined ? true : true);
          }
        })
        .catch(err => {
          this.setState({isDataFetched: true, details: {}});
          console.log('Coming Soon Detail API Catch Exception: ', err);
          this.notify('danger', 'Oops!', 'Something Went Worng!', false);
        });
    } else {
      this.setState({isDataFetched: true, details: {}});
      console.log('Series Detail Error: Token not found');
      this.notify('danger', 'Oops!', 'We are unable to process your request at the moment! Please try again later.', false);
    }
  };

  getRelatedMovies = () => {
    if (this.props.token !== '') {
      HttpRequest.getRelatedMovies(this.props.token, this.props.route?.params?.itemId)
        .then(res => {
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            this.setState({
              related_items: result.data,
            });
          } else {
            console.log('Related Movies API Error : ', result);
            this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, result.message != undefined ? false : true);
          }
        })
        .catch(err => {
          console.log('Related Movies API Catch Exception: ', err);
          this.notify('danger', 'Oops!', 'Something Went Worng!', false);
        });
    } else {
      console.log('Related Movies Error: Token not found');
      this.notify('danger', 'Oops!', 'We are unable to process your request at the moment! Please try again later.', false);
    }
  };

  getRelatedSeries = () => {
    if (this.props.token !== '') {
      HttpRequest.getRelatedSeries(this.props.token, this.props.route?.params?.itemId)
        .then(res => {
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            this.setState({
              related_items: result.data,
            });
          } else {
            console.log('Related Series API Error : ', result);
            this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, result.message != undefined ? false : true);
          }
        })
        .catch(err => {
          console.log('Related Series API Catch Exception: ', err);
          this.notify('danger', 'Oops!', 'Something Went Worng!', false);
        });
    } else {
      console.log('Related Series Error: Token not found');
      this.notify('danger', 'Oops!', 'We are unable to process your request at the moment! Please try again later.');
    }
  };

  shareButton = () => {
    let {details} = this.state;
    let link = Platform.OS == 'android' ? 'https://play.google.com/store/apps/details?id=com.freizeitMedia&hl=en_US' : 'https://apps.apple.com/in/app/freizeit-media/id1529561669';
    Share.share({
      message: 'Hey! Did you know that "' + details.name + '" is coming soon on Freizeit App. Check this out! ' + link,
    })
      .then(result => console.log(result))
      .catch(errorMsg => console.log(errorMsg));
  };

  convertMinsToTime = mins => {
    let hours = Math.floor(mins / 60);
    let minutes = mins % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours} Hr ${minutes} Min`;
  };

  navigate = (itemId, itemType) => {
    const {isPushed} = this.state;
    if (!isPushed) {
      this.setState({
        isPaused: true,
        isMuted: true,
        isPushed: true,
      });
      this.props.navigation.push('Details', {itemId: itemId, type: itemType});
    }
  };

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

  //Get All setting Details
  getSettings = () => {
    if (this.props.token !== '') {
      HttpRequest.getSettings(this.props.token)
        .then(res => {
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            this.setState({
              videoQuality: result.video_quality,
            });
          } else {
            console.log('Setting Detail API Error : ', result);
            this.setState({
              videoQuality: 2,
            });
          }
        })
        .catch(err => {
          this.setState({isLoading: false, videoQuality: 2});
          console.log('Setting Detail API Catch Exception: ', err);
        });
    } else {
      this.setState({isLoading: false, videoQuality: 2});
      console.log('Setting Details Error: Token not found');
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
      isPaused: true,
    });
  };
  //Notification Alerts CLose
  updateNotify() {
    this.setState({
      isPaused: true,
      isNotify: false,
    });
  }

  _back = () => {
    this.setState({
      isPaused: true,
    });
    this.props.navigation.navigate('Home');
  };

  _play = path => {
    this.setState({
      isPaused: true,
    });
    this.props.navigation.navigate('Video', {videoPath: path});
  };

  _toggleTrailer = () => {
    const {isPaused} = this.state;
    this.setState({
      isPaused: !isPaused,
      isMuted: !isPaused ? true : false,
      isBuffering: false,
    });
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

  _onLoad = () => {
    this.setState({isBuffering: false});
    if (this.state.showControls) {
      this.setControlTimeout();
    }
  };

  _onProgress = () => {
    this.setState({isBuffering: false});
  };

  _onError = err => {
    this.setState({isBuffering: false});
  };

  _replay = async () => {
    const {details, isPaused, isConnected} = this.state;
    if ((details.trailer !== '' || details.trailer !== null) && isConnected) {
      try {
        this.setState({
          isPaused: true,
          isMuted: true,
        });
        if (!isPaused) {
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

  render() {
    const {isConnected, details, isNotify, title, subtitle, type, action, isPaused, isMuted, isBuffering, videoQuality, showControls} = this.state;
    let videoPath = details.trailer !== null ? details.trailer : '';

    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        {isNotify && <Alerts show={true} type={type} title={title} subtitle={subtitle} navigation={this.props.navigation} action={action} onRef={ref => (this.parentReference = ref)} parentReference={this.updateNotify.bind(this)} />}
        <LinearGradient colors={['rgba(0,0,0,1)', 'rgba(50,52,54,1)', 'rgba(0,0,0,1)']} style={{flex: 1}}>
          <View style={styles.rightContainer}>
            {!isConnected && (
              <View style={{flexGrow: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '2%'}}>
                <Text style={{fontSize: 16, fontWeight: '600', color: '#fff', textAlign: 'center', margin: '5%'}}>There is a problem connecting to Freizeit. Please Try again later.</Text>
                <Button title="Retry" color="#191a1f" onPress={() => this.checkNetworkConnectivity()} />
              </View>
            )}
            {isConnected && (
              <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <Animatable.View animation={'slideInLeft'} style={styles.bannerContainer}>
                  {details.trailer !== null ? (
                    <LinearGradient colors={['rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'rgba(0,0,0,1)']} style={{flex: 1, justifyContent: 'center'}}>
                      {!isPaused ? (
                        <TouchableWithoutFeedback onPress={this._onScreenTouch} style={{flex: 1, height: 500}}>
                          <Video
                            source={{uri: videoPath.replace('360p', videoQuality == 0 ? '360p' : videoQuality == 1 ? '480p' : '720p')}} // Can be a URL or a local file.
                            ref={e => (this.playbackObject = e)}
                            onBuffer={this._onBuffer}
                            onProgress={this._onProgress}
                            onLoadStart={this._onLoadStart}
                            onError={this._onError}
                            onLoad={this._onLoad}
                            onEnd={() => this.setState({isPaused: true})}
                            bufferConfig={{
                              minBufferMs: 5000,
                              maxBufferMs: 10000,
                            }}
                            rate={1.0}
                            volume={1}
                            muted={isMuted}
                            repeat={false}
                            paused={isPaused}
                            resizeMode={'contain'}
                            posterResizeMode={'cover'}
                            poster={details.image}
                            style={{flex: 1, height: 500}}
                            ignoreSilentSwitch="ignore"
                          />
                        </TouchableWithoutFeedback>
                      ) : (
                        <View style={{flex: 1}}>
                          <Image blurRadius={Platform.OS == 'ios' ? 10 : 5} source={{uri: details.thumbnail}} style={{flex: 1}} />
                          <View style={[styles.episodeImageView, {position: 'absolute'}]}>
                            <View style={styles.episodeImageView}>
                              <FastImage
                                style={styles.episodeImage}
                                source={{
                                  uri: details.thumbnail,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                              />
                            </View>
                            <TouchableOpacity activeOpacity={0.4} onPress={() => this._back()} style={styles.closeButtonContainer}>
                              <Ionicons name="ios-close" size={35} color={'#ff0000'} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                      {!isBuffering ? (
                        <TouchableOpacity activeOpacity={0.4} onPress={() => this._toggleTrailer()} style={{position: 'absolute', alignSelf: 'center'}}>
                          {isPaused ? <Ionicons name="ios-play-circle" size={60} color={'#fff'} /> : showControls ? <Ionicons name="ios-pause" size={60} color={'#fff'} /> : null}
                        </TouchableOpacity>
                      ) : null}
                      {isBuffering ? (
                        <View style={{position: 'absolute', alignSelf: 'center'}}>
                          <ActivityIndicator size="large" color="#fff" style={{jusjustifySelf: 'center'}} />
                        </View>
                      ) : null}
                      {!isBuffering ? (
                        <TouchableOpacity activeOpacity={0.4} onPress={() => this._toggleVolume()} style={styles.volumeButtonContainer}>
                          {isMuted ? <Ionicons name="ios-volume-off" size={30} color={'#fff'} /> : <Ionicons name="ios-volume-high" size={30} color={'#fff'} />}
                        </TouchableOpacity>
                      ) : null}

                      <TouchableOpacity activeOpacity={0.4} onPress={() => this._back()} style={styles.closeButtonContainer}>
                        <Ionicons name="ios-close" size={35} color={'#ff0000'} />
                      </TouchableOpacity>
                    </LinearGradient>
                  ) : (
                    <View style={{flex: 1}}>
                      <Image blurRadius={Platform.OS == 'ios' ? 10 : 5} source={{uri: details.thumbnail}} style={{flex: 1}} />
                      <View style={[styles.episodeImageView, {position: 'absolute'}]}>
                        <View style={styles.episodeImageView}>
                          <FastImage
                            style={styles.episodeImage}
                            source={{
                              uri: details.thumbnail,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        </View>
                        <TouchableOpacity activeOpacity={0.4} onPress={() => this._back()} style={styles.closeButtonContainer}>
                          <Ionicons name="ios-close" size={35} color={'#ff0000'} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </Animatable.View>
                <Animatable.View animation={'slideInRight'} delay={4} style={styles.iconContainer}>
                  <View style={styles.iconView}>
                    <Text style={[styles.headerText, {flex: 1}]} numberOfLines={1}>
                      {details.name}
                    </Text>
                    <TouchableOpacity onPress={() => this.shareButton()} style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
                      <Ionicons name="md-share" size={30} color="#fff" style={{marginLeft: '5%'}} />
                    </TouchableOpacity>
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
                    <Text style={styles.statsText}>{details.language != null ? details.language : 'None'}</Text>
                  </View>
                </Animatable.View>
                <Animatable.View animation={'slideInRight'} delay={4} style={styles.descriptionContainer}>
                  <View style={styles.descriptionView}>
                    <Text style={styles.descriptionText} numberOfLines={3}>
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
                {this.state.related_items.length > 0 ? (
                  <Animatable.View animation={'slideInUp'} delay={4} style={styles.middleContainer}>
                    <View style={styles.thumbnailHeaderContainer}>
                      <Text style={styles.thumbnailHeader}> More Like This</Text>
                    </View>
                    <View style={styles.thumbnailHeaderDivider} />
                    <View style={styles.contentContainer}>
                      <ScrollView horizontal={true}>{this.renderRelatedItems()}</ScrollView>
                    </View>
                  </Animatable.View>
                ) : null}
              </ScrollView>
            )}
            <Animatable.View animation={'slideInUp'} style={styles.footerContainer}>
              <BottomLine />
            </Animatable.View>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const mapStateToProps = state => {
  // console.log(`map state to props home `, state);
  return {
    token: state.token,
    movies: state.movies,
    latestmovies: state.latestmovies,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userInfo: bindActionCreators(userInfo, dispatch),
    loginToken: bindActionCreators(loginToken, dispatch),
    latestMovies: bindActionCreators(latestMovies, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComingSoonDetails);
