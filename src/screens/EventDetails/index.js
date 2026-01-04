import React, {Component} from 'react';
import {View, Alert, Text, Dimensions, ScrollView, TouchableOpacity, Platform, ActivityIndicator, AppState, Button, SafeAreaView, FlatList} from 'react-native';
//Library
import * as Animatable from 'react-native-animatable';
import { default as FastImageView } from "react-native-fast-image";
import Orientation from 'react-native-orientation';
import LinearGradient from 'react-native-linear-gradient';
import YoutubePlayer from "react-native-youtube-iframe";
import NetInfo from '@react-native-community/netinfo';
import { showNavigationBar} from 'react-native-navigation-bar-color';
import { Viewport } from '@skele/components';
//Redux
import {connect} from 'react-redux';
import {userInfo, loginToken, latestMovies} from '../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';
//components
import StatusBar from '../../components/StatusBar';
import Alerts from '../../components/Alerts';
import Banner from '../../components/AdMob/Banner';
import FastImage from '../../components/FastImage';
import withSequentialRendering from '../../components/withSequentialRendering';
//style
import styles from './styles';
import HeaderWithTittle from '../../components/Header/HeaderWithText';
import colors from '../../constants/colors';

const SequentialBanner = withSequentialRendering(Banner);

class EventDetails extends Component {
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
      isReady: false
    };
    this.Listener = null;
  }

  componentDidMount = () => {
    Orientation.lockToPortrait();
    showNavigationBar();
    this.checkConnectivity();
    this.appEventStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
  };

  componentWillUnmount() {
    this.appEventStateSubscription.remove();
  }

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
        this.setState({
          isPaused: false,
          isMuted: false
        });
    } else if (
      this.state.appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      this.setState({
        isPaused: true,
        isMuted: true
      });
    }
    this.setState({ appState: nextAppState });
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
      }
    });

    // Unsubscribe
    unsubscribe();
  };

  onEventDetailsPage = (item, events) => {
    const {isPushed} = this.state;
    if (!isPushed) {
      this.setState({ isPushed: true});
      this.props.navigation.push('EventDetails', {
        all_events: this.props.latestevents.filter(event => event.id !== item.id) || [],  
        title: item.title, 
        description: item.description, 
        video_id: item.video_id
      });
     }
  }

  //Render Related Event View
  renderRelatedItems = ({item, index}) => {
      return (
        <View style={styles.thumbnailView} key={item.id+''+index}>
          <TouchableOpacity onPress={() => this.state.isReady && this.onEventDetailsPage(item)}>
            <FastImage 
              style={styles.thumbnailImage} 
              source={{uri: item.thumbnail}} 
              resizeMode={FastImageView.resizeMode.cover} 
            />
          </TouchableOpacity>
        </View>
      );
  };

  //Render Related Movies View
  renderRelatedMovieItems = ({item, index}) => {
      return (
        <View style={styles.thumbnailView} key={item.id+''+index}>
          <TouchableOpacity onPress={() => this.state.isReady  && this.navigate(item.id, item.type)}>
            <FastImage 
              style={styles.thumbnailImage} source={{uri: item.thumbnail}} resizeMode={FastImageView.resizeMode.cover} />
          </TouchableOpacity>
        </View>
      );
  };

   //Push To Details of Related movies
   navigate = (itemId, itemType) => {
    const {isPushed} = this.state;
    if (!isPushed) {
      this.setState({ isPushed: true});
      this.props.navigation.push('Details', {
        itemId: itemId,
        type: itemType,
        refresh: 1,
      });
    }
  };


  // Render Details View
  render() {
    const {loadingAd, isConnected, isNotify, isReady, isPaused } = this.state;
  
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
              <ScrollView contentContainerStyle={styles.scrollViewContainer} overScrollMode="never">
                <Animatable.View style={styles.bannerContainer}>
                  <HeaderWithTittle name={this.props.route.params.title} navigation={this.props.navigation} isPop={true} />
                </Animatable.View>
                {Platform.OS == 'android' ? (
                <YoutubePlayer
                  height={250}
                  width={Dimensions.get('window').width}
                  play={ isReady ? !isPaused ? true : false : false}
                  videoId={this.props.route.params.video_id}
                  onReady={() => this.setState({ isReady: true, isPaused: false})}
                  webViewStyle={{backgroundColor: 'transparent', }}
                  webViewProps={{
                    allowsInlineMediaPlayback: false,
                    allowsFullscreenVideo: true,
                    androidLayerType: 'hardware', 
                  }}
                />):
                (
                <YoutubePlayer
                  height={!isReady ? 0 : 250}
                  width={Dimensions.get('window').width}
                  play={ isReady ? !isPaused ? true : false : false}
                  videoId={this.props.route.params.video_id}
                  onReady={() => this.setState({ isReady: true, isPaused: false})}
                />        
                )}
                {!isReady &&
                <ActivityIndicator size="large" color="#fff" />
                }
                <Animatable.View  style={styles.iconContainer}>
                  <View style={styles.iconView}>
                    <Text style={[styles.headerText, {flex: 1}]} numberOfLines={1}>
                    {this.props.route.params.title.substring(0, 30)}
                    </Text>
                  </View>
                </Animatable.View>
                <Animatable.View  style={styles.descriptionContainer}>
                  <View style={styles.descriptionView}>
                    <Text style={styles.descriptionText} numberOfLines={4}>
                      {this.props.route.params.description}
                    </Text>
                  </View>
                </Animatable.View>
                <SequentialBanner />
                {this.props.route.params.all_events.length > 0 ? (
                <Animatable.View  style={styles.middleContainer}>
                    <View style={styles.thumbnailHeaderContainer}>
                      <Text style={styles.thumbnailHeader}> More Like This</Text>
                    </View>
                    <View style={styles.thumbnailHeaderDivider} />
                    <View style={styles.contentContainer}>
                      {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}
                        <FlatList
                          data={this.props.route.params.all_events}
                          horizontal
                          scrollEnabled
                          showsHorizontalScrollIndicator={false}
                          bounces={false}
                          renderItem={this.renderRelatedItems}
                        />
                      {/* </ScrollView> */}
                    </View>
                  </Animatable.View>
                ): (
                  <Animatable.View  style={styles.middleContainer}>
                    <View style={styles.thumbnailHeaderContainer}>
                      <Text style={styles.thumbnailHeader}> More Like This</Text>
                    </View>
                    <View style={styles.thumbnailHeaderDivider} />
                    <View style={styles.contentContainer}>
                      {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}
                      <FlatList
                          data={this.props.latestmovies}
                          horizontal
                          scrollEnabled
                          showsHorizontalScrollIndicator={false}
                          bounces={false}
                          renderItem={this.renderRelatedMovieItems}
                        />
                        
                      {/* </ScrollView> */}
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
    latestevents: state.latestevents,
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

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);
