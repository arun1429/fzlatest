import React, {Component} from 'react';
import {View, Text, StyleSheet, AppState, Animated, Dimensions, Platform, TouchableOpacity, Linking} from 'react-native';
import VideoPlayerView from '../../components/VideoPlayerView/';
import VideoPlayer from 'react-native-video-controls';
import {TextTrackType} from 'react-native-video';
import { getVideoDuration } from 'react-native-video-duration';
import Orientation from 'react-native-orientation';
import * as Animatable from 'react-native-animatable';
import {EventRegister} from 'react-native-event-listeners';
import GetLocation from 'react-native-get-location';
import Geocoder from 'react-native-geocoding';
//API
import HttpRequest from '../../utils/HTTPRequest';
//Redux
import {connect} from 'react-redux';
import {userInfo, setVideoDisplayedAds, setVideoCurrentIndex} from '../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';

var {height, width} = Dimensions.get('window');

class VideoPlayerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDataFetched: false,
      progress     : '',
      duration     : '',
      wifi         : 0,
      videoQuality : 2,
      selectedTrack: '',
      appState     : AppState.currentState,
      videoPaused  : false,
      layout       : {
        height: height,
        width : width,
      },
      orientation       : -100,   // -100 for -90deg and 100 for 90deg
      currentLocatonShow: '',
      addressDetail     : [],
      showCustomAd: false,
      adPlayCount: 0,
      adStartTimes: [],
      adDisplayed: false,
      isSkipBtnVisible: false,
      videoLinks: [],
    };
    this.RotateValueHolder = new Animated.Value(0);
    this.rewardedAdEventListener = null;
    this.videoRef = React.createRef();
  }

  // 'https://video.gumlet.io/661aa6072f2afe335b84e8b3/661aa69b2f2afe335b84ee27/download.mp4',
  //       'https://video.gumlet.io/660b908abe7f6999effffb9e/660b90dbbe7f6999effffe66/download.mp4',
  //       'https://video.gumlet.io/661aa6072f2afe335b84e8b3/661aa7202f2afe335b84f1c7/download.mp4',
  //       'https://video.gumlet.io/661aa6072f2afe335b84e8b3/661aa7602f2afe335b84f3a1/download.mp4'


  componentDidMount() {
    EventRegister.emit('videoPaused', {
      isClosed: 'false',
    });
    
    Geocoder.init('AIzaSyBtVxQKIzdnxWOgUg4BOLTCWdYSWDAFIfk');
    GetLocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 }).then(location => {
        // console.log(location);
        this.setState({addressDetail: location});
        Geocoder.from(location.latitude, location.longitude)
          .then(json => {
            // console.log('Geo Coder response ', json.data);
            var addressComponent = json.results[0].address_components[1].short_name + ', ' + json.results[0].address_components[5].short_name;
            // console.log(addressComponent);
            // AsyncStorage.setItem("currentAddress", addressComponent)
            this.setState({currentLocatonShow: addressComponent});
          })
          .catch(error => {
            // console.warn(error)
          });
    }).catch(error => {
        const {code, message} = error;
        // console.warn(code, message);
    });

    this.getVideoAds();
    this.appStateSubscription = AppState.addEventListener('change', this._handleAppStateChange);
    this.checkSettings();
    // this.calculateAdStartTime();
    Orientation.lockToLandscape();
    this.orientationChangeHandler();
    this.getNextLink();
  
    // Don't work on android
    Orientation.addSpecificOrientationListener(this.orientationChangeHandler);
  }

  StartImageRotateFunction() {
    Animated.timing(this.RotateValueHolder, {
      toValue: this.state.orientation,
      duration: 500,
      // easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  getVideoAds = () => {
    // console.log("Get Video ADS from reducer :: ",this.props.videoAds);
    if ( this.props.videoAds.length > 0) {
      this.setState({videoLinks: this.props.videoAds});
      this.calculateAdStartTime();
    }
  }

  orientationChangeHandler = currentOrientation => {
    if (Platform.OS !== 'ios') {
      this.setState({
        orientation: 0,
      });
    } else {
      this.setState(
        {
          orientation: currentOrientation === 'LANDSCAPE-RIGHT' ? -100 : 100,
        },
        this.StartImageRotateFunction,
      );
    }
  };

  componentWillUnmount() {
    this.addToView();
    this.appStateSubscription.remove();
    // Remember to remove listener

    Orientation.removeSpecificOrientationListener(this.orientationChangeHandler);

    const {progress, duration} = this.state;
    const {goBack} = this.props.navigation;
    //this.showAds();
    // console.log('Adding To watchlist | Progress: ',progress,'Duration:'+duration)
    if (progress != '' && duration != '') {
      // console.log('Adding To watchlist | Progress: ',progress,'Duration:'+duration)
      this.addToWatchlist(progress, duration, true);
      // rewarded.show();
      //this.showAds();
    }
    // if(this.rewardedAdEventListener!==null){
    //     this.rewardedAdEventListener()
    //    }
    // if(this.Listener!==null){
    //     this.Listener()
    //    }
  }

  loadAd = () => {
    this.setState({
      loaded: false,
    });
  };

  showAds = () => {
    if (!this.state.loaded) {
      console.log('null');
      return null;
    } else {
    }
  };

  _onLayout = event => {
    this.setState({
      layout: {
        height: event.nativeEvent.layout.width,
        width: event.nativeEvent.layout.height,
      },
    });
  };

  getNextLink = () => {
    const { displayedVideoAds, currentVideoAdIndex, setVideoCurrentIndex, setVideoDisplayedAds } = this.props;
    const { videoLinks } = this.state;
    if (displayedVideoAds.length === videoLinks.length) {
      // If all links have been displayed, reset displayedLinks and currentIndex
      setVideoDisplayedAds([]);
      setVideoCurrentIndex(0);
    } else {
      // Get the next link that has not been displayed yet
      let nextIndex = currentVideoAdIndex;
      while (displayedVideoAds.includes(videoLinks[nextIndex])) {
        nextIndex = (nextIndex + 1) % videoLinks.length;
      }
     
      // Update displayedLinks and currentIndex
      setVideoDisplayedAds([...displayedVideoAds, videoLinks[nextIndex]]);
      setVideoCurrentIndex(nextIndex);  
    }
  };

  /*
   * App State Listener
   *
   * */
  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.setState({videoPaused: false, appState: nextAppState});
    } else {
      this.setState({videoPaused: true, appState: nextAppState});
    }
  };

  //Check for setting before video begins
  checkSettings = () => {
    this.setState({isDataFetched: false});
    // if(this.props.token !== ''){
    HttpRequest.getSettings(this.props.token)
      .then(res => {
        const result = res.data;
        // console.log('get Movie', res.data);
        if (res.status == 200 && result.error == false) {
          this.setState({
            isDataFetched: true,
            wifi: result.wifi,
            videoQuality: result.video_quality,
          });
        } else {
          // console.log('Setting Detail API Error : ', result);
          this.setState({
            isDataFetched: false,
            wifi: 0,
            videoQuality: 2,
          });
        }
      })
      .catch(err => {
        console.log('Setting Detail API Catch Exception: ', err);
        this.setState({
          isDataFetched: false,
          wifi: 0,
          videoQuality: 2,
        });
      });
  };

  _back() {
    const { progress, duration } = this.state;
    const { goBack } = this.props.navigation;
  
    if (progress !== '' && duration !== '') {
      this.addToWatchlist(progress, duration, false);
    } else {
      goBack();
    }
  }

  calculateAdStartTime = async ( ) => {
    let adStartTimes = [];
    
    let videoPath = this.props.route?.params?.videoPath.toString();
    
    // For android video does not play with https
    if (Platform.OS === 'android') {
      videoPath = videoPath.replace('https://', 'http://');
    }

    const result = await getVideoDuration(videoPath);
    const  duration = Math.round(result/60); //Duration in minutes

    if (duration <= 30) {
      // If duration is 30 minutes or less, only show ad at the start
      adStartTimes  = [0];
    } else if (duration <= 60) {
      // If duration is between 30 and 60 minutes, show ad at the start and in the middle
      adStartTimes  = [0, duration / 3];
    } else if (duration <= 120) {
      // If duration is between 60 and 120 minutes, show ad at the start, in the middle, and at the end
      adStartTimes  = [0, duration / 3, duration/2];
    } else {
      // If duration is more than 120 minutes, show ad at the start and every 30 minutes thereafter
      adStartTimes  = Array.from({ length: Math.floor(duration / 30) }, (_, i) => i * 30);
    }

    this.setState({ adStartTimes, videoPaused: true, showCustomAd: true, adPlayCount: adStartTimes.length == 1 ? 0 : 1});
  };

  onProgress = progress => {
    const { adStartTimes, showCustomAd, adPlayCount } = this.state;
    const formattedProgress = this.formatTime(progress.currentTime.toFixed(2));
    if (Math.round(progress.currentTime/60) >= adStartTimes[adPlayCount] && adStartTimes[adPlayCount] > 0 && !showCustomAd ) {
      this.setState({ 
        showCustomAd: true,
        progress: formattedProgress, 
        videoPaused: true,
        adPlayCount: adPlayCount + 1
      });
    } else {
      this.setState({  progress: formattedProgress });
    }
  };

  onAdProgress = progress => {
    if (Math.round(progress.currentTime) == 15){
      // 15 seconds wait time before showing skip button
      this.setState({ isSkipBtnVisible: true });
    }
  }

  handleLoad = meta => {
    const { adStartTimes } = this.state;
    const showCustomAd = adStartTimes === 0;
    const duration = this.formatTime(meta.duration);
    this.setState({ 
      duration: duration
    });
  };

  formatTime = (time = 0) => {
    const formattedMinutes = Math.floor(time / 60).toFixed(0);
    const formattedSeconds = Math.floor(time % 60).toFixed(0);

    return `${formattedMinutes}.${formattedSeconds}`;
  };

  addToWatchlist = (current, total, callStatus) => {
    const {goBack} = this.props.navigation;

    if (this.props.token !== '') {
      // console.log(' watchlist_id:' + this.props.route?.params?.details.id + ' type:' + this.props.route?.params?.details.type + ' current:' + current + ' total:' + total);
      HttpRequest.addToWatchlist(this.props.token, {
        watchlist_id: this.props.route?.params?.details.id,
        type: this.props.route?.params?.details.type,
        current: current,
        total: total,
      })
        .then(res => {
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            console.log('Added to Wachlist');
          } else {
            console.log('Add To Watchlist API Error : ', result.status);
          }
          if (callStatus) {
            goBack();
            // rewarded.show();
            // this.showAds();
          }
          goBack();
        })
        .catch(err => {
          // console.log('Add To Watchlist API Catch Exception: ', err);
          if (callStatus) {
            goBack();
            // rewarded.show();
            //this.showAds();
          }
          goBack();
          // rewarded.show();
          //this.showAds();
        });
    } else {
      // console.log('Add To Watchlist Error: Token not found');
      if (callStatus) {
        goBack();
        // rewarded.show();
        //this.showAds();
      }
      goBack();
      // rewarded.show();
      //this.showAds();
    }
  };

  addToView = () => {
    // console('check the details data ' , this.props.route?.params?.details.id)
    const obj = {
      view_id: this.props.route?.params?.details.type === '2' ? this.props.route?.params?.series_id_details : this.props.route?.params?.details.id,
      name: this.props.route?.params?.details.name,
      types: this.props.route?.params?.details.type,
      address: this.state.currentLocatonShow,
      lat: this.state.addressDetail != 0 ? this.state.addressDetail.latitude : '',
      lng: this.state.addressDetail != 0 ? this.state.addressDetail.longitude : '',
      username: this.props.token != '' ? this.props.info.name : '',
      email: this.props.token != '' ? this.props.info.email : '',
    };
    // console.log('view count ', obj);

    HttpRequest.viewCount(obj)
      .then(res => {
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          console.log('Added to View Count');
        } else {
          // console.log('Add To View Count Error : ', result.status);
        }
      })
      .catch(err => {
        console.log('Add To View Count Catch Exception: ', err);
      });
  };

  videoError = err => {
    console.log('Video Play Error', err);
  };

  onCustomAdEnd = () => {
      this.setState({ showCustomAd: false, videoPaused: false, isSkipBtnVisible: false });
      this.getNextLink();
  };

  onAdVideoCta = (link) => {
    Linking.openURL(link);
  }

  render() {
    const {videoQuality, showCustomAd, isSkipBtnVisible, adStartTimes, adPlayCount, videoPaused, videoLinks} = this.state;
    const {currentVideoAdIndex} = this.props;
    const title = this.props.route?.params?.details.name.length > 20 ? this.props.route?.params?.details.name.substring(0, 20) + '...' : this.props.route?.params?.details.name;

    let videoPath = this.props.route?.params?.videoPath.toString();

    // For android video does not play with https
    if (Platform.OS === 'android') {
      videoPath = videoPath.replace('https://', 'http://');
    }

    const RotateData = this.RotateValueHolder.interpolate({
      inputRange: [0, 100],
      outputRange: ['0deg', '90deg'],
    });
    
    const adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/' + 'ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp' + '&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite' + '%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator=';

    return (
      <View style={styles.container} onLayout={this._onLayout}>
        <Animatable.View
          style={{
            height: width,
            width: height,
            backgroundColor: '#000',
            transform: [{rotate: RotateData}],
          }}>

          {this.props.route?.params?.details.subtitle != null   ? (
            <VideoPlayerView
              source={{
                uri: videoPath.replace('360p', videoQuality == 0 ? '360p' : videoQuality == 1 ? '480p' : '720p'),
              }}
              title={title}
              ref={this.videoRef}
              onError={this.videoError}
              videoPaused={videoPaused}
              paused={videoPaused}
              onProgress={this.onProgress}
              onLoad={this.handleLoad}
              onBack={() => this._back()}
              onEnd={() => this._back()}
              seek={adStartTimes[adPlayCount-1] ? adStartTimes[adPlayCount-1] * 60 : 0}
              repeat={false}
              minLoadRetryCount={10}
              adTagUrl={adTagUrl}
              adStartTimes={adStartTimes}
              selectedTextTrack={{
                type: 'default',
                value: this.props.route?.params?.details.type === '2' ? this.props.route?.params?.details.subtitle[0].title : this.props.route?.params?.details.subtitle.title,
              }}
              textTracks={[
                {
                  title: this.props.route?.params?.details.type === '2' ? this.props.route?.params?.details.subtitle[0].title : this.props.route?.params?.details.subtitle.title,
                  language: this.props.route?.params?.details.type === '2' ? this.props.route?.params?.details.subtitle[0].language : this.props.route?.params?.details.subtitle.language,
                  type: TextTrackType.VTT, // "text/vtt"
                  index: 0,
                  uri: this.props.route?.params?.details.type === '2' ? this.props.route?.params?.details.subtitle[0].uri : this.props.route?.params?.details.subtitle.uri,
                },
              ]}
              style={[styles.backgroundVideo, {height: this.state.layout.height}]}
            />
          ) : (
            <VideoPlayerView
              source={{
                uri: videoPath.replace('360p', videoQuality == 0 ? '360p' : videoQuality == 1 ? '480p' : '720p'),
              }}
              title={title}
              ref={this.videoRef}
              onError={this.videoError}
              videoPaused={videoPaused}
              paused={videoPaused}
              onProgress={this.onProgress}
              onLoad={this.handleLoad}
              seek={adStartTimes[adPlayCount-1] ? adStartTimes[adPlayCount-1] * 60 : 0}
              onBack={() => this._back()}
              onEnd={() => this._back()}
              repeat={false}
              adStartTimes={adStartTimes}
              minLoadRetryCount={10}
              adTagUrl={adTagUrl}
              style={[styles.backgroundVideo]}
            />
          )}

          {showCustomAd &&
          <View style={[styles.adContainer,  { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}>
            <VideoPlayer
              source={{ uri: videoLinks[currentVideoAdIndex].upload_file }}
              style={styles.ad}
              resizeMode="cover"
              onEnd={this.onCustomAdEnd}
              seekColor={'red'}
              onProgress={this.onAdProgress}
              disableVolume
              disableTimer
              disableBack
              disablePlayPause
              disableSeekbar
              disableFullscreen
            />
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.onAdVideoCta(videoLinks[currentVideoAdIndex].upload_cta_link) } style={styles.adTextContainer}>
            <Text style={styles.watermark}>Freizeit Ads</Text>
            </TouchableOpacity>
            {isSkipBtnVisible &&
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.onCustomAdEnd() } style={styles.skipBtnContainer}>
            <Text style={styles.skipText}>Skip Ad</Text>
            </TouchableOpacity>
            }
          </View>
          }
          
        </Animatable.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundVideo: {
    flex: 1,
  },
  ad: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  adContainer: {
    flex: 1,
    position: 'relative',
  },
  adTextContainer: {
    position: 'absolute',
    top: 10,
    right: 50,
    backgroundColor: 'rgba(255, 255, 255, .4)',
    borderRadius: 2,
    padding: 10,
    zIndex: 2,
  },
  watermark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  skipBtnContainer: {
    position: 'absolute',
    bottom: 10,
    right: 50,
    backgroundColor: 'rgba(255, 255, 255, .4)',
    borderRadius: 2,
    padding: 10,
    zIndex: 2,
    
  },
  skipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  }
});

const mapStateToProps = state => {
  return {
    info: state.info,
    token: state.token,
    displayedVideoAds: state.displayedVideoAds,
    currentVideoAdIndex: state.currentVideoAdIndex,
    videoAds: state.videoAds
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({userInfo, setVideoDisplayedAds, setVideoCurrentIndex}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VideoPlayerScreen);

