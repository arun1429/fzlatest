import React, {Component} from 'react';
import {View, Alert, Text, TouchableOpacity, Share, PermissionsAndroid, Platform, ActivityIndicator, StyleSheet, TouchableWithoutFeedback, ImageBackground, Dimensions} from 'react-native';
import {Icon} from 'native-base';
import RNBackgroundDownloader from 'react-native-background-downloader';
import NetInfo from '@react-native-community/netinfo';
import ProgressCircle from 'react-native-progress-circle';
import {removeHtmlTags} from '../../../lib';
import FastImage from 'react-native-fast-image';
import RBSheet from 'react-native-raw-bottom-sheet';
//API
import HttpRequest from '../../../utils/HTTPRequest';
import LocalData from '../../../utils/LocalData';
//Redux
import {connect} from 'react-redux';
import {userInfo, loginToken, latestMovies} from '../../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';
import {EventRegister} from 'react-native-event-listeners';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class EpisodesTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDataFetched: false,
      isDownloading: false,
      progress: 0,
      video: '',
      wifi: 0,
      videoQuality: 2,
      isDownloaded: 0,
      isConnected: false,
    };
  }
  async componentDidMount() {
    console.log('item data', this.props.item);
    this.setState({
      isDownloaded: this.props.item.isDownloaded,
    });
    this.listener = EventRegister.addEventListener('onDidFocus', data => {
      this.refresh();
    });
  }

  componentWillUnmount = () => {
    EventRegister.removeEventListener(this.listener);
  };

  refresh = () => {
    this.setState({
      isDownloaded: this.props.item.isDownloaded,
    });
  };

  checkBackgroundDownloadPending = async () => {
    // console.log('Called To check pending downloads')
    let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
    for (this.task of lostTasks) {
      //if the task is pending for the respective id
      if (this.task.id == this.props.series_id) {
        let videoDest = `${RNBackgroundDownloader.directories.documents}/content/data/util/sync/.dir/${this.task.id}.mp4`;
        // console.log(`Task ${this.task.id} was found!`);
        this.task
          .progress(percent => {
            this.setState({
              isDownloading: true,
              progress: percent * 100,
            });
          })
          .done(() => {
            this.stopDownload();
            this.setState({
              progress: 100,
              isDownloading: false,
              isDownloaded: 1,
              video: videoDest,
            });
            this.downloadSpecificVideo(this.task.id, videoDest);
            //Store Donwloaded File Details in Local Storage
            this.storeInLocalStorage(videoDest);
          })
          .error(error => {
            console.log('Download canceled due to error: ', error);
            this.setState({
              progress: 0,
              isDownloading: false,
              isDownloaded: 0,
              video: videoDest,
            });
          });
      }
    }
  };

  downloadtButton = id => {
    console.log('id content', id);
    const {item} = this.props;
    if (item.isSubscribed == 0) {
      if (item.isPaid == 1) {
        this.props.navigation.navigate('Subscriptions');
      } else {
        this.freeDownload(id);
      }
    } else {
      this.freeDownload(id);
    }
  };

  freeDownload = id => {
    const {wifi} = this.props;
    //Check for setting before download begins if download allowed only over wifi or not
    if (wifi == 0) {
      //Proceed to check permission
      if (Platform.OS == 'android') {
        this.requestStoragePermission(id);
        this.backgroundDownloader(id);
      } else {
        //Download Process
        this.backgroundDownloader(id);
      }
    } else {
      //Check if wifi is enabled or not
      this.checkNetworkConnectivity(id);
    }
  };

  checkNetworkConnectivity = id => {
    NetInfo.fetch().then(state => {
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);
      if (state.isConnected) {
        if (state.type == 'wifi') {
          //Proceed to check permission
          if (Platform.OS == 'android') {
            this.requestStoragePermission(id);
            this.backgroundDownloader(id);
          } else {
            //Download Process
            this.backgroundDownloader(id);
          }
        } else {
          this.notify('info', 'Oops!', 'Turn off "Wifi Only" setting to download over mobile network.', 'Settings');
        }
      } else {
        this.notify('warning', 'Oops!', 'No Internet Connection.');
      }
    });
  };

  requestStoragePermission = async id => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
        title: 'Freizeit Storage Permission',
        message: 'Freizeit App needs access to your storage ' + 'so that you can download .',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the storage');
        //ALso check if WIFI or not
        // this.processDonwload(id);
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  backgroundDownloader = id => {
    let {item} = this.props;
    console.log('download data', item, id);
    this.setState({
      isDownloading: true,
      isDownloaded: 0,
      progress: 0,
    });
    let videoDest = `${RNBackgroundDownloader.directories.documents}/content/data/util/sync/.dir/${id}.mp4`;
    this.task = RNBackgroundDownloader.download({
      id: id,
      url: item.url,
      destination: videoDest,
    })
      .begin(expectedBytes => {
        // console.log(`Going to download ${expectedBytes} bytes!`);
      })
      .progress(percent => {
        // console.log(`Downloaded: ${percent * 100}%`);
        this.setState({
          progress: percent * 100,
        });
      })
      .done(() => {
        // console.log('Download is done!',this.task);
        // console.log('Downloaded file path:',`${RNBackgroundDownloader.directories.documents}/${id}.mp4`);
        this.task.stop();
        // Downloaded successfully
        this.setState({
          isDownloading: false,
          isDownloaded: 1,
          progress: 100,
          video: videoDest,
        });
        console.log('Download is done 3333!', id, videoDest);
        this.downloadSpecificVideo(id, videoDest);
        //Store Donwloaded File Details in Local Storage
        this.storeInLocalStorage(videoDest);
      })
      .error(error => {
        console.log('Download canceled due to error: ', error);
        this.setState({
          isDownloading: false,
          isDownloaded: 0,
          progress: 0,
          video: videoDest,
        });
      });
  };

  downloadSpecificVideo = (file_name, path) => {
    let {item, series_id, type} = this.props;
    console.log('download video item ', item, series_id, type);
    let store = [];
    this.setState({isDataFetched: false});
    const objSend = {content_id: series_id, episode_id: item.id, type: type, file_name: file_name, path: path};
    console.log('send download data ', objSend);
    // if (this.props.token !== '') {
    HttpRequest.downloadSpecificVideo(this.props.token, objSend)
      .then(res => {
        this.setState({isDataFetched: true});
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          console.log('Download Specific Video API Success : ', result.message);
        } else {
          console.log('Download Specific Video API Error : ', result);
          // this.notify('danger','Oops!',result.message != undefined ? result.message : result.status, false);
        }
      })
      .catch(err => {
        this.setState({isDataFetched: true});
        console.log('Download Specific VideoAPI Catch Exception: ', err);
        // this.notify('danger','Oops!','Something Went Worng!', false);
      });
    // } else {
    //     this.setState({ isDataFetched: true })
    //     console.log("Download Specific Video Error: Token not found");
    //     // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
    // }
  };

  //Store Details of downloaded File in Async Store( Local Data )
  storeInLocalStorage = path => {
    let {item} = this.props;
    //Reset
    // LocalData.setDownloads('');
    //Fetch Local Storage Data
    LocalData.getDownloads()
      .then(info => {
        let store = [];
        store = JSON.parse(info) !== '' ? (JSON.parse(info) !== null ? JSON.parse(info) : []) : [];
        item['path'] = path;
        item['series_id'] = this.props.series_id;
        store.push(item);
        LocalData.setDownloads(store);
      })
      .catch(error => {
        // Error retrieving data
        console.log('There was an error processing your request for download. Please try again Later.', error);
      });
  };

  cancelDownload = id => {
    // cancel the HTTP request
    Alert.alert('Cancel Download', 'Are you sure you want to cancel the download?', [
      {
        text: 'Yes',
        onPress: () => {
          this.stopDownload();
        },
      },
      {text: 'No'},
    ]);
  };

  stopDownload = () => {
    console.log('Stopped');
    this.task.stop();
    this.setState({
      isDownloading: false,
      isDownloaded: 0,
      progress: 0,
      video: '',
    });
  };

  convertMinsToTime = mins => {
    let hours = Math.floor(mins / 60);
    let minutes = mins % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours > 0 ? `${hours} hr ${minutes} min.` : `${minutes} min.`;
  };

  render() {
    const {item, series_id} = this.props;
    const {isDownloaded, isDownloading, progress, video} = this.state;
    return (
      <View style={{flex: 1}} key={item.id}>
        <View style={styles.thumbnailView} key={item.id}>
          <TouchableWithoutFeedback onPress={() => (item.url === null ? alert('Data not found') : this.props.playAd(item.url, item, series_id))}>
            <ImageBackground resizeMode={'stretch'} style={styles.thumbnailImage} source={{uri: item.image.original}}>
              <View style={{backgroundColor: 'transparent', bottom: 15, position: 'absolute', marginLeft: 15, alignItems: 'center', flexDirection: 'row'}}>
                <View>
                  <Icon type="FontAwesome5" name="play" style={{fontSize: 15, color: '#fff'}} />
                </View>
                <View style={{marginLeft: 10}}>
                  <Text
                    style={[
                      styles.text,
                      {
                        fontSize: 17,
                        color: '#fff',
                        fontWeight: '600',
                      },
                    ]}>
                    S{item.season} E{item.episode} . {item.airdate}
                  </Text>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={[
                      styles.text,
                      {
                        fontSize: 14,
                        color: '#F0F8FF',
                        width: '80%',
                      },
                    ]}>
                    {item.name}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.text,
                  {
                    position: 'absolute',
                    right: 15,
                    top: 10,
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: 14,
                  },
                ]}>
                {this.convertMinsToTime(item.runtime)}
              </Text>
            </ImageBackground>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.videoEpisode}>
          {/* <ImageBackground resizeMode={'cover'} style={styles.image} source={{ uri: item.image.original }}>
                    <View style={styles.buttonPlay}>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Video', { videoPath: item.link, details: item })}>
                            <View style={{backgroundColor: 'transparent'}}>
                                <Icon type= "FontAwesome5" name='play-circle'style={{fontSize: 30, color: '#fff'}} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ImageBackground> */}

          <View style={styles.episodeName}>
            <Text ellipsizeMode="tail" numberOfLines={3} style={[styles.text, styles.activeText, {width: 200}]}>
              {item.episode}. {item.summary}
            </Text>
            {!isDownloading && isDownloaded == 1 ? null : (
              <TouchableOpacity onPress={() => this.downloadtButton(item.id.toString())} style={{flexDirection: 'row', alignSelf: 'flex-start', marginTop: 10}}>
                <Icon type="FontAwesome" name="cloud-download" style={{fontSize: 15, color: '#fff', marginRight: 5}} />
                <Text style={[styles.text, styles.activeText]}>Download</Text>
              </TouchableOpacity>
            )}
            {!isDownloading && isDownloaded == 0 && (
              <TouchableOpacity onPress={() => this.downloadtButton(item.id.toString())} style={{margin: 10}}>
                <Icon type="FontAwesome" name="cloud-download" style={{fontSize: 20, color: '#fff', marginLeft: 5}} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.episodeName}>
            {!isDownloading && isDownloaded == 0 && (
              <TouchableOpacity onPress={() => this.downloadtButton(item.id.toString())} style={{margin: 10}}>
                <Icon type="FontAwesome" name="cloud-download" style={{fontSize: 20, color: '#fff', marginLeft: 5}} />
              </TouchableOpacity>
            )}
            {isDownloading && isDownloaded == 0 && (
              <View style={{margin: 10}}>
                {Math.round(progress) == 0 && <ActivityIndicator size="small" color="#ff0000" />}
                {Math.round(progress) > 0 && (
                  <TouchableOpacity onPress={() => this.cancelDownload(item.id)}>
                    <ProgressCircle percent={Math.round(progress)} radius={12} borderWidth={2} color="#ff0000" shadowColor="#bbb" bgColor="rgba(50,52,54,1)" />
                  </TouchableOpacity>
                )}
              </View>
            )}
            {!isDownloading && isDownloaded == 1 && (
              <View style={{margin: 10}}>
                <Icon type="FontAwesome" name="thumbs-up" style={{fontSize: 30, color: '#436EEE', marginLeft: 5}} />
              </View>
            )}
          </View>
        </View>
        <Text style={styles.summary} numberOfLines={2}>
          {removeHtmlTags(item.description)}
        </Text>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={180}
          style={{flex: 1}}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}>
          <View style={{flex: 1, alignSelf: 'flex-start', marginLeft: 15}}>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 15}}>Select Video Quality</Text>

            <TouchableOpacity onPress={() => this.downloadtButton(item.id.toString())}>
              <Text style={{fontSize: 14, marginTop: 15}}>SD {'212MB'}</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoEpisode: {
    flex: 1,
  },
  thumbnailView: {
    width: deviceWidth / 1.7,
    height: deviceWidth / 2.4,
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 8,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttonWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    textAlign: 'justify',
    fontSize: 20,
    fontWeight: '800',
    flexWrap: 'wrap',
    margin: '2%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'white',
  },
  seasonText: {
    color: '#999',
    fontSize: 20,
    padding: 15,
  },

  renderEpisodes: {
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 150,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  buttonPlay: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  episodeName: {
    // flex:1,
    justifyContent: 'center',
    marginTop: 10,
    width: '80%',
  },

  text: {
    fontSize: 12,
    color: '#9999',
    fontWeight: '600',
  },
  activeText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  summary: {
    fontSize: 14,
    fontWeight: '300',
    color: '#fff',
    marginVertical: 10,
  },
  item: {
    padding: 2,
    marginVertical: 5,
    marginHorizontal: 16,
  },
});

const mapStateToProps = state => {
  // console.log(`map state to props home `, state);
  return {
    token: state.token,
    movies: state.movies,
    latestmovies: state.latestmovies,
    wifi: state.wifi,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userInfo: bindActionCreators(userInfo, dispatch),
    loginToken: bindActionCreators(loginToken, dispatch),
    latestMovies: bindActionCreators(latestMovies, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EpisodesTab);
