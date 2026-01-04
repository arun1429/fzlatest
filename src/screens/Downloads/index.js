import React, {Component} from 'react';
import {View, SafeAreaView, TouchableOpacity, FlatList, TouchableWithoutFeedback, TouchableHighlight, ImageBackground, ActivityIndicator, Dimensions, Image} from 'react-native';
import {Item, Text} from 'native-base';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import {Icon} from 'native-base';
import Orientation from 'react-native-orientation';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import RNFS from 'react-native-fs';
import CheckBox from '@react-native-community/checkbox';

//API
import HttpRequest from '../../utils/HTTPRequest';
import LocalData from '../../utils/LocalData';
//Redux
import {connect} from 'react-redux';
import {loginToken} from '../../Redux/Actions/Actions';
import {bindActionCreators} from 'redux';
import {removeHtmlTags} from '../../lib/';
import {EventRegister} from 'react-native-event-listeners';

//components
import SideMenu from '../../components/SideMenu';
import BottomLine from '../../components/BottomHorizontalLine/';
import Alerts from '../../components/Alerts';
import HomeHeader from '../../components/Header/HomeHeader';
//style
import styles from './styles';
import COLORS from '../../constants/colors';
import {onChange} from 'react-native-reanimated';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class Download extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: false,
      isLoading: false,
      isDeleting: false,
      id: '',
      data: [],
      isNotify: false,
      title: '',
      subtitle: '',
      type: '',
      action: false,
      deleteData: [],
      isDeleted: false,
      isClick: false,
      SeletedData: [],
      refresh: false,
    };
  }
  componentDidMount() {
    EventRegister.emit('videoPaused', {
      isClosed: 'false',
    });
    Orientation.lockToPortrait();
    this.getDownloads();
    this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
      this.getDownloads();
    });

    // this.checkDownloadServer()
  }

  //Get All Downloaded Data
  getDownloads = () => {
    //Reset
    // LocalData.setDownloads('');
    LocalData.getDownloads().then(info => {
      console.log('Get Downloaded Data Method:', JSON.parse(info));
      if (JSON.parse(info) != null && JSON.parse(info).length != 0) {
        console.log('Data found in Local Storage');
        this.setState({result: true, data: JSON.parse(info)});
      } else {
        console.log('Data Not found in Local Storage');
        // this.setState({ result: false, data: [] })
        this.checkDownloadServer();
      }
    });
  };

  checkDownloadServer = () => {
    console.log('token', this.props.token);
    this.setState({result: false, data: []});
    if (this.props.token !== '') {
      HttpRequest.getDownloads(this.props.token)
        .then(res => {
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            this.setState({result: true, data: result.data});
            console.log('Data', result.data[0].meta);
            //Store Donwloaded File Details in Local Storage
            //  const myData = result.data.map(item=>item.meta)
            //  this.setState({ result: true, data: myData })
            //  console.log("Data", myData)
            this.storeInLocalStorage(result.data[0].meta, result.data.path);
          } else {
            this.setState({result: false, data: []});
            console.log('All Downloads API Error : ', result);
            // if(result.message == undefined ){
            //     this.notify('danger','Oops!',result.status, false);
            // }
          }
        })
        .catch(err => {
          this.setState({result: false, data: []});
          console.log('All Downloads API Catch Exception: ', err);
          // this.notify('danger','Oops!','Something Went Worng!',false);
        });
    } else {
      this.setState({result: false, data: []});
      console.log('All Downloads Error: Token not found');
      // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
    }
  };

  //Store Details of downloaded File in Async Store( Local Data )
  storeInLocalStorage = (details, path) => {
    //Reset
    // LocalData.setDownloads('');
    //Fetch Local Storage Data
    LocalData.getDownloads()
      .then(info => {
        let store = [];
        let detail = [];
        store = JSON.parse(info) !== '' ? (JSON.parse(info) !== null ? JSON.parse(info) : []) : [];
        detail.push(details);
        // console.log("Details from Server",details);
        details['path'] = path;
        store.push(details);
        console.log('Store from Server', store);
        LocalData.setDownloads(store);
      })
      .catch(error => {
        // Error retrieving data
        console.log('There was an error processing your request to store download list in Local Storage. Please try again Later.', error);
      });
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
  // Go back to previous screen
  remove() {
    this.props.navigation.goBack();
  }
  //Delete Specific Donwload
  deleteDownloads = (id, type, path, item) => {
    // LocalData.setDownloads(JSON.parse("[]"));
    this.RBSheet.close();
    this.setState({isDeleting: true, id: id});
    let store = [];

    // if (this.props.token !== '') {
    HttpRequest.deleteDownloads(this.props.token, type == 1 ? {content_id: id, type: type} : {content_id: item.series_id, episode_id: id, type: type})
      .then(res => {
        this.setState({isDeleting: false, id: ''});
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          console.log('Deleted Download From Server ');
          this.removeLocalFile(path);
          //Fetch Local Storage Data
          LocalData.getDownloads()
            .then(info => {
              store = JSON.parse(info !== null ? info : '[]');
              store =
                store.length > 0
                  ? store.filter(function (e) {
                      return e.id !== id;
                    })
                  : [];
              LocalData.setDownloads(store);
              this.setState({isDeleting: false});
              this.getDownloads();
              //  this.checkDownloadServer()
            })
            .catch(error => {
              // Error retrieving data
              console.log('There was an error processing your request for download. Please try again Later.', error);
            });
        } else {
          console.log('Delete Downloads API Error : ', result);
          // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
        }
      })
      .catch(err => {
        this.setState({isDeleting: false});
        console.log('Delete Downloads API Catch Exception: ', err);
        // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
      });
    // } else {
    //     this.setState({ isDeleting: false })
    //     console.log("Delete Downloads Error: Token not found");
    //     // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
    // }
  };

  // Delete multiple file from download
  deleteMultiDownloads = (id, type, path, item) => {
    this.setState({isDeleting: true});
    //  LocalData.setDownloads(JSON.parse("[]"));
    let store = [];
    // if (this.props.token !== '') {
    HttpRequest.deleteDownloadsAll(this.props.token, this.state.SeletedData)
      .then(res => {
        this.setState({isDeleting: false});
        const result = res.data;
        if (res.status == 200 && result.error == false) {
          console.log('Deleted Multiple Download From Server ');
          // this.checkDownloadServer()
          this.setState({isDeleted: false});
          const localData = this.state.SeletedData;
          var storing = this.state.data;
          for (let i = 0; i < localData.length; i++) {
            this.removeLocalFile(localData[i].path);
            LocalData.getDownloads()
              .then(info => {
                // store = JSON.parse(info !== null ? info : "[]");
                // store = storing
                console.log('store data ', storing);
                console.log(' local  store id ', localData[i].content_id);
                storing =
                  storing.length > 0
                    ? storing.filter(function (e) {
                        return e.id !== localData[i].content_id;
                      })
                    : [];
                console.log('Deleted >>', storing);
                LocalData.setDownloads(storing);
                this.setState({isDeleting: false});
                this.getDownloads();
              })
              .catch(error => {
                // Error retrieving data
                console.log('There was an error processing your request for download. Please try again Later.', error);
              });
          }
          this.setState({
            SeletedData: [],
          });
        } else {
          console.log('Delete Multiple Downloads API Error : ', result);
          // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
        }
      })
      .catch(err => {
        this.setState({isDeleting: false});
        console.log('Delete Multiple Downloads API Catch Exception: ', err);
        // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
      });
    // } else {
    //     this.setState({ isDeleting: false })
    //     console.log("Delete Multiple Downloads Error: Token not found");
    //     // this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
    // }
  };
  //Delete file from Device Storage
  removeLocalFile = path => {
    RNFS.unlink(path)
      .then(() => {
        console.log('Download Deleted Successfully');
      })
      .catch(err => {
        console.log('Download Delete Failed due to error: ', err);
      });
  };

  calculateSizeFile = path => {
    RNFS.stat(path)
      .then(stats => {
        const fileSizeInMB = (stats.size / 1048576).toFixed(2);
        console.log('Size in MB:', fileSizeInMB);
      })
      .catch(err => {
        console.log('error', err);
      });
    return;
  };

  showDeleteOtion = (item, index) => {
    this.setState({isDeleted: true});
    this.onChangeClick(item, index);
  };

  onChangeClick = (item, index) => {
    console.log('Seleted item id ', item.id);
    const myData = [...this.state.data];
    const itemData = myData.find(data => data.id === item.id);
    itemData.isClick = !itemData.isClick;
    this.setState({data: myData});

    if (item.type == '1') {
      console.log('normal video');
      if (itemData.isClick) {
        const dataAdd = this.state.SeletedData;
        dataAdd.push({
          content_id: item.id,
          type: item.type,
          path: item.path,
        });
        this.setState({SeletedData: dataAdd});
        console.log('Seleted Data ', dataAdd);
      } else {
        const dataSub = this.state.SeletedData;
        let dataIndex = dataSub.findIndex(data => data.content_id === item.id);
        console.log('Index of  ', dataIndex);
        if (dataIndex > -1) {
          dataSub.splice(dataIndex, 1);
        }
        this.setState({
          SeletedData: dataSub,
        });
        dataSub.length === 0 ? this.setState({isDeleted: false}) : null;
        console.log('Seleted Data', dataSub);
      }
    } else {
      console.log('episode video');
      if (itemData.isClick) {
        const dataAdd = this.state.SeletedData;
        dataAdd.push({
          content_id: item.series_id,
          episode_id: item.id,
          path: item.path,
          type: item.type,
        });
        this.setState({SeletedData: dataAdd});
        console.log('Seleted Data ', dataAdd);
      } else {
        const dataSub = this.state.SeletedData;
        let dataIndex = dataSub.findIndex(data => data.content_id === item.series_id);
        console.log('Index of  ', dataIndex);
        if (dataIndex > -1) {
          dataSub.splice(dataIndex, 1);
        }
        this.setState({
          SeletedData: dataSub,
        });
        dataSub.length === 0 ? this.setState({isDeleted: false}) : null;
        console.log('Seleted Data ', dataSub);
      }
    }
  };

  renderItem = ({item, index}) => {
    // console.log("Item",item.meta)
    const {isDeleting, id, isDeleted} = this.state;
    // if (item.meta.id) {
    //     return (
    //         <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10, backgroundColor: '#1f191c', marginBottom: '2%' }}
    //         >
    //             <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
    //                 <TouchableOpacity onPress={() => this.props.navigation.navigate('Video', { videoPath: item.path, details: item.meta })}>
    //                     <ImageBackground style={{ flex: 3, width: deviceWidth / 3.5, height: deviceHeight / 6, resizeMode: 'contain', justifyContent: 'center', alignItems: 'center' }} source={{ uri: item.meta.thumbnail == null ? item.meta.image : item.meta.thumbnail }} >
    //                         <Icon type="FontAwesome" name="play-circle" style={{ fontSize: 40, color: '#fff' }} />
    //                     </ImageBackground>
    //                 </TouchableOpacity>
    //                 <View style={{ flex: 4, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: '2%', marginRight: '2%' }}>
    //                     <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', color: '#fff' }} numberOfLines={1}>{item.meta.name}</Text>
    //                     <Text style={{ flex: 1, fontSize: 10, fontWeight: '600', color: '#fff', opacity: 0.7 }} numberOfLines={4}>{removeHtmlTags(item.meta.description)}</Text>
    //                 </View>
    //                 <View style={{ flex: 1, flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
    //                     <TouchableOpacity style={{ flex: 1, margin: '10%', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.deleteDownloads(item.meta.id, item.type, item.path, item.meta)} >
    //                         <Icon type="FontAwesome" name="trash" style={{ fontSize: 25, color: '#fff' }} />
    //                     </TouchableOpacity>
    //                 </View>
    //             </View>
    //         </View>
    //     )
    // } else {
    return (
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 3, backgroundColor: isDeleted ? 'rgba(52, 52, 52, 0.8)' : '#1f191c', marginBottom: '.5%'}} key={item.id}>
        {isDeleted ? (
          <TouchableOpacity onPress={() => this.onChangeClick(item)} onLongPress={() => this.setState({isDeleted: !isDeleted})} style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)'}}>
            <CheckBox disabled={false} value={item.isClick} onValueChange={() => this.onChangeClick(item)} />
            <ImageBackground style={{flex: 3, width: deviceWidth / 2.6, height: deviceHeight / 8, resizeMode: 'contain', marginLeft: 10, marginVertical: 5}} source={{uri: item.type === '1' ? item.image : item.image.original}}></ImageBackground>
            <View style={{flex: 1, flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity style={{flex: 1, margin: '10%', justifyContent: 'center', alignItems: 'center'}} onPress={() => this.deleteCall(item)}>
                <Icon type="Entypo" name="dots-three-vertical" style={{fontSize: 18, color: '#fff'}} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onLongPress={() => this.showDeleteOtion(item, index)} style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Video', {videoPath: item.path, details: item})}>
              <ImageBackground style={{flex: 3, width: deviceWidth / 2.6, height: deviceHeight / 8, resizeMode: 'contain', marginLeft: 10, marginVertical: 5}} source={{uri: item.type === '1' ? item.image : item.image.original}}>
                {/* <Icon type="FontAwesome" name="play-circle" style={{ fontSize: 40, color: '#fff' }} /> */}
              </ImageBackground>
            </TouchableOpacity>
            <View style={{flex: 4, flexDirection: 'column', justifyContent: 'center', marginLeft: '5%'}}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}} numberOfLines={1}>
                {item.name}{' '}
              </Text>
              <Text style={{fontSize: 12, color: '#fff', marginTop: 5}} numberOfLines={1}>
                {item.runtime} min{' '}
              </Text>
              {/* <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }} numberOfLines={1}>{item.name} {this.calculateSizeFile(item.path)}</Text>
                            <Text style={{ fontSize: 12, color: '#fff', marginTop: 5 }} numberOfLines={1}>{item.runtime} min {this.calculateSizeFile(item.path)} </Text> */}
              {/* <Text style={{ flex: 1, fontSize: 10, fontWeight: '600', color: '#fff', opacity: 0.7 }} numberOfLines={4}>{removeHtmlTags(item.description)}</Text> */}
            </View>

            {/* <View style={{ flex: 1, flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
                            <TouchableOpacity style={{ flex: 1, margin: '10%', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.deleteDownloads(item.id, item.type, item.path, item)} >
                                <Icon type="FontAwesome" name="trash" style={{ fontSize: 25, color: '#fff' }} />
                            </TouchableOpacity>
                        </View> */}
            <View style={{flex: 1, flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1f191c'}}>
              <TouchableOpacity style={{flex: 1, margin: '10%', justifyContent: 'center', alignItems: 'center'}} onPress={() => this.deleteCall(item)}>
                <Icon type="Entypo" name="dots-three-vertical" style={{fontSize: 18, color: '#fff'}} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
    // }
  };

  deleteCall = item => {
    this.setState({deleteData: item});
    this.RBSheet.open();
  };

  render() {
    const {isLoading, result, isNotify, title, subtitle, type, action, data, deleteData} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {/* <View animation={'slideInLeft'} style={styles.leftContainer}>
                <SideMenu navigation={this.props.navigation} active={'download'} />
            </View> */}
        {/* <HomeHeader navigation={this.props.navigation} /> */}

        <View style={{height: 45, width: '100%', flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()} style={{justifyContent: 'center', alignItems: 'center', height: 50, width: 60}}>
            <Image style={{height: 14, width: 14}} source={require('../../../assets/icons/sideMenu/toggle_icon.png')} />
          </TouchableOpacity>
          <Image style={{height: 25, width: 25}} source={require('../../../assets/logo_sidebar.png')} />
          <Text style={{color: '#fff', paddingLeft: 15, fontSize: 20}}>Freizeit Media</Text>
          {/* <View style={{ backgroundColor: 'red', marginLeft: 15, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: "#fff", fontSize: 8, textTransform: 'uppercase', padding: 3 }}>Subscribe</Text>
                    </View> */}
          {this.state.isDeleted ? (
            <TouchableOpacity onPress={() => this.deleteMultiDownloads()} style={{position: 'absolute', right: 20}}>
              <Icon type="FontAwesome" name="trash" style={{fontSize: 20, color: '#fff'}} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Search')} style={{position: 'absolute', right: 20}}>
              <Image style={{height: 18, width: 18}} source={require('../../../assets/icons/sideMenu/search_icon.png')} />
            </TouchableOpacity>
          )}
        </View>
        <SafeAreaView style={styles.rightContainer}>
          {isNotify && <Alerts show={isNotify} type={type} title={title} subtitle={subtitle} navigation={this.props.navigation} action={action} onRef={ref => (this.parentReference = ref)} parentReference={this.updateNotify.bind(this)} />}
          {/* <LinearGradient colors={['rgba(0,0,0,1)', 'rgba(52,52,54,1) 20%', 'rgba(0,0,0,1)']} style={{flex:1}}> */}
          <View style={styles.scrollViewContainer}>
            {/* <View animation={'slideInRight'} style={styles.toolbarContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon  type= "AntDesign"  name="close" style={{fontSize: 35, color: COLORS.primary, alignSelf:'flex-end'}}   /> 
                    </TouchableOpacity>
                </View> */}
            <View animation={'slideInRight'} style={styles.resultContainer}>
              {!result && !isLoading && (
                <View style={styles.noResultContainer}>
                  <FastImage style={styles.notFoundImage} source={require('../../../assets/img/downloads/Download2.png')} resizeMode={FastImage.resizeMode.contain} />
                  <Text style={styles.headingText}>Never be without Freizeit</Text>
                  <Text style={styles.bodyText}> Download shows and movies so you'll never be without something to watch - even when you're offline</Text>
                  <TouchableOpacity style={styles.downloadButton} onPress={() => this.props.navigation.navigate('Home')}>
                    <Text style={styles.downloadText}>See What You Can Download</Text>
                  </TouchableOpacity>
                </View>
              )}
              {result && !isLoading && (
                <View style={styles.foundResultContainer}>
                  {/* <View style={[styles.row, { justifyContent: 'space-between' }]}>
                                        <Text style={styles.thumbnailHeader} > My Download</Text>
                                    </View> */}
                  <FlatList data={data} style={{height: '100%'}} renderItem={this.renderItem} />
                </View>
              )}
            </View>
          </View>
          {/* </LinearGradient> */}
          {/* <Animatable.View  animation={'slideInUp'} style={styles.footerContainer}>
                <BottomLine />
            </Animatable.View> */}
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
              <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 15}}>{deleteData.name} </Text>
              {/* <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 15 }}>{this.calculateSizeFile(deleteData.path)} </Text> */}

              <TouchableOpacity onPress={() => this.deleteDownloads(deleteData.id, deleteData.type, deleteData.path, deleteData)} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15}}>
                <Icon type="AntDesign" name="delete" style={{fontSize: 15, color: '#000000', marginRight: 5}} />
                <Text style={{fontSize: 14}}>Delete from Download</Text>
              </TouchableOpacity>
            </View>
          </RBSheet>
        </SafeAreaView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  // console.log(`map state to props home `, state);
  return {
    token: state.token,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginToken: bindActionCreators(loginToken, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Download);
