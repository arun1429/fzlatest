import React, { Component } from 'react'
import { View, Dimensions, TouchableOpacity, Text, FlatList, Image, TouchableWithoutFeedback } from 'react-native';
import Video from 'react-native-video';
// import InViewPort from "@coffeebeanslabs/react-native-inviewport";
const deviceWidth = Dimensions.get('window').width


export default class VideoPlayer extends React.Component {

    pauseVideo = () => {
      if(this.video) {
        this.video.pauseAsync();
      }
    }
  
    playVideo = () => {
      if(this.video) {
        this.video.playAsync();
      }
    }
  
    handlePlaying = (isVisible) => {
      this.props.index === this.props.currentIndex ?  this.playVideo() : this.pauseVideo();
    }
  
    render() {
        return (
          <View style={{flex:1}}>
            {/* <InViewPort onChange={this.handlePlaying}>
              <Video
                ref={ref => {this.video = ref}}
                source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                shouldPlay
                style={{ width: deviceWidth, height: 300 }}
              />
            </InViewPort> */}
          </View>
        )
    }  
  }