import {ActivityIndicator, Alert, AppState, Dimensions, FlatList, Modal, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {latestMovies, loginToken, userInfo} from '../../Redux/Actions/Actions';
import {EventRegister} from 'react-native-event-listeners';
import Orientation from 'react-native-orientation';
import NetInfo from '@react-native-community/netinfo';
import styles from './styles';
import moment from 'moment';
import HomeHeader from '../../components/Header/HomeHeader';
import {Button} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Alerts from '../../components/Alerts';
import {Icon} from 'native-base';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import {RadioButton} from 'react-native-paper';
import {Row, Rows, Table} from 'react-native-table-component';
import colors from '../../constants/colors';
import HTTPRequest from '../../utils/HTTPRequest';

export class ConnectDevices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['#', 'TvToken', 'Date'],
      deviceList: [],
      loading: false,
      isConnected: false,
      result: false,
      data: [],
      isNotify: false,
      dialogVisible: false,
      letToAdd: false,
      updateLastProfile: false,
      addNewProfile: false,
      enableRadioBtn: false,
      tokenValName: '',
      tokenVal: '',
      title: '',
      subtitle: '',
      errorText: '',
      type: '',
      checked: 'New',
      action: false,
      appState: AppState.currentState,
      wifi: this.props.wifi,
    };
  }

  checkUser = () => {
    this.setState({loading: true});
    // if (this.props.token !== '') {
    HTTPRequest.checkUser(this.props.token)
      .then(res => {
        this.setState({loading: false});
        const result = res.data;
        if (result.error == false) {
          if (result.status) {
            this.getTokenList();
          } else if (result?.data?.[0]?._id) {
            console.log('====================================');
            console.log({checkUser: result});
            console.log('====================================');
            this.props.navigation.replace('TvMovies', {itemId: result?.data?.[0]?._id});
          } else {
            this.props.navigation.goBack();
          }
        } else {
          // console.log('Recently Watched API Error : ', result);
          // if(result.message == undefined ){
          //     this.notify('danger','Oops!',result.status, false);
          // }
        }
      })
      .catch(err => {
        this.setState({loading: false});
        console.log('Recently Watched API Catch Exception: ', err);
        // this.notify('danger','Oops!','Something Went Worng!', false);
      });
  };
  getTokenList = () => {
    this.setState({loading: true});
    // if (this.props.token !== '') {
    HTTPRequest.getTvTokenList(this.props.token)
      .then(res => {
        this.setState({loading: false});
        const result = res.data;
        // console.log("Recently Watched API DATA : ", result.data);
        if (res.status == 200 && result.error == false) {
          // this.props.recentlyWatched(result.data);
          console.log('====================================');
          console.log({result: result?.details?.mytvTokes});
          console.log('====================================');
          this.setState({deviceList: result?.details?.mytvprofile?.reverse(), letToAdd: result?.details?.mytvTokes?.length <= 1 ? true : false, checked: result?.details?.mytvTokes?.length <= 1 ? 'New' : 'Update_Old', enableRadioBtn: result?.details?.mytvTokes?.length == 1 ? true : false});
        } else {
          console.log('getTokenList API Error : ', result);
          // if(result.message == undefined ){
          //     this.notify('danger','Oops!',result.status, false);
          // }
        }
      })
      .catch(err => {
        this.setState({loading: false, letToAdd: false});
        console.log('Recently Watched API Catch Exception: ', err);
        // this.notify('danger','Oops!','Something Went Worng!', false);
      });
  };

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
          this.checkUser();
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
        this.getTokenList();
      }
    });

    // Unsubscribe
    unsubscribe();
  };

  refresh = () => {
    //Check internet connectivity
    this.checkNetworkConnectivity();
  };

  addTokenApi = () => {
    if (this.state.tokenVal?.length !== 8) {
      this.setState({errorText: 'Please enter valid token'});
      // setTimeout(() => {

      // }, timeout);
    } else if (!this.state.tokenValName || this.state.tokenValName == '' || this.state.tokenValName?.length <= 2) {
      this.setState({errorText: 'Please enter valid name'});
    } else {
      // this.setState({});
      this.setState({loading: true, dialogVisible: false});
      HTTPRequest.addToTvToken(this.props.token, {mytv_token: this.state.tokenVal, name: this.state.tokenValName})
        .then(res => {
          this.setState({loading: false});
          const result = res.data;
          // console.log("Recently Watched API DATA : ", result.data);
          if (res.status == 200 && result.error == false) {
            // this.props.recentlyWatched(result.data);
            console.log('====================================');
            console.log({addToTvToken_result: result?.details?.mytvTokes});
            console.log('====================================');
            this.getTokenList();
          } else {
            console.log('addToken API Error : ', result);
            this.setState({errorText: result?.message?.toString(), dialogVisible: true});
            // this.setState({dialogVisible: false});
          }
        })
        .catch(err => {
          this.setState({loading: false});
          console.log('Recently addToTvToken API Catch Exception: ', err);
          // this.notify('danger','Oops!','Something Went Worng!', false);
        });
    }
  };
  updateTokenApi = () => {
    if (this.state.tokenVal?.length !== 8) {
      this.setState({errorText: 'Please enter valid token'});
      // setTimeout(() => {

      // }, timeout);
    } else if (!this.state.tokenValName || this.state.tokenValName == '' || this.state.tokenValName?.length <= 2) {
      this.setState({errorText: 'Please enter valid name'});
    } else {
      // this.setState({});
      this.setState({loading: true, dialogVisible: false});
      HTTPRequest.updateTvToken(this.props.token, {mytv_token: this.state.tokenVal, name: this.state.tokenValName, profile_id: this.state.deviceList?.[0]?.id || this.state.deviceList?.[0]?._id})
        .then(res => {
          this.setState({loading: false});
          const result = res.data;
          // console.log("Recently Watched API DATA : ", result.data);
          if (res.status == 200 && result.error == false) {
            // this.props.recentlyWatched(result.data);
            // console.log('====================================');
            // console.log({addToTvToken_result: result?.details?.mytvTokes});
            // console.log('====================================');
            this.getTokenList();
          } else {
            console.log('updateToken API Error : ', result);
            this.setState({errorText: result?.message?.toString(), dialogVisible: true});
            // this.setState({dialogVisible: false});
          }
        })
        .catch(err => {
          this.setState({loading: false});
          console.log('Recently addToTvToken API Catch Exception: ', err);
          // this.notify('danger','Oops!','Something Went Worng!', false);
        });
    }
  };
  deleteTokenApi = tokenVal => {
    this.setState({loading: true, dialogVisible: false});
    HTTPRequest.deleteTvToken(this.props.token, {profile_id: tokenVal})
      .then(res => {
        this.setState({loading: false});
        const result = res.data;
        // console.log("Recently Watched API DATA : ", result.data);
        if (res.status == 200 && result.error == false) {
          // this.props.recentlyWatched(result.data);
          // console.log('====================================');
          // console.log({addToTvToken_result: result?.details?.mytvTokes});
          // console.log('====================================');
          this.getTokenList();
        } else {
          console.log('deleteToken API Error : ', result);
          // this.setState({dialogVisible: false});
        }
      })
      .catch(err => {
        this.setState({loading: false});
        console.log('Recently deleteTvToken API Catch Exception: ', err);
        // this.notify('danger','Oops!','Something Went Worng!', false);
      });
  };

  componentDidMount() {
    EventRegister.emit('videoPaused', {
      isClosed: 'false',
    });
    Orientation.lockToPortrait();
    //Check internet connectivity
    this.checkNetworkConnectivity();
    this.listener = EventRegister.addEventListener('onDidFocus', data => {
      this.refresh();
    });
    // this.checkUser();
  }

  componentWillUnmount = () => {
    EventRegister.removeEventListener(this.listener);
  };

  handleRadioChange = value => {
    this.setState({checked: value});
  };

  render() {
    const {isConnected, isNotify, type, title, subtitle, action, checked, deviceList, enableRadioBtn} = this.state;
    console.log('====================================');
    console.log({info: this.props.info});
    console.log('====================================');
    return (
      <SafeAreaView style={styles.container}>
        <HomeHeader {...this.props} />
        {isNotify && <Alerts show={isNotify} type={type} title={title} subtitle={subtitle} navigation={this.props.navigation} action={action} onRef={ref => (this.parentReference = ref)} parentReference={this.updateNotify.bind(this)} />}
        {this.state.loading ? (
          <View style={{marginTop: '10%'}}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <SafeAreaView style={{flex: 1}}>
            <View style={styles.marginContainer}>
              <Animatable.View animation={'slideInRight'} delay={2} style={styles.resultContainer}>
                {!isConnected && (
                  <View style={[{flexGrow: 1, flexDirection: 'column'}, styles.noResultContainer]}>
                    <Text style={{fontSize: 16, fontWeight: '600', color: '#fff', textAlign: 'center', margin: '5%'}}>There is a problem connecting to Freizeit. Please Try again later.</Text>
                    <Button title="Retry" color="#191a1f" onPress={() => this.checkNetworkConnectivity()} />
                  </View>
                )}
                {isConnected && (
                  <View style={{flex: 1}}>
                    <Text style={styles.HeaderText}>My Token List</Text>
                    <View style={{flexDirection: 'row', backgroundColor: 'blue', justifyContent: 'space-between', marginHorizontal: 10}}>
                      <Text style={[styles.head, {width: 20}]}>#</Text>
                      <Text style={styles.head}>TvToken</Text>
                      <Text style={styles.head}>Date</Text>
                      <Text style={[styles.head]}>Delete</Text>
                    </View>
                    <FlatList
                      data={this.state.deviceList}
                      style={{flex: 1, marginTop: 10}}
                      renderItem={({item, index}) => {
                        console.log('====================================');
                        console.log({item});
                        console.log('====================================');
                        return (
                          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, alignItems: 'center', marginTop: index !== 0 ? 10 : 0, paddingBottom: index == this.state.deviceList?.length - 1 ? 0 : 10, borderBottomWidth: index == this.state.deviceList?.length - 1 ? 0 : 1, borderColor: colors.heading}} key={index}>
                            <Text style={[styles.tableData, {width: 20}]}>{index + 1}</Text>
                            <View style={styles.tableData}>
                              {/* {`${item?.name || ''}\n${item?.mytv_token}`} */}
                              <Text style={styles.tabletext}>{item?.name}</Text>
                              <Text style={styles.tabletext}>{item?.mytv_token}</Text>
                            </View>
                            <Text style={styles.tableData}>{moment(item?.added_at).format('YYYY-MM:DD')}</Text>
                            <TouchableOpacity
                              style={styles.tableData}
                              onPress={() => {
                                Alert.alert(item?.mytv_token, 'Are you sure you want to delete this token?', [
                                  {
                                    text: 'Yes',
                                    onPress: () => {
                                      this.deleteTokenApi(item?.id || item?._id);
                                    },
                                  },
                                  {text: 'No'},
                                ]);
                              }}>
                              <Icon type="MaterialCommunityIcons" name="delete" style={{fontSize: 22, color: '#fff'}} />
                            </TouchableOpacity>
                          </View>
                        );
                      }}
                    />
                    {this.state.letToAdd && (
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({dialogVisible: true});
                        }}
                        style={{width: deviceWidth * 0.16, aspectRatio: 1, backgroundColor: colors.primary, borderRadius: 30, position: 'absolute', bottom: deviceHeight * 0.069, right: deviceWidth * 0.069, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon type="Ionicons" name="add-outline" style={{fontSize: deviceWidth * 0.1, color: '#fff'}} />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </Animatable.View>
              <Modal
                animationType="slide"
                transparent
                visible={this.state.dialogVisible}
                presentationStyle="fullScreen"
                onRequestClose={() => {
                  this.setState({dialogVisible: false});
                }}
                onDismiss={() => {
                  this.setState({dialogVisible: false});
                }}>
                <View style={styles.viewWrapper}>
                  <View style={[styles.modalView, {height: !enableRadioBtn ? 290 : 390}]}>
                    <View style={{width: '95%', height: '100%', flexDirection: 'column'}}>
                      <View style={{width: '100%', flexDirection: 'row', marginTop: 20}}>
                        <View style={styles.viewType1}>
                          <Text style={styles.viewTypeText1}>Connect TV</Text>
                        </View>
                      </View>
                      <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{flexDirection: 'column', width: '95%', alignSelf: 'center'}}>
                          <View style={{marginTop: 30, height: 50, width: '100%', backgroundColor: '#fafafa', borderRadius: 5, borderWidth: 1, borderColor: '#e8e8e8', alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                            <TextInput
                              blurOnSubmit={true}
                              keyboardType="default"
                              value={this.state.tokenValName}
                              placeholder="Name"
                              placeholderTextColor="#000"
                              style={styles.textInput2}
                              onChangeText={value => {
                                this.state.errorText?.length >= 1 && this.setState({errorText: ''});
                                this.setState({tokenValName: value});
                              }}
                            />
                          </View>
                          <View style={{marginTop: 30, height: 50, width: '100%', backgroundColor: '#fafafa', borderRadius: 5, borderWidth: 1, borderColor: '#e8e8e8', alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                            <TextInput
                              multiline={true}
                              blurOnSubmit={true}
                              keyboardType="default"
                              value={this.state.tokenVal}
                              placeholder="TV Token"
                              placeholderTextColor="#000"
                              style={styles.textInput2}
                              onChangeText={value => {
                                this.state.errorText?.length >= 1 && this.setState({errorText: ''});
                                this.setState({tokenVal: value});
                              }}
                            />
                          </View>
                          <Text style={{alignSelf: 'center', color: colors.primary, fontSize: 15}}>{this.state.errorText || ''}</Text>
                          {enableRadioBtn && (
                            <RadioButton.Group onValueChange={this.handleRadioChange} value={this.state.checked}>
                              <View style={styles.updateRadio}>
                                <RadioButton value="Update_Old" />
                                <Text>Update Profile</Text>
                              </View>
                              <View style={styles.updateRadio}>
                                <RadioButton value="New" />
                                <Text>Create New Profile</Text>
                              </View>
                            </RadioButton.Group>
                          )}
                        </View>
                      </ScrollView>
                      <View style={{flexDirection: 'column', position: 'absolute', bottom: 10, width: '98%'}}>
                        <TouchableOpacity
                          style={{alignItems: 'center', justifyContent: 'center', marginLeft: 10, marginRight: 10, width: '95%', height: 50, paddingLeft: 15, paddingRight: 15, backgroundColor: colors.primary, borderRadius: 5}}
                          onPress={() => {
                            this.state.checked == 'Update_Old' ? this.updateTokenApi() : this.addTokenApi();
                          }}>
                          <Text style={{fontSize: 16, color: colors.white}}>Add Token</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </SafeAreaView>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  // console.log(`map state to props home `, state);
  return {
    info: state.info,
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

export default connect(mapStateToProps, mapDispatchToProps)(ConnectDevices);
