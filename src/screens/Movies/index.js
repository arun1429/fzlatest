import React, {Component} from 'react';
import {View, TouchableOpacity, Text, FlatList, ScrollView, ActivityIndicator, Button, Alert, Platform} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import Orientation from 'react-native-orientation';
import NetInfo from '@react-native-community/netinfo';
import {EventRegister} from 'react-native-event-listeners';
import { Viewport } from '@skele/components';
//API
import HttpRequest from '../../utils/HTTPRequest';
import {connect} from 'react-redux';
//Redux
import {loginToken, allMovies} from '../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';
import DrawerEvents from '../../components/Drawer/DrawerEvents';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
//components
import withSequentialRendering from '../../components/withSequentialRendering';
import Alerts from '../../components/Alerts/';
import Banner from '../../components/AdMob/Banner/';
//style
import styles from './styles';
import HeaderWithTittle from '../../components/Header/HeaderWithText';
import {SafeAreaView} from 'react-native-safe-area-context';

const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({key: `blank-${numberOfElementsLastRow}`, empty: true});
    numberOfElementsLastRow++;
  }

  return data;
};

const numColumns = 3;

const SequentialBanner = withSequentialRendering(Banner);

class Movies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHeader: true,
      isDataFetched: false,
      value: '',
      isNotify: false,
      title: '',
      subtitle: '',
      type: '',
      action: false,
      data: [],
      activeGenre: '',
      isConnected: false,
    };
    this.subscribeToDrawerEvents = this.subscribeToDrawerEvents.bind(this);
    DrawerEvents.subscribe(this.subscribeToDrawerEvents);
  }

  componentDidMount() {
    {
      this.props.type == 'show'
        ? null
        : EventRegister.emit('videoPaused', {
            isClosed: 'false',
          });
    }
    Orientation.lockToPortrait();
    //Check internet connectivity
    this.checkNetworkConnectivity();
  }

  checkNetworkConnectivity = () => {
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
                this.checkNetworkConnectivity();
              },
            },
          ]);
        } else {
          this.setState({
            isConnected: true,
          });
          this.getGenresAllMovies();
        }
      });
    } else {
      // For iOS devices
      this.handleFirstConnectivityChange();
    }
  };

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
              this.checkNetworkConnectivity();
            },
          },
        ]);
      } else {
        this.setState({
          isConnected: true,
        });
        this.getGenresAllMovies();
      }
    });

    // Unsubscribe
    unsubscribe();
  };

  subscribeToDrawerEvents = event => {
    if (event === 'DRAWER_CLOSED') {
      this.setState({
        showHeader: true,
      });
    } else {
      this.setState({
        showHeader: false,
      });
    }
  };

  getGenresAllMovies = () => {
    this.setState({isDataFetched: false, activeGenre: '', data: []});
    // if (this.props.token !== '') {
    HttpRequest.getGenresAllMovies(this.props.token)
      .then(res => {
        this.setState({isDataFetched: true});
        const result = res.data;
        // console.log('All Movies length  : ', result.data.length);
        if (res.status == 200 && result.error == false) {
          this.setState({data: result.data});
        } else {
          // console.log('All Movies API Error : ', result);
          this.setState({data: []});
          // this.notify('danger','Oops!',result.message != undefined ? result.message : result.status,result.message != undefined ? false : true);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true, data: []});
        console.log('All Movies API Catch Exception: ', err);
        // this.notify('danger','Oops!','Something Went Worng!',false);
      });
    // } else {
    //     this.setState({ isDataFetched: true, data: [] });
    //     console.log("All Movies Error: Token not found");
    //     // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
    // }
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

  handleGenre = (genreValue, genreName) => {
    if (genreName !== 'All Genres') {
      this.getGenresSpecificMovies(genreValue);
    } else {
      this.getGenresAllMovies();
    }
  };

  getGenresSpecificMovies = id => {
    if (id !== '') {
      this.setState({isDataFetched: false, activeGenre: id, data: []});
      if (this.props.token !== '') {
        HttpRequest.getGenresSpecificMovies(this.props.token, id)
          .then(res => {
            const result = res.data;
            if (res.status == 200 && result.error == false) {
              this.insertAds(result.data);
            } else {
              console.log('All Movies of a particular Genre API Error : ', result);
              this.setState({isDataFetched: true, data: []});
            }
          })
          .catch(err => {
            this.setState({isDataFetched: true, data: []});
            console.log('All Movies of a particular Genre API Catch Exception: ', err);
            // this.notify('danger','Oops!','Something Went Worng!',false);
          });
      } else {
        this.setState({isDataFetched: true, data: []});
        console.log('All Movies of a particular Genre Error: Token not found');
        // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
      }
    } else {
      this.getGenresAllMovies();
    }
  };

  addItemEvery = (arr, item, starting, frequency) => {
    for (var i = 0, a = []; i < arr.length; i++) {
      a.push(arr[i]);
      if ((i + 1 + starting) % frequency === 0) {
        console.log(JSON.stringify(item));
        item.forEach((element, index) => {
          element['id'] = index.toString();
          a.push(element);
        });
        i++;
        if (arr[i]) a.push(arr[i]);
      }
    }
    return a;
  };

  insertAds = data => {
    let originalData = [];
    originalData.push(...data);

    originalData = this.addItemEvery(
      originalData,
      [
        {type: 'ad', name: 'AdMob'},
        {type: 'dm', name: 'AdMob'},
        {type: 'dm', name: 'AdMob'},
      ],
      3,
      3,
    );
    this.setState({isDataFetched: true, data: originalData});
  };

  loader = () => {
    return (
      <SkeletonPlaceholder backgroundColor={'#191a1f'} highlightColor={'#e1e9ee'}>
        <View style={styles.thumbnailView}></View>
      </SkeletonPlaceholder>
    );
  };

  renderItem = ({item, index}) => {
    if (item.content.length > 0) {
      return (
        <View style={styles.middleContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.thumbnailHeader}>{item.name + ' ' + this.state.activeGenre}</Text>
            {item.content.length > 3 && (
              <TouchableOpacity onPress={() => this.props.navigation.push('SeeMore', {itemId: item})}>
                <Text style={[styles.thumbnailHeader, {fontSize: 12}]}>See More</Text>
              </TouchableOpacity>
            )}
          </View>
          <View
            onLayout={({nativeEvent}) => {
              this.setState({
                measuresSeason: nativeEvent.layout.y + 10,
              });
            }}>
            <ScrollView horizontal={true} scrollEventThrottle={200} decelerationRate="fast">
              {item.content.slice(0, 10).map(item => {
                return (
                  <View style={styles.thumbnailView} key={item.id}>
                    <TouchableOpacity onPress={() => this.props.navigation.push('Details', {itemId: item.id, type: item.type, refresh: 1})}>
                      <FastImage
                        style={styles.thumbnailImage}
                        source={{
                          uri: item.thumbnail,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          {index % 2 == 0 && <SequentialBanner />}
        </View>
      );
    }
  };

  renderGenreSpecificItems = ({item, index}) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return item.type === 'ad' || item.type === 'dm' ? (
      <SequentialBanner />
    ) : (
      <View style={[styles.middleContainer, {marginVertical: 5, marginHorizontal: 5}]}>
        <View style={styles.thumbnailView} key={item.id}>
          <TouchableOpacity onPress={() => this.props.navigation.push('Details', {itemId: item.id, type: item.type})}>
            <FastImage
              style={styles.thumbnailImage}
              source={{
                uri: item.thumbnail,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const {isConnected, showHeader, isDataFetched, isNotify, data, title, subtitle, type, action, activeGenre} = this.state;
    let sortedObj = data.sort(function (a, b) {
      if (b.content != undefined) {
        return b.content.length - a.content.length;
      }
    });
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.rightContainer}>
          {this.props.type == 'show' ? null : <HeaderWithTittle name={'Movies'} navigation={this.props.navigation} />}
          {isNotify && isConnected && <Alerts show={isNotify} type={type} title={title} subtitle={subtitle} navigation={this.props.navigation} action={action} onRef={ref => (this.parentReference = ref)} parentReference={this.updateNotify.bind(this)} />}
          {!isConnected && (
            <View style={{flexGrow: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '2%'}}>
              <Text style={{fontSize: 16, fontWeight: '600', color: '#fff', textAlign: 'center', margin: '5%'}}>There is a problem connecting to Freizeit. Please Try again later.</Text>
              <Button title="Retry" color="#191a1f" onPress={() => this.checkNetworkConnectivity()} />
            </View>
          )}
          {!isDataFetched && isConnected && (
            <Animatable.View animation={'slideInRight'} style={styles.noResultContainer}>
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#ff0000" />
              </View>
            </Animatable.View>
          )}
          {isDataFetched && data.length == 0 && isConnected && (
            <Animatable.View animation={'slideInRight'} style={styles.noResultContainer}>
              <FastImage style={styles.notFoundImage} source={require('../../../assets/img/no_genres_found.png')} resizeMode={FastImage.resizeMode.contain} />
            </Animatable.View>
          )}

          {isDataFetched && isConnected && (
            <Animatable.View animation={'slideInRight'} style={styles.resultContainer}>
              <View style={styles.foundResultContainer}>
                {activeGenre == '' &&  <Viewport.Tracker><FlatList data={sortedObj} style={{height: '100%'}} renderItem={this.renderItem} /></Viewport.Tracker>}
                {activeGenre != '' &&  <Viewport.Tracker><FlatList data={formatData(data, numColumns)} style={{height: '100%'}} renderItem={this.renderGenreSpecificItems} numColumns={numColumns} /></Viewport.Tracker>}
              </View>
            </Animatable.View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  // console.log(`map state to props home `, state);
  return {
    token: state.token,
    movies: state.movies,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginToken: bindActionCreators(loginToken, dispatch),
    allMovies: bindActionCreators(allMovies, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Movies);
