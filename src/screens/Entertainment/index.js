import React, {Component} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  Linking,
  StatusBar,
  Alert,
} from 'react-native';
import HeaderWithTittle from '../../components/Header/HeaderWithText';
import HomeHeader from '../../components/Header/HomeHeader';
import colors from '../../constants/colors';
import {EventRegister} from 'react-native-event-listeners';
import {SafeAreaView} from 'react-native-safe-area-context';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import historyQuizBG from '../../../assets/img/History-quiz.jpg';
import circketQuizBG from '../../../assets/img/Play-Cricket-Quiz.jpg';
import quizBG from '../../../assets/img/Play-Quizzes.jpg';

export default class EntertaimentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  async openLink() {
    try {
      const url = 'http://555.set.qureka.com/';

      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#6200EE',
          secondaryToolbarColor: 'black',
          navigationBarColor: 'black',
          navigationBarDividerColor: 'white',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right',
          },
          headers: {
            'my-custom-header': 'my custom header value',
          },
        });
        // await this.sleep(800);
        // Alert.alert(JSON.stringify(result))
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  componentDidMount = () => {
    EventRegister.emit('videoPaused', {
      isClosed: 'false',
    });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.backgroudColor}}>
        <StatusBar backgroundColor={colors.backgroudColor} />
        <HomeHeader {...this.props} />
        {/* <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.backgroudColor,
          }}>
          <Text style={{color: '#fff'}}>This page is under working</Text>
        </View> */}
        <TouchableOpacity
          onPress={this.openLink}
          style={{flex: 1, color: 'white'}}>
          <Image
            resizeMode="contain"
            style={{flex: 1, width: '100%'}}
            source={quizBG}
          />
          <Image
            resizeMode="contain"
            style={{flex: 1, width: '100%'}}
            source={historyQuizBG}
          />
          <Image
            resizeMode="contain"
            style={{flex: 1, width: '100%'}}
            source={circketQuizBG}
          />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
