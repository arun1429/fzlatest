import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Dimensions, ActivityIndicator } from 'react-native'
import Swiper from 'react-native-swiper'
import Video from 'react-native-video';
import HttpRequest from '../../utils/HTTPRequest';


const myData = [
  {
    "id": "61cc29228f64cb6dfc61ee12",
    "type": "1",
    "name": "गोजिमा ६ रूपिया ||",
    "link": "https://d1pa5vk3to5urj.cloudfront.net/movie/1640769954gozima_6_rupiya/360p-movie/1640769954gozima_6_rupiya.mp4",
    "trailer": "https://d1pa5vk3to5urj.cloudfront.net/trailer/1640770005gozima/360p-trailer/1640770005gozima.mp4",
    "image": "https://fz.freizeitmedia.com/storage/movie//1640769826-gozima6_rupiya.jpg"
  },
  {
    "id": "61cc27c7c19ef158292dd862",
    "type": "1",
    "name": "\"मनको लड्डू (Expectation Hurts)",
    "link": "https://d1pa5vk3to5urj.cloudfront.net/movie/1640769630manako_laddo/360p-movie/1640769630manako_laddo.mp4",
    "trailer": "https://d1pa5vk3to5urj.cloudfront.net/trailer/1640769959manko_ladoo/360p-trailer/1640769959manko_ladoo.mp4",
    "image": "https://fz.freizeitmedia.com/storage/movie/l-expectation-hurts/1640769479-manko_laddo.jpg"
  },
  {
    "id": "61cc2623af94765cfe024892",
    "type": "1",
    "name": "Kasam “Promises Will Stay Forever”",
    "link": "https://d1pa5vk3to5urj.cloudfront.net/movie/1640769417kasam/360p-movie/1640769417kasam.mp4",
    "trailer": "https://d1pa5vk3to5urj.cloudfront.net/trailer/1640769912kasam/360p-trailer/1640769912kasam.mp4",
    "image": "https://fz.freizeitmedia.com/storage/movie/kasam-promises-will-stay-forever/1640769059-kasam.jpg"
  },
  {
    "id": "61c8189d383b1f3a5d6df9d2",
    "type": "1",
    "name": "Taredhan",
    "link": "https://d1pa5vk3to5urj.cloudfront.net/movie/1640503788taredhan_render/360p-movie/1640503788taredhan_render.mp4",
    "trailer": "https://d1pa5vk3to5urj.cloudfront.net/trailer/1640608766taredhan/360p-trailer/1640608766taredhan.mp4",
    "image": "https://fz.freizeitmedia.com/storage/movie/taredhan/1640503453-taredhan_landscape.jpg"
  },
  {
    "id": "61c8160839e6c4159b313092",
    "type": "1",
    "name": "List",
    "link": "https://d1pa5vk3to5urj.cloudfront.net/movie/1640503087list_render/360p-movie/1640503087list_render.mp4",
    "trailer": "https://d1pa5vk3to5urj.cloudfront.net/trailer/1640608813list/360p-trailer/1640608813list.mp4",
    "image": "https://fz.freizeitmedia.com/storage/movie/list/1640502792-list_landscape.jpg"
  }
]


class VideoSlider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      backgroundImage: '',
      activeIndex: 0,
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
      paused: true,
      currentIndex: 0,
      sliderData: [],
    }
  }

  componentDidMount = () => {
    this.getSlider();
    setTimeout(() => {
      this.setState({ isStarted: true });
    }, 2000);
  }
  componentWillUnmount() {
    this.setState({
      isStarted: true,
      isMuted: true,
    })
  }
  //Get Slider
  getSlider = () => {
    this.setState({ isLoading: true });
    HttpRequest.getSlider(this.props.token)
      .then((res) => {
        this.setState({ isLoading: false });
        const result = res.data;
        // console.log("Slider API Result: ", result);
        if (res.status == 200 && result.error == false) {
          if (result.data.length > 0) {
            this.setState({
              isLoading: false,
              totalItem: result.data.length,
              sliderData: result.data
            })
          }
        } else {
          console.log("Slider API Error: ", result);

        }
      })
      .catch(err => {
        this.setState({ isLoading: false })
        console.log("Slider API Catch Exception: ", err);
      })

  }

  _onLoadStart = () => {
    this.setState({ isBuffering: true })
  }
  _onLoad = (data) => {
    this.setState({ isBuffering: false, videoDuration: data.duration })

  }
  _onProgress = (progress) => {
    this.setState({
      isBuffering: false, progressPlayer: progress.currentTime,
    })

  }

  _onError = (err) => {
    this.setState({ isBuffering: false })
  }


  onChangeImage = (index) => {
    console.log('currentIndex ', index)
    this.setState({ currentIndex: index });
  }
  render() {
    const { sliderData,isLoading } = this.state;
    return (
               <Swiper
            onIndexChanged={this.onChangeImage}
            showsPagination={false}
            style={styles.wrapper} showsButtons={false} loop={true}>

            {sliderData.map((item, index) => {
              return (
                 <TouchableOpacity
                 key={index}
                 testID={item.id} 
                 onPress={() => this.props.navigation.navigate("Details", { itemId: item.id, type: item.type })}
                 style={{borderRadius: 5,}}>
   
   
                 <Video source={{ uri: item.trailer }}
                   ref={(ref) => {
                     this.player = ref
                   }}
                   key={index}
                   onProgress={this._onProgress}
                   onLoadStart={this._onLoadStart}
                   onError={this._onError}
                   onLoad={this._onLoad}
                   onEnd={() => this.setState({ isStarted: true, isMuted: true })}
                   bufferConfig={{
                     minBufferMs: 5000,
                     maxBufferMs: 10000,
                   }}
                   rate={1.0}
                   volume={1}
                   muted={this.state.isMuted}
                   repeat={true}
                   paused={index !== this.state.currentIndex}
                   resizeMode={"cover"}
                   poster={item.image}
                   posterResizeMode='cover'
                   style={{ height: "97%", width: "95%", alignSelf: 'center', borderRadius: 5 }}
                   ignoreSilentSwitch="ignore"
                 />
                     {/* <Text style={styles.count} >{this.state.currentIndex + 1}/{this.state.totalItem}</Text> */}

               </TouchableOpacity>
              )
            })}

          </Swiper>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    marginHorizontal: 50
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  count: {
    position: 'absolute',
    top: 20,
    right: 20,
    color: '#fff'
  }
})
export default VideoSlider;