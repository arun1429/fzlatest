import React, {Component} from 'react';
import {View, Dimensions, TouchableOpacity, Text, AppState, ScrollView, Image, TouchableWithoutFeedback, ActivityIndicator} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import AppSlider from '../../components/AppSlider';
//Api
import HttpRequest from '../../utils/HTTPRequest';
import LocalData from '../../utils/LocalData';
//Redux

import {connect} from 'react-redux';
import {slider} from '../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';
//styles

import styles from './styles';
import {EventRegister} from 'react-native-event-listeners';

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      backgroundImage: '',
      appState: AppState.currentState,
      activeIndex: 0,
      activeSlide: 0,
      totalItem: '',
      isStarted: false,
      isBuffering: false,
      isMuted: false,
      isPaused: false,
      progress: 0,
      progressPlayer: 0,
      videoDuration: 0,
      video: '',
      muted: false,
      paused: false,
      currentIndex: 0,
      sliderData: [],
    };
    this._renderItem = this._renderItem.bind(this);
    this._onSnapToItem = this._onSnapToItem.bind(this);
  }

  componentDidMount = () => {
    // Only execute if the screen is in focus
    if (this.props.navigation.isFocused()) {
      //Get Silder Featured Movies Data
      this.getSlider();
      // console.log('Slider Getting Called');
      this.setState({
        isStarted: true,
        isMuted: false,
        paused: false
      });
      this.listener = EventRegister.addEventListener('videoPaused', data => {
        if (data.isClosed == 'false') {
          this.setState({
            activeSlide: 10001,
          });
        }
      });
      this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
      this.focusSliderListener = this.props.navigation.addListener('focus', () => {
        this.setState({ paused: false, isMuted: false });
      });
    
      this.blurSliderListener = this.props.navigation.addListener('blur', () => {
        this.setState({ paused: true, isMuted: true });
      });
    }
  };
  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
    this.setState({
      isStarted: true,
      isMuted: true,
      paused: true
    });
    this.appStateSubscription && this.appStateSubscription.remove();
    this.focusSliderListener && this.focusSliderListener();
    this.blurSliderListener && this.blurSliderListener();
  }

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (this.props.navigation.isFocused()) {
        this.setState({
          paused: false,
          isMuted: false
        });
      }
    } else if (
      this.state.appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      this.setState({
        paused: true,
        isMuted: true
      });
    }
    this.setState({ appState: nextAppState });
  };

  onToggleMute = () => {
    this.setState({
      isMuted: !this.state.isMuted,
    });
  };

  //Get Slider
  getSlider = () => {
    this.setState({isLoading: true});
    // if (this.props.token !== '') {
    HttpRequest.getSlider(this.props.token)
      .then(res => {
        const result = res.data;
        // console.log('Slider API Result: ', result);
        if (res.status == 200 && result.error == false) {
          if (result.data.length > 0) {
            // console.log('resul : ' + JSON.stringify(result.data['0']));
            this.setState({
              backgroundImage: result.data['0'].image,
              activeIndex: 0,
              isLoading: false,
            });
            this.props.slider(result.data);
            LocalData.setSlider(result.data);
            this.setState({
              totalItem: result.data.length,
              sliderData: result.data,
            });
          }
        } else {
          console.log('Slider API Error: ', result);
          LocalData.getSlider().then(info => {
            if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
              //Slider
              this.readSlider();
            }
          });
        }
        this.setState({isLoading: false});
      })
      .catch(err => {
        this.setState({isLoading: false});
        console.log('Slider API Catch Exception: ', err);
        LocalData.getSlider().then(info => {
          if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
            //Slider
            this.readSlider();
          }
        });
      });
  };

  readSlider = () => {
    LocalData.getSlider().then(info => {
      if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
        this.props.slider(JSON.parse(info));
        this.setState({
          totalItem: info.data.length,
        });
      }
    });
  };

  callDetailsScreen = item => {
    this.setState({activeSlide: 10001});
    if (item.trailer_order != '') {
      if (this.props.token != '') {
        console.log('Exclusive content');
        this.props.navigation.navigate('Exclusive', {
          itemId: item.id,
          type: item.type,
        });
      } else {
        console.log('Details with exclusive content');

        this.props.navigation.navigate('Details', {
          itemId: item.id,
          type: item.type,
        });
      }
    } else {
      console.log('Details content');

      this.props.navigation.navigate('Details', {
        itemId: item.id,
        type: item.type,
      });
    }
  };

  _renderItem({item, index}) {
    // console.log({_renderItem: index});
    return (
      <TouchableOpacity style={styles.imageContainer} key={index} onPress={() => this.callDetailsScreen(item)}>
        <VideoPlayer
          video={{uri: item.link}} // Can be a URL or a local file.
          ref={r => (this._player = r)} // Store reference
          style={styles.image}
          onPress={() => this.callDetailsScreen(item)}
          muted={this.state.isMuted}
          paused={index !== this.state.activeSlide || this.state.paused}
          autoplay={true}
          videoWidth={1600}
          videoHeight={900}
          pauseOnPress
          resizeMode={'cover'}
          thumbnail={{uri: item.image}}
          ignoreSilentSwitch="ignore"
        />
        <View
          style={{
            height: 120,
            width: '100%',
            alignSelf: 'center',
            backgroundColor: 'white',
            opacity: 0.0,
            position: 'absolute',
          }}
        />
        {this.state.activeSlide != 10001 && (
          <Text style={styles.count}>
            {this.state.activeSlide + 1}/{this.state.totalItem}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  _onSnapToItem(index) {
    console.log('activeSlide  : ' + index);
    this.setState({
      // backgroundImage: this.state.sliderData[index].image,
      isPaused: true,
      activeSlide: index,
    });
  }

  _onOpenItem() {
    console.log('activeSlide  : ' + this.state.activeSlide);
    this.callDetailsScreen(this.state.sliderData[this.state.activeSlide]);
  }
  

  render() {
    const {isLoading, sliderData} = this.state;
    // console.log('active index ' + this.state.activeSlide);
    return (
      <View style={styles.sliderContainer}>
        {isLoading && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <ActivityIndicator size="large" color="#fff" style={{justifySelf: 'center'}} />
          </View>
        )}
        {!isLoading && sliderData?.length >= 1 && <AppSlider ref={e => (this.appSlider = e)} renderItem={this._renderItem} slides={sliderData} onSlideChange={(index, lastIndex) => this._onSnapToItem(index)} />}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.token,
    sliderImages: state.slider,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({slider}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Slider);
