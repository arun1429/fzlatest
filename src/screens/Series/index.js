import React, {Component} from 'react';
import {View, TouchableOpacity, Text, FlatList, ScrollView, ActivityIndicator, Button, Alert, Platform} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import Orientation from 'react-native-orientation';
//API
import HttpRequest from '../../utils/HTTPRequest';
//Redux
import {connect} from 'react-redux';
import {loginToken, allMovies} from '../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';
import DrawerEvents from '../../components/Drawer/DrawerEvents';
import NetInfo from '@react-native-community/netinfo';
import {EventRegister} from 'react-native-event-listeners';
import { Viewport } from '@skele/components';
//components
import SideMenu from '../../components/SideMenu';
import BottomLine from '../../components/BottomHorizontalLine/';
import Alerts from '../../components/Alerts/';
import Banner from '../../components/AdMob/Banner';
import withSequentialRendering from '../../components/withSequentialRendering';
//style
import styles from './styles';
import COLORS from '../../constants/colors';
import HomeHeader from '../../components/Header/HomeHeader';
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

class Series extends Component {
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
      isCOnnected: false,
    };
    this.subscribeToDrawerEvents = this.subscribeToDrawerEvents.bind(this);
    DrawerEvents.subscribe(this.subscribeToDrawerEvents);
  }

  componentDidMount() {
    EventRegister.emit('videoPaused', {
      isClosed: 'false',
    });
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
          this.getGenresAllSeries();
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
        this.getGenresAllSeries();
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

  getGenresAllSeries = () => {
    this.setState({isDataFetched: false, activeGenre: '', data: []});
    // if(this.props.token !== ''){
    HttpRequest.getGenresAllSeries(this.props.token)
      .then(res => {
        this.setState({isDataFetched: true});
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          this.setState({data: result.data});
        } else {
          console.log('All Series API Error : ', result);
          this.setState({data: []});
          // this.notify('danger','Oops!',result.message != undefined ? result.message : result.status,result.message != undefined ? false : true);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true, data: []});
        console.log('All Series API Catch Exception: ', err);
        // this.notify('danger','Oops!','Something Went Worng!',false);
      });
    // } else {
    //     this.setState({ isDataFetched: true, data:[] });
    //     console.log("All Series Error: Token not found");
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
      this.getGenresSpecificSeries(genreValue);
    } else {
      this.getGenresAllSeries();
    }
  };

  getGenresSpecificSeries = id => {
    if (id !== '') {
      this.setState({isDataFetched: false, activeGenre: id, data: []});
      // if(this.props.token !== ''){
      HttpRequest.getGenresSpecificSeries(this.props.token, id)
        .then(res => {
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            this.setState({isDataFetched: true, data: result.data});
          } else {
            console.log('All Series of a particular Genre API Error : ', result);
            this.setState({isDataFetched: true, data: []});
          }
        })
        .catch(err => {
          this.setState({isDataFetched: true, data: []});
          console.log('All Series of a particular Genre API Catch Exception: ', err);
          // this.notify('danger','Oops!','Something Went Worng!',false);
        });
      // } else {
      //     this.setState({ isDataFetched: true, data:[] });
      //     console.log("All Series of a particular Genre Error: Token not found");
      //     // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
      // }
    } else {
      this.getGenresAllSeries();
    }
  };

  renderItem = ({item, index}) => {
    if (item.content.length > 0) {
      return (
        <View style={styles.middleContainer}>
          <Text style={styles.thumbnailHeader}>{item.name + ' ' + this.state.activeGenre}</Text>
          <View
            onLayout={({nativeEvent}) => {
              this.setState({
                measuresSeason: nativeEvent.layout.y + 10,
              });
            }}>
            <ScrollView horizontal={true} scrollEventThrottle={200} decelerationRate="fast">
              {item.content.map(item => {
                return (
                  <View style={styles.thumbnailView} key={item.id}>
                    <TouchableOpacity onPress={() => this.props.navigation.push('Details', {itemId: item.id, type: item.type})}>
                      <FastImage style={styles.thumbnailImage} source={{uri: item.thumbnail}} resizeMode={FastImage.resizeMode.cover} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          {item.content.length != 1 && <SequentialBanner />}
        </View>
      );
    }
  };

  renderGenreSpecificItems = ({item, index}) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View style={[styles.middleContainer, {margin: 5}]}>
        <View style={styles.item} key={item.id}>
          <TouchableOpacity style={styles.thumbnailView} onPress={() => this.props.navigation.push('Details', {itemId: item.id, type: item.type, refresh: 1})}>
            <FastImage style={styles.thumbnailImage} source={{uri: item.thumbnail}} resizeMode={FastImage.resizeMode.cover} />
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
        {/* { showHeader == true &&
                // <HeaderHome 
                //     show={showHeader} 
                //     type="2" 
                //     token={this.props.token} 
                //     onSelectGenre={this.handleGenre}
                //     />
                <HeaderHome show={this.state.showHeader}  /> 
                // <HomeHeader navigation={this.props.navigation} />
                } */}
        <View style={styles.rightContainer}>
          <HeaderWithTittle name={'Series'} navigation={this.props.navigation} />

          {isNotify && <Alerts show={isNotify} type={type} title={title} subtitle={subtitle} navigation={this.props.navigation} action={action} onRef={ref => (this.parentReference = ref)} parentReference={this.updateNotify.bind(this)} />}
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
                {activeGenre == '' && <Viewport.Tracker><FlatList data={sortedObj} style={{height: '100%'}} renderItem={this.renderItem} /></Viewport.Tracker>}
                {activeGenre != '' && <FlatList data={formatData(data, numColumns)} style={{marginBottom: 20, flex: 1}} renderItem={this.renderGenreSpecificItems} numColumns={numColumns} />}
              </View>
            </Animatable.View>
          )}
          {/* <Animatable.View  animation={'slideInUp'}  style={styles.footerContainer}>
                        <BottomLine />
                    </Animatable.View> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(Series);
