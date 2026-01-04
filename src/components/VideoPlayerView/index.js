import _ from 'lodash';
import React, {Component} from 'react';
import {
  Animated, 
  AppState, 
  Dimensions, 
  Easing, 
  FlatList, 
  Image, 
  ImageBackground, 
  Modal, 
  PanResponder, 
  Platform, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TouchableHighlight, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  View
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import Orientation from 'react-native-orientation';
import SystemSetting from 'react-native-system-setting';
import Video from 'react-native-video';
import {Icon} from 'native-base';
import StatusBar from '../StatusBar/';
import colors from '../../constants/colors';

var {width} = Dimensions.get('window');

class VideoPlayerView extends Component {
  static defaultProps = {
    toggleResizeModeOnFullscreen: true,
    controlAnimationTiming: 500,
    doubleTapTime: 130,
    playInBackground: false,
    playWhenInactive: false,
    resizeMode: 'contain',
    isFullscreen: false,
    showOnStart: true,
    isLocked: false,
    videoPaused: false,
    repeat: false,
    muted: false,
    volume: 1,
    title: '',
    rate: 1,
  };

  constructor(props) {
    super(props);
    /**
     * All of our values that are updated by the
     * methods and listeners in this class
     */
    this.state = {
      // Video
      resizeMode: this.props.resizeMode,
      paused: this.props.videoPaused,
      isMuted: false,
      volume: this.props.volume,
      rate: this.props.rate,
      // Controls
      isFullscreen: this.props.isFullScreen || this.props.resizeMode === 'cover' || false,
      showTimeRemaining: true,
      volumeTrackWidth: 0,
      volumeFillWidth: 0,
      seekerFillWidth: 0,
      showControls: this.props.showOnStart,
      volumePosition: 0,
      seekerPosition: 0,
      volumeOffset: 0,
      seekerOffset: 0,
      seeking: false,
      originallyPaused: false,
      scrubbing: false,
      loading: false,
      currentTime: 0,
      error: false,
      duration: 0,
      visibleModal: false,
      isLocked: this.props.isLocked,
      lastScreenPress: 0,
      appState: AppState.currentState,
      seekAxis: 1,
      selectedTextTrack: this.props.selectedTextTrack,
    };

    /**
     * Any options that can be set at init.
     */
    this.opts = {
      playWhenInactive: this.props.playWhenInactive,
      playInBackground: this.props.playInBackground,
      repeat: this.props.repeat,
      title: this.props.title,
    };

    /**
     * Our app listeners and associated methods
     */
    this.events = {
      onError: this.props.onError || this._onError.bind(this),
      onBack: this.props.onBack || this._onBack.bind(this),
      onEnd: this.props.onEnd || this._onEnd.bind(this),
      onScreenTouch: this._onScreenTouch.bind(this),
      onEnterFullscreen: this.props.onEnterFullscreen,
      onExitFullscreen: this.props.onExitFullscreen,
      onShowControls: this.props.onShowControls,
      onHideControls: this.props.onHideControls,
      onLoadStart: this._onLoadStart.bind(this),
      onProgress: this._onProgress.bind(this),
      onSeek: this._onSeek.bind(this),
      onLoad: this._onLoad.bind(this),
      onPause: this.props.onPause,
      onPlay: this.props.onPlay,
      onFastForward: this.props.onFastForward,
      onLockingscreen: this._toggleControls.bind(this),
      onUnlockingscreen: this._toggleControls.bind(this),
    };

    /**
     * Functions used throughout the application
     */
    this.methods = {
      toggleFullscreen: this._toggleFullscreen.bind(this),
      togglePlayPause: this._togglePlayPause.bind(this),
      toggleControls: this._toggleControls.bind(this),
      toggleTimer: this._toggleTimer.bind(this),
      toggleFastForward: this._toggleFastForward.bind(this),
      toggleFastRewind: this._toggleFastRewind.bind(this),
      toggleModal: this._toggleModal.bind(this),
      toggleLock: this._toggleLock.bind(this),
    };

    /**
     * Player information
     */
    this.player = {
      controlTimeoutDelay: this.props.controlTimeout || 25000,
      volumePanResponder: PanResponder,
      seekPanResponder: PanResponder,
      controlTimeout: null,
      tapActionTimeout: null,
      volumeWidth: 150,
      iconOffset: 0,
      seekerWidth: 0,
      ref: Video,
      scrubbingTimeStep: this.props.scrubbing || 0,
      tapAnywhereToPause: this.props.tapAnywhereToPause,
    };

    /**
     * Various animations
     */
    const initialValue = this.props.showOnStart ? 1 : 0;

    this.animations = {
      bottomControl: {
        // marginBottom: new Animated.Value(0),
        opacity: new Animated.Value(initialValue),
      },
      topControl: {
        // marginTop: new Animated.Value(0),
        opacity: new Animated.Value(initialValue),
      },
      middleControl: {
        // marginTop: new Animated.Value(0),
        opacity: new Animated.Value(initialValue),
      },
      video: {
        opacity: new Animated.Value(1),
      },
      loader: {
        rotate: new Animated.Value(0),
        MAX_VALUE: 360,
      },
    };

    /**
     * Various styles that be added...
     */
    this.styles = {
      videoStyle: this.props.videoStyle || {},
      containerStyle: this.props.style || {},
    };
  }

  /**
    | -------------------------------------------------------
    | Events
    | -------------------------------------------------------
    |
    | These are the events that the <Video> component uses
    | and can be overridden by assigning it as a prop.
    | It is suggested that you override onEnd.
    |
    */

  /**
   * When load starts we display a loading icon
   * and show the controls.
   */
  _onLoadStart() {
    let state = this.state;
    state.loading = true;
    this.loadAnimation();
    this.setState(state);

    if (typeof this.props.onLoadStart === 'function') {
      this.props.onLoadStart(...arguments);
    }
  }

  /**
   * When load is finished we hide the load icon
   * and hide the controls. We also set the
   * video duration.
   *
   * @param {object} data The video meta data
   */
  _onLoad(data = {}) {
    let state = this.state;

    state.duration = data.duration;
    state.loading = false;
    this.setState(state);

    if (state.showControls) {
      this.setControlTimeout();
    }

    if (typeof this.props.onLoad === 'function') {
      this.props.onLoad(...arguments);
    }
  }

  /**
   * For onprogress we fire listeners that
   * update our seekbar and timer.
   *
   * @param {object} data The video meta data
   */
  _onProgress(data = {}) {
    let state = this.state;
    if (!state.scrubbing) {
      state.currentTime = data.currentTime;

      if (!state.seeking) {
        const position = this.calculateSeekerPosition();
        this.setSeekerPosition(position);
      }

      if (typeof this.props.onProgress === 'function') {
        this.props.onProgress(...arguments);
      }

      this.setState(state);
    }
  }

  /**
   * For onSeek we clear scrubbing if set.
   *
   * @param {object} data The video meta data
   */
  _onSeek(data = {}) {
    let state = this.state;
    if (state.scrubbing) {
      state.scrubbing = false;
      state.currentTime = data.currentTime;

      // Seeking may be false here if the user released the seek bar while the player was still processing
      // the last seek command. In this case, perform the steps that have been postponed.
      if (!state.seeking) {
        this.setControlTimeout();
        state.paused = state.originallyPaused;
      }

      this.setState(state);
    }
  }

  /**
   * It is suggested that you override this
   * command so your app knows what to do.
   * Either close the video or go to a
   * new page.
   */
  _onEnd() {
    this.events.onBack();
  }

  /**
   * Set the error state to true which then
   * changes our renderError function
   *
   * @param {object} err  Err obj returned from <Video> component
   */
  _onError(err) {
    let state = this.state;
    state.error = true;
    state.loading = false;

    this.setState(state);
  }

  /**
   * This is a single and double tap listener
   * when the user taps the screen anywhere.
   * One tap toggles controls, two toggles
   * fullscreen mode.
   */
  _onScreenTouch() {
    if (this.player.tapActionTimeout) {
      clearTimeout(this.player.tapActionTimeout);
      this.player.tapActionTimeout = 0;
      this.methods.toggleFullscreen();
      const state = this.state;
      if (state.showControls) {
        this.resetControlTimeout();
      }
    } else {
      this.player.tapActionTimeout = setTimeout(() => {
        const state = this.state;
        if (this.player.tapAnywhereToPause && state.showControls) {
          this.methods.togglePlayPause();
          this.resetControlTimeout();
        } else {
          this.methods.toggleControls();
        }
        this.player.tapActionTimeout = 0;
      }, this.props.doubleTapTime);
    }
  }

  /**
    | -------------------------------------------------------
    | Methods
    | -------------------------------------------------------
    |
    | These are all of our functions that interact with
    | various parts of the class. Anything from
    | calculating time remaining in a video
    | to handling control operations.
    |
    */

  /**
   * Set a timeout when the controls are shown
   * that hides them after a length of time.
   * Default is 15s
   */
  setControlTimeout() {
    this.player.controlTimeout = setTimeout(() => {
      this._hideControls();
    }, this.player.controlTimeoutDelay);
  }

  /**
   * Clear the hide controls timeout.
   */
  clearControlTimeout() {
    clearTimeout(this.player.controlTimeout);
  }

  /**
   * Reset the timer completely
   */
  resetControlTimeout() {
    this.clearControlTimeout();
    this.setControlTimeout();
  }

  /**
   * Animation to hide controls. We fade the
   * display to 0 then move them off the
   * screen so they're not interactable
   */
  hideControlAnimation() {
    Animated.parallel([
      Animated.timing(this.animations.topControl.opacity, {
        toValue: 0,
        duration: this.props.controlAnimationTiming,
        useNativeDriver: false,
      }),
      // Animated.timing(this.animations.topControl.marginTop, {
      //   toValue: -100,
      //   duration: this.props.controlAnimationTiming,
      //   useNativeDriver: false,
      // }),
      Animated.timing(this.animations.middleControl.opacity, {
        toValue: 0,
        duration: this.props.controlAnimationTiming,
        useNativeDriver: false,
      }),
      // Animated.timing(this.animations.middleControl.marginTop, {
      //   toValue: -100,
      //   duration: this.props.controlAnimationTiming,
      //   useNativeDriver: false,
      // }),
      Animated.timing(this.animations.bottomControl.opacity, {
        toValue: 0,
        duration: this.props.controlAnimationTiming,
        useNativeDriver: false,
      }),
      // Animated.timing(this.animations.bottomControl.marginBottom, {
      //   toValue: -100,
      //   duration: this.props.controlAnimationTiming,
      //   useNativeDriver: false,
      // }),
    ]).start();
  }

  /**
   * Animation to show controls...opposite of
   * above...move onto the screen and then
   * fade in.
   */
  showControlAnimation() {
    const {isLocked} = this.state;
    if (!isLocked) {
      Animated.parallel([
        Animated.timing(this.animations.topControl.opacity, {
          toValue: 1,
          useNativeDriver: false,
          duration: this.props.controlAnimationTiming,
        }),
        Animated.timing(this.animations.middleControl.opacity, {
          toValue: 1,
          useNativeDriver: false,
          duration: this.props.controlAnimationTiming,
        }),
        Animated.timing(this.animations.bottomControl.opacity, {
          toValue: 1,
          useNativeDriver: false,
          duration: this.props.controlAnimationTiming,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(this.animations.middleControl.opacity, {
          toValue: 1,
          useNativeDriver: false,
          duration: this.props.controlAnimationTiming,
        }),
      ]).start();
    }
  }

  /**
   * Loop animation to spin loader icon. If not loading then stop loop.
   */
  loadAnimation() {
    if (this.state.loading) {
      Animated.sequence([
        Animated.timing(this.animations.loader.rotate, {
          toValue: this.animations.loader.MAX_VALUE,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(this.animations.loader.rotate, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]).start(this.loadAnimation.bind(this));
    }
  }

  /**
   * Function to hide the controls. Sets our
   * state then calls the animation.
   */
  _hideControls() {
    if (this.mounted) {
      let state = this.state;
      state.showControls = false;
      this.hideControlAnimation();

      this.setState(state);
    }
  }

  /**
   * Function to toggle controls based on
   * current state.
   */
  _toggleControls() {
    // let state = this.state;
    // state.showControls = !state.showControls;
    this.setState(
      prevState => ({showControls: !prevState.showControls}),
      () => {
        if (this.state.showControls) {
          this.showControlAnimation();
          this.setControlTimeout();
          typeof this.events.onShowControls === 'function' && this.events.onShowControls();
        } else {
          this.hideControlAnimation();
          this.clearControlTimeout();
          typeof this.events.onHideControls === 'function' && this.events.onHideControls();
        }
      },
    );
    // this.setState(state);
  }

  /**
   * Function to toggle modal based on
   * current state.
   */
  _toggleModal() {
    this._togglePlayPause();
    let state = this.state;
    state.visibleModal = !state.visibleModal;
    this.setState(state);
  }

  /**
   * Toggle fullscreen changes resizeMode on
   * the <Video> component then updates the
   * isFullscreen state.
   */
  _toggleFullscreen() {
    let state = this.state;

    state.isFullscreen = !state.isFullscreen;

    if (this.props.toggleResizeModeOnFullscreen) {
      state.resizeMode = state.isFullscreen === true ? 'cover' : 'contain';
    }

    if (state.isFullscreen) {
      typeof this.events.onEnterFullscreen === 'function' && this.events.onEnterFullscreen();
    } else {
      typeof this.events.onExitFullscreen === 'function' && this.events.onExitFullscreen();
    }

    this.setState(state);
  }

  /**
   * Toggle lock changes the controls visibility state on
   * the <Video> component
   */
  _toggleLock() {
    let state = this.state;
    state.isLocked = !state.isLocked;

    if (state.isLocked) {
      state.showControls = false;
      this.hideControlAnimation();
      this.clearControlTimeout();
    } else {
      state.showControls = true;
      this.showControlAnimation();
      this.setControlTimeout();
    }
    this.setState(state);
  }

  /**
   * Toggle playing state on <Video> component
   */
  _togglePlayPause() {
    let state = this.state;
    state.paused = !state.paused;
    if (state.paused) {
      typeof this.events.onPause === 'function' && this.events.onPause();
      KeepAwake.deactivate();
    } else {
      typeof this.events.onPlay === 'function' && this.events.onPlay();
      KeepAwake.activate();
    }
    this.setState(state);
  }

  /**
   * Toggle playing state on <Video> component
   */
  _toggleExternalPlayPause() {
    let state = this.state;
    state.externalPaused = !state.externalPaused;
    if (state.externalPaused) {
      typeof this.events.onPause === 'function' && this.events.onPause();
      KeepAwake.deactivate();
    } else {
      typeof this.events.onPlay === 'function' && this.events.onPlay();
      KeepAwake.activate();
    }

    this.setState(state);
  }

  /**
   * Toggle Fast Forward state on <Video> component
   */
  _toggleFastForward() {
    let state = this.state;
    this.player.ref.seek(state.currentTime + 10);
    state.currentTime += 10;
    this.setState(state);
  }

  _toggleFastRewind() {
    let state = this.state;
    this.player.ref.seek(state.currentTime - 10);
    state.currentTime -= 10;
    this.setState(state);
  }

  /**
   * Toggle between showing time remaining or
   * video duration in the timer control
   */
  _toggleTimer() {
    let state = this.state;
    state.showTimeRemaining = !state.showTimeRemaining;
    this.setState(state);
  }

  /**
   * The default 'onBack' function pops the navigator
   * and as such the video player requires a
   * navigator prop by default.
   */
  _onBack() {
    if (this.props.navigator && this.props.navigator.goBack) {
      KeepAwake.deactivate();
      // showNavigationBar();
      this.props.navigator.goBack();
    } else {
      console.warn('Warning: _onBack requires navigator property to function. Either modify the onBack prop or pass a navigator prop');
    }
  }

  /**
   * Calculate the time to show in the timer area
   * based on if they want to see time remaining
   * or duration. Formatted to look as 00:00.
   */
  calculateTime() {
    if (this.state.showTimeRemaining) {
      const time = this.state.duration - this.state.currentTime;
      return `-${this.formatTime(time)}`;
    }

    return this.formatTime(this.state.currentTime);
  }

  /**
   * Format a time string as hh:mm:ss
   *
   * @param {int} time time in milliseconds
   * @return {string} formatted time string in mm:ss format
   */
  formatTime(time = 0) {
    const symbol = this.state.showRemainingTime ? '-' : '';
    time = Math.min(Math.max(time, 0), this.state.duration);

    const formattedHours = _.padStart(Math.floor(time / 3600).toFixed(0), 2, 0);
    time %= 3600;
    const formattedMinutes = _.padStart(Math.floor(time / 60).toFixed(0), 2, 0);
    const formattedSeconds = _.padStart(Math.floor(time % 60).toFixed(0), 2, 0);
    return `${symbol}${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  /**
   * Set the position of the seekbar's components
   * (both fill and handle) according to the
   * position supplied.
   *
   * @param {float} position position in px of seeker handle}
   */
  setSeekerPosition(position = 0) {
    let state = this.state;
    position = this.constrainToSeekerMinMax(position);

    state.seekerFillWidth = position;
    state.seekerPosition = position;

    if (!state.seeking) {
      state.seekerOffset = position;
    }

    this.setState(state);
  }

  /**
   * Contrain the location of the seeker to the
   * min/max value based on how big the
   * seeker is.
   *
   * @param {float} val position of seeker handle in px
   * @return {float} contrained position of seeker handle in px
   */
  constrainToSeekerMinMax(val = 0) {
    if (val <= 0) {
      return 0;
    } else if (val >= this.player.seekerWidth) {
      return this.player.seekerWidth;
    }
    return val;
  }

  /**
   * Calculate the position that the seeker should be
   * at along its track.
   *
   * @return {float} position of seeker handle in px based on currentTime
   */
  calculateSeekerPosition() {
    const percent = this.state.currentTime / this.state.duration;
    return this.player.seekerWidth * percent;
  }

  /**
   * Return the time that the video should be at
   * based on where the seeker handle is.
   *
   * @return {float} time in ms based on seekerPosition.
   */
  calculateTimeFromSeekerPosition() {
    const percent = this.state.seekerPosition / this.player.seekerWidth;
    return this.state.duration * percent;
  }

  /**
   * Seek to a time in the video.
   *
   * @param {float} time time to seek to in ms
   */
  seekTo(time = 0) {
    let state = this.state;
    state.currentTime = time;
    this.player.ref.seek(time);
    this.setState(state);
  }

  /**
   * Set the position of the volume slider
   *
   * @param {float} position position of the volume handle in px
   */
  setVolumePosition(position = 0) {
    let state = this.state;
    position = this.constrainToVolumeMinMax(position);
    state.volumePosition = position + this.player.iconOffset;
    state.volumeFillWidth = position;
    state.volumeTrackWidth = this.player.volumeWidth - state.volumeFillWidth;

    if (state.volumeFillWidth < 0) {
      state.volumeFillWidth = 0;
    }

    if (state.volumeTrackWidth > 150) {
      state.volumeTrackWidth = 150;
    }

    this.setState(state);
  }

  /**
   * Constrain the volume bar to the min/max of
   * its track's width.
   *
   * @param {float} val position of the volume handle in px
   * @return {float} contrained position of the volume handle in px
   */
  constrainToVolumeMinMax(val = 0) {
    if (val <= 0) {
      return 0;
    } else if (val >= this.player.volumeWidth + 9) {
      return this.player.volumeWidth + 9;
    }
    return val;
  }

  /**
   * Get the volume based on the position of the
   * volume object.
   *
   * @return {float} volume level based on volume handle position
   */
  calculateVolumeFromVolumePosition() {
    return this.state.volumePosition / this.player.volumeWidth;
  }

  /**
   * Get the position of the volume handle based
   * on the volume
   *
   * @return {float} volume handle position in px based on volume
   */
  calculateVolumePositionFromVolume() {
    return this.player.volumeWidth * this.state.volume;
  }

  /**
    | -------------------------------------------------------
    | React Component functions
    | -------------------------------------------------------
    |
    | Here we're initializing our listeners and getting
    | the component ready using the built-in React
    | Component methods
    |
    */

  /**
   * Before mounting, init our seekbar and volume bar
   * pan responders.
   */
  UNSAFE_componentWillMount() {
    this.initSeekPanResponder();
    this.initVolumePanResponder();
  }

  componentDidUpdate(prevProps) {
    if (this.props.videoPaused !== prevProps.paused) {
      console.log('Is Paused :: ',this.props.videoPaused); //Is Paused
      console.log('Is Previously Paused :: ',prevProps.paused); //Is Previously Paused
      let state = this.state;
      this._togglePlayPause();
      if(!this.props.videoPaused){
        this.seekTo(this.props.seek);
      }
    }
  }

  /**
   * To allow basic playback management from the outside
   * we have to handle possible props changes to state changes
   */
  UNSAFE_componentWillReceiveProps(nextProps) {

    if (this.styles.videoStyle !== nextProps.videoStyle) {
      this.styles.videoStyle = nextProps.videoStyle;
    }

    if (this.styles.containerStyle !== nextProps.style) {
      this.styles.containerStyle = nextProps.style;
    }
  }

  /**
   * Upon mounting, calculate the position of the volume
   * bar based on the volume property supplied to it.
   */
  componentDidMount() {
    // console.log('Selectec Text Track ', this.props.textTracks);
    const objSelected = {title: 'title', type: 'English'};
    // console.log('Selectec Text OBJ ', objSelected);

    this.setState({
      textTrack: this.props.objSelected,
    });
    KeepAwake.activate();
    // hideNavigationBar();
    //System Default Volume
    SystemSetting.getVolume(this.state.volType).then(volume => {
      this.setState({volume: volume === 0 ? 0.5 : volume}, () => {
        //Volume
        const position = this.calculateVolumePositionFromVolume();
        this.setVolumePosition(position);
        this.state.volumeOffset = position;
        this.setState({volumeOffset: position});
      });
    });

    // Volume Listner
    this.volumeListener = SystemSetting.addVolumeListener(data => {
      this.setState({
        volume: Platform.OS == 'android' ? data['music'] : data.value,
      });
      //Volume
      const position = this.calculateVolumePositionFromVolume();
      this.setVolumePosition(position);
      this.setState({volumeOffset: position});
    });
    this.mounted = true;
    this.appStateSubscription = AppState.addEventListener('change', this._handleAppStateChange);
    Orientation.addSpecificOrientationListener(this._specificOrientationChange);
  }

  _specificOrientationChange = specificOrientation => {
    // console.log("specificOrientation : "+specificOrientation)
    //console.log("seekAxis : "+this.stateseekAxis)

    this.setState({
      seekAxis: specificOrientation === 'LANDSCAPE-RIGHT' ? 0 : 1,
    });
    // if (specificOrientation === 'LANDSCAPE-RIGHT') {
    //   this.setState({
    //     seekAxis: Platform.OS == 'ios' ? 1 : 0,
    //   });
    // } else if (specificOrientation === 'LANDSCAPE-LEFT') {
    //   this.setState({
    //     seekAxis: Platform.OS == 'ios' ? 0 : 1,
    //   });
    // } else {
    //   this.setState({
    //     seekAxis: Platform.OS == 'ios' ? 0 : 1,
    //   });
    // }
  };

  /**
   * When the component is about to unmount kill the
   * timeout less it fire in the prev/next scene
   */
  componentWillUnmount() {
    KeepAwake.deactivate();
    Orientation.lockToPortrait();
    SystemSetting.removeListener(this.volumeListener);
    this.onBlur();
    this.mounted = false;
    this.clearControlTimeout();
    this.appStateSubscription.remove();
    Orientation.removeSpecificOrientationListener(this._specificOrientationChange);
    this._onBack();
  }

  onBlur = () => {
    let state = this.state;
    state.paused = true;
    typeof this.events.onPause === 'function' && this.events.onPause();
    this.setState(state);
  };

  /*
   * App State Listener
   *
   * */
  _handleAppStateChange = nextAppState => {
    let state = this.state;
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      state.paused = false;
      state.appState = nextAppState;
      typeof this.events.onPlay === 'function' && this.events.onPlay();
      KeepAwake.activate();
      // console.log('IsPaused: ', false)
    } else {
      state.paused = true;
      state.appState = nextAppState;
      typeof this.events.onPause === 'function' && this.events.onPause();
      KeepAwake.deactivate();
      // console.log('IsPaused: ', true)
    }
    this.setState(state);
  };

  /**
   * Get our seekbar responder going
   */
  initSeekPanResponder() {
    this.player.seekPanResponder = PanResponder.create({
      // Ask to be the responder.
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,

      /**
       * When we start the pan tell the machine that we're
       * seeking. This stops it from updating the seekbar
       * position in the onProgress listener.
       */
      onPanResponderGrant: (evt, gestureState) => {
        let state = this.state;
        this.clearControlTimeout();
        const position = evt.nativeEvent.locationX;
        this.setSeekerPosition(position);
        state.seeking = true;
        state.originallyPaused = state.paused;
        state.scrubbing = false;
        if (this.player.scrubbingTimeStep > 0) {
          state.paused = true;
        }
        this.setState(state);
      },

      /**
       * When panning, update the seekbar position, duh.
       */
      onPanResponderMove: (evt, gestureState) => {
        // console.log('Move seek bar', gestureState);
        let {seekAxis} = this.state;
        const position = Platform.OS == 'android' ? this.state.seekerOffset + gestureState.dx : seekAxis == 0 ? this.state.seekerOffset - gestureState.dy : this.state.seekerOffset + gestureState.dy;

        this.setSeekerPosition(position);
        let state = this.state;

        if (this.player.scrubbingTimeStep > 0 && !state.loading && !state.scrubbing) {
          const time = this.calculateTimeFromSeekerPosition();
          const timeDifference = Math.abs(state.currentTime - time) * 1000;

          if (time < state.duration && timeDifference >= this.player.scrubbingTimeStep) {
            state.scrubbing = true;

            this.setState(state);
            setTimeout(() => {
              this.player.ref.seek(time, this.player.scrubbingTimeStep);
            }, 1);
          }
        }
      },

      /**
       * On release we update the time and seek to it in the video.
       * If you seek to the end of the video we fire the
       * onEnd callback
       */
      onPanResponderRelease: (evt, gestureState) => {
        const time = this.calculateTimeFromSeekerPosition();
        let state = this.state;
        if (time >= state.duration && !state.loading) {
          state.paused = true;
          this.events.onEnd();
        } else if (state.scrubbing) {
          state.seeking = false;
        }else {
          this.seekTo(time);
          this.setControlTimeout();
          state.paused = state.originallyPaused;
          state.seeking = false;
        }
        this.setState(state);
      },
    });
  }

  /**
   * Initialize the volume pan responder.
   */
  initVolumePanResponder() {
    this.player.volumePanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.clearControlTimeout();
      },

      /**
       * Update the volume as we change the position.
       * If we go to 0 then turn on the mute prop
       * to avoid that weird static-y sound.
       */
      onPanResponderMove: (evt, gestureState) => {
        let state = this.state;
        const position =
          Platform.OS == 'android'
            ? //   ? state.seekAxis == 0
              this.state.volumeOffset + gestureState.dx
            : state.seekAxis == 0
            ? this.state.volumeOffset - gestureState.dy
            : this.state.volumeOffset + gestureState.dy;
        this.setVolumePosition(position);
        state.volume = this.calculateVolumeFromVolumePosition();

        if (state.volume <= 0) {
          state.muted = true;
        } else {
          state.muted = false;
        }
        SystemSetting.setVolume(state.volume, {
          type: 'music',
          playSound: false,
          showUI: false,
        });

        this.setState(state);
      },

      /**
       * Update the offset...
       */
      onPanResponderRelease: (evt, gestureState) => {
        let state = this.state;
        state.volumeOffset = state.volumePosition;
        this.setControlTimeout();
        this.setState(state);
      },
    });
  }

  /**
    | -------------------------------------------------------
    | Rendering
    | -------------------------------------------------------
    |
    | This section contains all of our render methods.
    | In addition to the typical React render func
    | we also have all the render methods for
    | the controls.
    |
    */

  /**
   * Standard render control function that handles
   * everything except the sliders. Adds a
   * consistent <TouchableHighlight>
   * wrapper and styling.
   */
  renderControl(children, callback, style = {}) {
    return callback ? (
      <TouchableHighlight
        underlayColor="transparent"
        activeOpacity={0.3}
        onPress={() => {
          this.resetControlTimeout();
          callback();
        }}
        style={[styles.controls.control, style]}>
        {children}
      </TouchableHighlight>
    ) : (
      <View style={style}>{children}</View>
    );
  }

  /**
   * Renders an empty control, used to disable a control without breaking the view layout.
   */
  renderNullControl() {
    return <View style={[styles.controls.control]} />;
  }

  /**
   * Groups the top bar controls together in an animated
   * view and spaces them out.
   */
  renderTopControls() {
    const backControl = this.props.disableBack ? this.renderNullControl() : this.renderBack();
    const titleControl = this.props.disableTitle ? this.renderNullControl() : this.renderTitle();
    const volumeControl = this.props.disableVolume ? this.renderNullControl() : this.renderVolume();
    const fullscreenControl = this.props.disableFullscreen ? this.renderNullControl() : this.renderFullscreen();

    return (
      <Animated.View style={[styles.controls.top, this.animations.topControl]} pointerEvents={this.state.showControls ? 'auto' : 'none'}>
        <ImageBackground source={require('../../../assets/player/top-vignette.png')} style={[styles.controls.column]} imageStyle={[styles.controls.vignette]}>
          <SafeAreaView style={styles.controls.topControlGroup}>
            {backControl}
            {titleControl}
            <View style={styles.controls.pullRight}>
              {volumeControl}
              {fullscreenControl}
            </View>
          </SafeAreaView>
        </ImageBackground>
      </Animated.View>
    );
  }

  /**
   * Back button control
   */
  renderBack() {
    return this.renderControl(<Image source={require('../../../assets/player/back.png')} style={styles.controls.back} />, this.events.onBack, styles.controls.back);
  }

  /**
   * Title control
   */
  renderTitle() {
    if (this.opts.title) {
      return this.renderControl(
        <Text style={{color: '#fff'}} numberOfLines={1}>
          {this.opts.title}
        </Text>,
      );
    }
  }

  onToggleMute = () => {
    this.setState({
      isMuted: !this.state.isMuted,
    });
  };
  /**
   * Render the volume slider and attach the pan handlers
   */
  renderVolume() {
    return (
      <View style={styles.volume.container} {...this.player.volumePanResponder.panHandlers}>
        <View style={[styles.volume, {marginRight: 5}]}>
          {this.state.isMuted === false ? (
            <View>
              {this.state.volumePosition === 0 ? (
                <TouchableOpacity activeOpacity={0.4} onPress={() => this.onToggleMute()}>
                  <Icon type="FontAwesome5" name="volume-mute" style={{fontSize: 16, color: '#fff'}} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity activeOpacity={0.4} onPress={() => this.onToggleMute()}>
                  <Icon type="FontAwesome5" name="volume-up" style={{fontSize: 16, color: '#fff'}} />
                </TouchableOpacity>
              )}
            </View>
          ) : null}

          {this.state.isMuted ? (
            <TouchableOpacity activeOpacity={0.4} onPress={() => this.onToggleMute()}>
              <Icon type="FontAwesome5" name="volume-mute" style={{fontSize: 16, color: '#fff'}} />
            </TouchableOpacity>
          ) : null}
        </View>
        {this.state.isMuted === false ? <View style={[styles.volume.fill, {width: this.state.volumeFillWidth}]} /> : null}

        {this.state.isMuted === false ? <View style={[styles.volume.track, {width: this.state.volumeTrackWidth}]} /> : null}
        {this.state.isMuted === false ? (
          <View style={[styles.volume.handle, {left: this.state.volumePosition, marginLeft: 2}]} {...this.player.volumePanResponder.panHandlers}>
            <Icon type="Octicons" name="primitive-dot" style={{fontSize: 20, color: '#fff'}} />
          </View>
        ) : null}
      </View>
    );
  }

  /**
   * Render fullscreen toggle and set icon based on the fullscreen state.
   */
  renderFullscreen() {
    let source = this.state.isFullscreen === true ? require('../../../assets/player/shrink.png') : require('../../../assets/player/expand.png');
    return this.renderControl(<Image source={source} />, this.methods.toggleFullscreen, styles.controls.fullscreen);
  }

  /**
   * Groups the Middle bar controls together in an animated
   * view and spaces them out.
   */
  renderMiddleControls() {
    // const doubleTapControl = this.props.disableFastForward ? this.renderNullControl() : this.renderDoubleTapSeek();
    const lockControl = this.props.disableLock ? this.renderNullControl() : this.renderLock();
    const fastForwardControl = this.props.disableFastForward ? this.renderNullControl() : this.renderFastForward();
    const playPauseControl = this.props.disablePlayPause ? this.renderNullControl() : this.renderPlayPause();
    const fastRewindontrol = this.props.disableFastForward ? this.renderNullControl() : this.renderFastRewind();
    return (
      <Animated.View style={[styles.controls.middle, this.animations.middleControl]} pointerEvents={this.state.showControls ? 'auto' : 'none'}>
        <SafeAreaView style={styles.controls.middleControlGroup}>
          {lockControl}
          {!this.state.isLocked ? (
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              {fastRewindontrol}
              <Text style={{fontSize: 14, color: 'white', marginRight: 15}}>10</Text>
              {playPauseControl}

              <Text style={{fontSize: 14, color: 'white', marginLeft: 10}}>10</Text>
              {fastForwardControl}
            </View>
          ) : null}

          {/* To make the controls at center using this empty View container */}
          <View />
        </SafeAreaView>
      </Animated.View>
    );
  }

  /**
   * Render Lock toggle and set icon based on the lock state.
   */
  renderLock() {
    let source = this.state.isLocked == true ? require('../../../assets/player/lock.png') : require('../../../assets/player/unlock.png');
    return this.renderControl(<Image source={source} />, this.methods.toggleLock, styles.controls.lock);
  }

  /**
   * Render Lock toggle and set icon based on the lock state.
   */
  renderDoubleTapSeek() {
    const fastForwardControl = this.props.disableFastForward ? this.renderNullControl() : this.renderFastForward();
    const playPauseControl = this.props.disablePlayPause ? this.renderNullControl() : this.renderPlayPause();
    const fastRewindontrol = this.props.disableFastForward ? this.renderNullControl() : this.renderFastRewind();
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        {fastRewindontrol}
        <Text style={{fontSize: 14, color: 'white', marginRight: 15}}>10</Text>
        {playPauseControl}

        <Text style={{fontSize: 14, color: 'white', marginLeft: 10}}>10</Text>
        {fastForwardControl}
      </View>
    );
  }

  /**
   * Render bottom control group and wrap it in a holder
   */
  renderBottomControls() {
    const timerControl = this.props.disableTimer ? this.renderNullControl() : this.renderTimer();
    const subtitleControl = this.props.disableSubTitle ? this.renderNullControl() : this.renderSubTitle();
    const seekbarControl = this.props.disableSeekbar ? this.renderNullControl() : this.renderSeekbar();
    const playPauseControl = this.props.disablePlayPause ? this.renderNullControl() : this.renderPlayPause();
    const fastForwardControl = this.props.disableFastForward ? this.renderNullControl() : this.renderFastForward();
    const fastRewindontrol = this.props.disableFastForward ? this.renderNullControl() : this.renderFastRewind();

    return (
      <Animated.View style={[styles.controls.bottom, this.animations.bottomControl]} pointerEvents={this.state.showControls ? 'auto' : 'none'}>
        <ImageBackground source={require('../../../assets/player/bottom-vignette.png')} style={[styles.controls.column]} imageStyle={[styles.controls.vignette]}>
          <SafeAreaView style={[styles.controls.row, styles.controls.bottomControlGroup]}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              {fastRewindontrol}
              {playPauseControl}
              {fastForwardControl}
            </View>
            {seekbarControl}
            {timerControl}
          </SafeAreaView>
          <SafeAreaView style={[styles.controls.row, styles.controls.bottomSubtitleControlGroup]}>{this.props.textTracks != undefined && subtitleControl}</SafeAreaView>
        </ImageBackground>
      </Animated.View>
    );
  }

  renderMarker() {
    const {adStartTimes} = this.props;
    return adStartTimes
      .filter(time => time !== 0)
      .map((time, index) => {
        let left = ((time * 60) / this.state.duration) * 100;

        return (
          <View
            key={index}
            style={{
              position: 'absolute',
              left: left + '%',
              // Adjust these values as needed
              width: 3,
              top: 0,
              height: 3,
              backgroundColor: colors.primary,
              zIndex: 99,
            }}
          />
        );
      });
  }

  /**
   * Render the seekbar and attach its handlers
   */
  renderSeekbar() {
    return (
      <View style={[styles.seekbar.container, {flex: 3}]} collapsable={false} {...this.player.seekPanResponder.panHandlers}>
        <View style={styles.seekbar.track} onLayout={event => (this.player.seekerWidth = event.nativeEvent.layout.width)} pointerEvents={'none'}>
          <View
            style={[
              styles.seekbar.fill,
              {
                width: this.state.seekerFillWidth,
                backgroundColor: '#FFF',
              },
            ]}
            pointerEvents={'none'}
          />
          {this.renderMarker()}
        </View>
        <View style={[styles.seekbar.handle, {left: this.state.seekerPosition}]} {...this.player.seekPanResponder.panHandlers} pointerEvents={'none'}>
          <View style={[styles.seekbar.circle, {backgroundColor: '#fff' || '#FFF'}]} pointerEvents={'none'} />
        </View>
      </View>
    );
  }

  /**
   * Render the play/pause button and show the respective icon
   */
  renderPlayPause() {
    let source = this.state.paused === true ? require('../../../assets/player/play.png') : require('../../../assets/player/pause.png');
    return this.renderControl(<Image source={source} />, this.methods.togglePlayPause, styles.controls.playPause);
  }

  /**
   * Render the fast forward button and show the respective icon
   */
  renderFastForward() {
    let source = require('../../../assets/player/forward.png');
    return this.renderControl(
      // <Image source={ source } />,
      <Icon type="AntDesign" name="forward" style={{fontSize: 13, color: '#fff'}} />,
      this.methods.toggleFastForward,
      styles.controls.FastForward,
    );
  }
  /**
   * Render the fast forward button and show the respective icon
   */
  renderFastRewind() {
    let source = require('../../../assets/player/forward.png');
    return this.renderControl(
      // <Image source={ source } />,
      <Icon type="AntDesign" name="banckward" style={{fontSize: 13, color: '#fff'}} />,
      this.methods.toggleFastRewind,
      styles.controls.FastForward,
    );
  }

  /**
   * Render our Subtitle...if supplied.
   */
  renderSubTitle() {
    if (this.opts.title) {
      return (
        <View style={[styles.controls.control, styles.controls.title]}>
          <TouchableOpacity
            style={[styles.controls.text, styles.controls.titleText]}
            numberOfLines={1}
            onPress={() => {
              this.methods.toggleModal();
            }}>
            <Text style={{color: '#fff'}}> Subtitles</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  }

  renderSubtitles = (item, index) => {
    return (
      <TouchableOpacity key={index} style={styles.item} onPress={() => this.toggleSubtitle(item, index)}>
        <Text style={[styles.seasonText, styles.activeText]}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  toggleSubtitle(item, index) {
    console.log('====================================');
    console.log({toggleSubtitle: item});
    console.log('====================================');
    const textOBJ = {
      type: 'title',
      value: item?.title,
    };
    console.log('Selectec Text Track On Changes  ', textOBJ);

    // this.setState({
    //   selectedTextTrack: textOBJ,
    // });
    this._togglePlayPause();
    let state = this.state;
    state.visibleModal = !state.visibleModal;
    state.selectedTextTrack = textOBJ;
    this.setState(state);
  }

  /**
   * Show our timer.
   */
  renderTimer() {
    return this.renderControl(<Text style={styles.controls.timerText}>{this.calculateTime()}</Text>, this.methods.toggleTimer, styles.controls.timer);
  }

  /**
   * Show loading icon
   */
  renderLoader() {
    if (this.state.loading) {
      return (
        <View style={styles.loader.container}>
          <Animated.Image
            source={require('../../../assets/player/loader-icon.png')}
            style={[
              styles.loader.icon,
              {
                transform: [
                  {
                    rotate: this.animations.loader.rotate.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      );
    }
    return null;
  }

  renderError() {
    const { error } = this.state;
  
    if (error) {
      return (
        <View style={styles.error.container}>
          <Image source={require('../../../assets/player/error-icon.png')} style={styles.error.icon} />
          <Text style={styles.error.text}>Video unavailable</Text>
        </View>
      );
    }
  
    return null;
  }

  /**
   * Provide all of our options and render the whole component.
   */
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.events.onScreenTouch} style={[styles.player.container, this.styles.containerStyle]}>
        <View style={[styles.player.container, this.styles.containerStyle]}>
          <StatusBar hidden={true} />
          <Video 
            ref={videoPlayer => (this.player.ref = videoPlayer)} 
            resizeMode={this.state.resizeMode} 
            volume={this.state.volume} 
            paused={this.state.paused } 
            muted={this.state.isMuted || this.state.paused} 
            rate={this.state.rate} 
            onLoadStart={this.events.onLoadStart} 
            onProgress={this.events.onProgress} 
            onError={this.events.onError} 
            onLoad={this.events.onLoad} 
            onEnd={this.events.onEnd} 
            style={[styles.player.video, this.styles.videoStyle]} 
            source={this.props.source} 
            subtitle={true} 
            selectedTextTrack={this.state.selectedTextTrack} 
            textTracks={this.props.textTracks} 
            ignoreSilentSwitch="ignore" 
            
          />

          {this.renderError()}
          {this.renderTopControls()}
          {this.renderMiddleControls()}
          {this.renderLoader()}
          {this.renderBottomControls()}

          {this.props.textTracks != undefined && (
            <View
              style={[
                styles.container,
                {
                  backgroundColor: this.state.visibleModal ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.75)',
                },
              ]}>
              <Modal
                animationType={'slide'}
                transparent={false}
                onRequestClose={() => {
                  this._toggleModal();
                }}
                visible={this.state.visibleModal}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 22, backgroundColor: colors.black}}>
                  <View
                    style={{
                      flex: 0.8,
                      width: width,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <FlatList
                      data={this.props.textTracks}
                      renderItem={({item, index}) => this.renderSubtitles(item, index)}
                      contentContainerStyle={{
                        flex: 1,
                        justifyContent: 'center',
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 0.2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={() => this._toggleModal()}>
                      <Icon type="AntDesign" name="close" style={{fontSize: 50, color: 'white', marginLeft: 5}} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

/**
 * This object houses our styles. There's player
 * specific styles and control specific ones.
 * And then there's volume/seeker styles.
 */
const styles = {
  player: StyleSheet.create({
    container: {
      backgroundColor: '#000',
      flex: 1,
      alignSelf: 'stretch',
      justifyContent: 'space-between',
    },
    video: {
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }),
  error: StyleSheet.create({
    container: {
      backgroundColor: 'rgba( 0, 0, 0, 0.5 )',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      marginBottom: 16,
    },
    text: {
      backgroundColor: 'transparent',
      color: '#f27474',
    },
  }),
  loader: StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
  controls: StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: null,
      width: null,
    },
    column: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: null,
      width: null,
    },
    vignette: {
      flex: 1,
      resizeMode: 'stretch',
    },
    control: {
      padding: 16,
    },
    text: {
      backgroundColor: 'transparent',
      color: '#FFF',
      fontSize: 14,
      textAlign: 'center',
    },
    pullRight: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    top: {
      flex: 1,
    },
    middle: {
      flex: 3,
      justifyContent: 'space-evenly',
    },
    bottom: {
      flex: 0.5,
      justifyContent: 'flex-end',
    },
    topControlGroup: {
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: null,
      // top: -30,
      marginHorizontal: 30,
    },
    middleControlGroup: {
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: null,
      marginHorizontal: 30,
    },
    bottomControlGroup: {
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: null,
      marginBottom: 15,
      marginHorizontal: 30,
    },
    bottomSubtitleControlGroup: {
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      flexDirection: 'row',
      width: null,
      height: null,
      marginHorizontal: 30,
      marginBottom: 0,
    },
    volume: {
      flexDirection: 'row',
    },
    back: {
      flexDirection: 'row',
    },
    fullscreen: {
      flexDirection: 'column',
    },
    lock: {
      flexDirection: 'row',
    },
    playPause: {
      position: 'relative',
      width: '10%',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 0,
    },
    FastForward: {
      // position: 'relative',
      // width: '10%',
      // justifyContent: 'center',
      // alignItems: 'center',
      // zIndex: 0,
    },
    title: {
      alignItems: 'center',
      flex: 0.6,
      flexDirection: 'column',
      padding: 0,
    },
    titleText: {
      textAlign: 'center',
    },
    timer: {
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    timerText: {
      backgroundColor: 'transparent',
      color: '#FFF',
      fontSize: 9,
      textAlign: 'right',
    },
  }),
  volume: StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      height: 50,
      marginLeft: 20,
      marginRight: 40,
      width: 190,
      backgroundColor: 'transparent',
    },
    track: {
      backgroundColor: '#333',
      height: 5,
      marginLeft: 7,
      borderRadius: 5,
    },
    fill: {
      backgroundColor: '#FFF',
      height: 5,
      borderRadius: 5,
    },
    handle: {
      position: 'absolute',
      marginTop: -24,
      marginLeft: -24,
      padding: 16,
    },
    icon: {
      marginLeft: 7,
    },
  }),
  seekbar: StyleSheet.create({
    container: {
      width: '75%',
      height: 30,
      marginLeft: 20,
      marginRight: 20,
      backgroundColor: 'transparent',
    },
    track: {
      backgroundColor: '#333',
      height: 3,
      position: 'relative',
      top: 14,
      width: '100%',
    },
    fill: {
      backgroundColor: '#FFF',
      height: 3,
      width: '100%',
    },
    handle: {
      position: 'absolute',
      marginLeft: -7,
      height: 28,
      width: 28,
    },
    circle: {
      borderRadius: 12,
      position: 'relative',
      top: 7,
      left: 7,
      height: 18,
      width: 18,
    },
  }),
  modalContent: {
    justifyContent: 'center',
  },
  seasonText: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 20,
    padding: 15,
  },

  renderEpisodes: {
    marginTop: 10,
  },
  image: {
    width: 130,
    height: 90,
    resizeMode: 'contain',
    marginRight: 10,
  },
  buttonPlay: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  episodeName: {
    flex: 1,
    justifyContent: 'center',
  },
  videoEpisode: {
    flex: 1,
    flexDirection: 'row',
  },
  text: {
    color: '#9999',
  },
  activeText: {
    color: '#fff',
  },
  summary: {
    fontSize: 12,
    fontWeight: '200',
    color: '#fff',
    marginVertical: 10,
  },
  item: {
    padding: 2,
    marginVertical: 5,
    marginHorizontal: 16,
  },
};

export default VideoPlayerView;