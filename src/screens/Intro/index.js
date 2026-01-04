import React, { Component } from 'react'
import { View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import AppIntroSlider from 'react-native-app-intro-slider'
import Orientation from 'react-native-orientation';
import { hideNavigationBar ,showNavigationBar } from 'react-native-navigation-bar-color';

//Components
import StatusBar from '../../components/StatusBar/';
import ToolBar from '../../components/ToolBar';
import BottomLine from '../../components/BottomHorizontalLine/'
//Styles
import styles from './styles';
import COLORS from "../../constants/colors";

export default class Intro extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount () {
    showNavigationBar();
    Orientation.lockToPortrait();
  }

  _renderItem = ({ item }) => {
      if(item.key === 's1'){
        return (
            <ImageBackground source={item.image} style={styles.imageBackground}>
              <View style={styles.mainContent}>
                <Image
                  style={styles.mapImage}
                  source={require('../../../assets/img/intro/map.png')}
                />
                <Text style={styles.introText1}>{item.title}</Text>
                <FastImage
                  style={styles.logoImage1}
                  source={require('../../../assets/img/logo/logo.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <Image
                  style={styles.introTextImage}
                  source={require('../../../assets/img/intro/sayHi.png')}
                />
              </View>
            </ImageBackground>
        );
      }
      else if(item.key === 's2')
      {
        return (
            <View style={styles.mainContent}>
                <FastImage
                  style={styles.imageAnimation}
                  source={item.image}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={[styles.text,styles.textMargin]}>{item.text}</Text>
            </View>
        );
      }
      else{
        return (
            <View style={styles.mainContent}>
                <FastImage
                  style={styles.imageMedium}
                  source={item.image}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={[styles.text,styles.textMargin]}>{item.text}</Text>
            </View>
        );
      }
    
  };
  render() {
      //Intro slides
      return (
        <View style={styles.container}> 
          <StatusBar />
          <ToolBar navigation={this.props.navigation} />
          <AppIntroSlider
            slides={slides}
            renderItem={this._renderItem}
            onDone={this._onDone}
            showNextButton={false}
            showDoneButton={false}
            bottomButton={true}
            dotStyle={styles.inactiveDots}
            activeDotStyle={styles.activeDots}
          />
          <TouchableOpacity style={styles.signinButton} onPress={() => this.props.navigation.navigate("Signin")}>
              <Text style={styles.signinText}>SIGN IN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={() => this.props.navigation.navigate("Home")}>
              <Text style={styles.signinText}>SKIP</Text>
          </TouchableOpacity>
          {/* <BottomLine /> */}
        </View>
      );
  }
}

 
const slides = [
  {
    key: 's1',
    text: 'Say Hi',
    title: 'What`s NEXT',
    image: require('../../../assets/img/intro/splash_1.png'),
    backgroundColor: COLORS.white,
  },
  {
    key: 's2',
    title: 'Download and go',
    text: 'Save your data, watch offline on a plane, train, or submarine...',
    // image: require('../../../assets/animations/animation_final.gif'),
    image: require('../../../assets/animations/splash_2.gif'),
    backgroundColor: COLORS.white,
  },
  {
    key: 's3',
    title: 'No pesky contracts',
    text: 'Cancel anytime.',
    // image: require('../../../assets/img/intro/splash_3.png'),
    image: require('../../../assets/animations/splash_3.gif'),
    backgroundColor: COLORS.white,
  },
];