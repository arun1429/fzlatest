import React, {Component} from 'react';
import {View, SafeAreaView, TouchableOpacity, Keyboard, ScrollView, FlatList, TextInput, Text, ActivityIndicator, Alert, Platform, Button, StyleSheet, Image} from 'react-native';
import {Item} from 'native-base';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import {Icon} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation';
import NetInfo from '@react-native-community/netinfo';
import {EventRegister} from 'react-native-event-listeners';

//API
//style
import colors from '../constants/colors';
import HeaderWithTittle from '../components/Header/HeaderWithText';
import HTTPRequest from '../utils/HTTPRequest';

const numColumns = 2;

const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({key: `blank-${numberOfElementsLastRow}`, empty: true});
    numberOfElementsLastRow++;
  }

  return data;
};

const MyLanguages = [
  {id: 1, name: 'Hindi', bgcolors: colors.brandPrimary},
  {id: 1, name: 'English', bgcolors: colors.brandPrimary},
  {id: 1, name: 'Tamil', bgcolors: colors.brandPrimary},
];

class Languages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: false,
      isLoading: false,
      value: '',
      data: [],
      isNotify: false,
      title: '',
      subtitle: '',
      type: '',
      action: false,
      status: '',
      isConnected: true,
      token: '',
    };
  }
  componentDidMount() {
    EventRegister.emit('videoPaused', {
      isClosed: 'false',
    });

    Orientation.lockToPortrait();
    this.getMoviesLangugaes();
  }

  getMoviesLangugaes = () => {
    this.setState({isLoading: true});
    HTTPRequest.getMoviesLanguages(this.state.token)
      .then(res => {
        const result = res.data;
        console.log('All Movies Languages data  : ', JSON.stringify(result.data));
        if (res.status == 200 && result.error == false) {
          this.setState({
            data: result.data,
            isLoading: false,
          });
        } else {
          console.log('All Exclusive Bundle API Error : ', result);
          this.setState({
            data: [],
            isLoading: false,
          });
        }
      })
      .catch(err => {
        this.setState({isLoading: false, data: []});
        console.log('All Exclusive Bundle API Catch Exception: ', err);
      });
  };

  renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('MoviesByLanguages', {HeaderName: item.language})} key={item.language} style={styles.renderLanguages}>
        <View style={{height: '100%', width: '100%', justifyContent: 'flex-end', alignItems: 'center', borderRadius: 5}}>
          <Image style={{height: '100%', width: '100%', justifyContent: 'flex-end', alignItems: 'center', borderRadius: 5}} source={{uri: item.image}} imageStyle={{borderRadius: 6}} blurRadius={50} resizeMode={'cover'}></Image>
          {item.language == 'English' ? null : <Text style={{color: colors.white, fontWeight: 'bold', fontSize: 12, position: 'absolute', bottom: 22}}>{item.name_tran}</Text>}
          <Text style={{color: colors.white, fontWeight: 'bold', fontSize: 12, position: 'absolute', bottom: 7}}>{item.language}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  //Notification Alerts Open
  notify = (type, title, subtitle, action) => {
    this.setState({
      isNotify: true,
      title: title,
      subtitle: subtitle,
      type: type,
      action: action,
    });
  };
  //Notification Alerts CLose
  updateNotify() {
    this.setState({
      isNotify: false,
    });
  }

  render() {
    const {isLoading, data} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <HeaderWithTittle name={'Languages'} navigation={this.props.navigation} />
        {isLoading && (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
            <ActivityIndicator size="large" color="#fff" style={{justifySelf: 'center'}} />
          </View>
        )}
        {!isLoading && data != 0 && (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>No Data Found </Text>
          </View>
        )}
        {!isLoading && data != 0 && <FlatList data={formatData(this.state.data, numColumns)} style={{height: '100%'}} renderItem={this.renderItem} numColumns={numColumns} />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroudColor,
  },
  renderLanguages: {
    height: 100,
    margin: 5,
    width: '47%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Languages;
