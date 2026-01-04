import React, {Component} from 'react';
import {ActivityIndicator, Dimensions, FlatList, SafeAreaView, TouchableOpacity, View} from 'react-native';
//components
import HttpRequest from '../utils/HTTPRequest';
//style
import {EventRegister} from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import Banner from '../components/AdMob/Banner/';
import HeaderWithTittle from '../components/Header/HeaderWithText';
import colors from '../constants/colors';

import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {latestMovies, loginToken, storeBundleId, userInfo} from '../Redux/Actions/Actions';
const deviceWidth = Dimensions.get('window').width;

const createSubArray = arr => {
  // making a subarray with 3 elements
  const output = Array.from({length: Math.ceil(arr.length / 3)}, (_, i) => arr.slice(i * 3, i * 3 + 3));

  return output;
};

class TvMovies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      isDataFetched: false,
      token: '',
      bundleId: '',
    };
  }

  componentDidMount() {
    console.log('bundle idsss ', this.props.route?.params?.itemId);
    EventRegister.emit('videoPaused', {
      isClosed: 'false',
    });
    // console.log("data from State ", this.props.route?.params?.itemId)
    // this.setState({
    //     data: this.props.route?.params?.itemId.content
    // })
    this.getAallContent();
  }

  getAallContent = () => {
    this.setState({isDataFetched: false, data: []});
    HttpRequest.getAllBundleContent(this.props.token, this.props.route?.params?.itemId)
      .then(res => {
        this.setState({isDataFetched: true});
        const result = res.data;
        console.log('All Content length  : ', result.data?.movies?.length);
        if (result.error == false) {
          this.setState({data: result.data?.movies, bundleId: result.data?._id || result.data?.id});
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

  onDetailPage = item => {
    // console.log('Show recently details', item);
    this.props.navigation.push('Exclusive', {itemId: item.id || item._id, type: item.type || 1, refresh: 1, tvMovies: true});
    this.props.storeBundleId(this.state.bundleId);
  };

  renderItem = ({item}) => {
    console.log('data item', item);
    return (
      <View style={styles.thumbnailView}>
        <TouchableOpacity onPress={() => this.onDetailPage(item)}>
          <FastImage
            style={styles.thumbnailImage}
            source={{
              uri: item.image,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {data, isDataFetched} = this.state;
    console.log('====================================');
    console.log({
      'data?.length': data?.length,
    });
    console.log('====================================');
    return (
      <SafeAreaView style={styles.container}>
        <HeaderWithTittle name={'Tv Movies'} navigation={this.props.navigation} />
        {!isDataFetched && (
          <View animation={'slideInRight'} style={styles.resultContainer}>
            <View style={styles.resultContainer}>
              <ActivityIndicator size="large" color="#ff0000" />
            </View>
          </View>
        )}
        {isDataFetched && data.length != 0 && <FlatList numColumns={3} data={data} style={{height: '100%'}} keyExtractor={item => item?.[0]?.id} renderItem={this.renderItem} />}
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

const mapStateToProps = state => {
  // console.log(`map state to props home `, state);
  return {
    token: state.token,
    sliderImages: state.slider,
    recentlywatched: state.recentlywatched,
    latestmovies: state.latestmovies,
    latestGame: state.latestGame,
    latestseries: state.latestseries,
    documentary: state.documentary,
    comingsoon: state.comingsoon,
    trendingnow: state.trendingnow,
    Vlogs: state.vlogs,
    Exclusive: state.Exclusive,
    bundleId: state.bundleId,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({storeBundleId}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TvMovies);

// export default ;
