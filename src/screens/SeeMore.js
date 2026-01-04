import React, {Component} from 'react';
import {ActivityIndicator, Dimensions, FlatList, SafeAreaView, TouchableOpacity, View} from 'react-native';
//components
import HttpRequest from '../utils/HTTPRequest';
//style
import {EventRegister} from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import { Viewport } from '@skele/components';
import withSequentialRendering from '../components/withSequentialRendering';
import Banner from '../components/AdMob/Banner/';
import HeaderWithTittle from '../components/Header/HeaderWithText';
import colors from '../constants/colors';

import {StyleSheet} from 'react-native';
const deviceWidth = Dimensions.get('window').width;

const createSubArray = arr => {
  // making a subarray with 3 elements
  const output = Array.from({length: Math.ceil(arr.length / 3)}, (_, i) => arr.slice(i * 3, i * 3 + 3));

  return output;
};

const SequentialBanner = withSequentialRendering(Banner);

class SeeMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      isDataFetched: false,
      token: '',
    };
  }

  componentDidMount() {
    // console.log('content idsss ', this.props.route?.params?.itemId.id);
    EventRegister.emit('videoPaused', {
      isClosed: 'false',
    });
    this.getAallContent();
  }

  getAallContent = () => {
    this.setState({isDataFetched: false, data: []});
    HttpRequest.getAllContent(this.state.token, this.props.route?.params?.itemId.id)
      .then(res => {
        this.setState({isDataFetched: true});
        const result = res.data;
        // console.log('All Content length  : ', result);
        if (res.status == 200 && result.error == false) {
          this.setState({data: result.data});
        } else {
          console.log('All Content API Error : ', result);
          this.setState({data: []});
          // this.notify('danger','Oops!',result.message != undefined ? result.message : result.status,result.message != undefined ? false : true);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true, data: []});
        console.log('All Content API Catch Exception: ', err);
        // this.notify('danger','Oops!','Something Went Worng!',false);
      });
  };

  renderItem = ({item: items, index}) => {
    return (
      <>
        {index % 2 === 0 && index !== 0 ? (
          <View style={{flex: 1}}>
            <SequentialBanner />
          </View>
        ) : null}
        <View style={{flex: 1, flexDirection: 'row'}}>
          {items.map(item => (
            <View style={styles.thumbnailView} key={item.id}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.push('Details', {
                    itemId: item.id,
                    type: item.type,
                    refresh: 1,
                  })
                }>
                <FastImage
                  style={styles.thumbnailImage}
                  source={{
                    uri: item.thumbnail,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </>
    );
  };

  render() {
    const {data, isDataFetched} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <HeaderWithTittle name={this.props.route?.params?.itemId.name} navigation={this.props.navigation} />

        {!isDataFetched && (
          <View animation={'slideInRight'} style={styles.resultContainer}>
            <View style={styles.resultContainer}>
              <ActivityIndicator size="large" color="#ff0000" />
            </View>
          </View>
        )}
        {isDataFetched && data.length != 0 && <Viewport.Tracker><FlatList data={createSubArray(data)} style={{height: '100%'}} keyExtractor={item => item?.[0]?.id} renderItem={this.renderItem} /></Viewport.Tracker>}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroudColor,
  },
  thumbnailView: {
    width: deviceWidth / 3.3,
    height: deviceWidth / 2.9,
    borderRadius: 5,
    overflow: 'hidden',
    // marginRight: '5%',
    marginTop: '2%',
    margin: 5,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: (deviceWidth - 10) / 3,
    margin: 5,
    borderRadius: 5,
    overflow: 'hidden',
    height: Dimensions.get('window').width / 3, // approximate a square
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
  },
});

export default SeeMore;
