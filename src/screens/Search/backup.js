import React, { Component } from 'react'
import { 
    View, 
    SafeAreaView, 
    TouchableOpacity, 
    Keyboard, 
    ScrollView, 
    FlatList, 
    TextInput,
    Text,
    ActivityIndicator,
    Alert, 
    Platform,
    Button 
} from 'react-native'
import { Item } from 'native-base';
import FastImage from 'react-native-fast-image'
import * as Animatable from 'react-native-animatable';
import { Icon } from 'native-base';
import LinearGradient  from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation';
import NetInfo from "@react-native-community/netinfo";
import { EventRegister } from 'react-native-event-listeners'

//API
import HttpRequest from '../../utils/HTTPRequest';
//Redux
import { connect } from 'react-redux';
import { loginToken } from '../../Redux/Actions/Actions';
import { bindActionCreators } from 'redux';
import _ from "lodash";
//components
import SideMenu from '../../components/SideMenu';
import BottomLine from '../../components/BottomHorizontalLine/'
import Alerts from '../../components/Alerts/'
//style
import styles from './styles';
import COLORS from "../../constants/colors";

const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
  
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
  
    return data;
};

const numColumns = 3;

class Search extends Component {
    constructor(props){
        super(props)
        this.state = {
            result : false,
            isLoading: false,
            value: '',
            data: [],
            isNotify: false,
            title: '',
            subtitle: '',
            type: '',
            action: false,
            status: '',
            isConnected: true
        }
        this.onChangeTextDelayed = _.debounce(this.checkNetworkConnectivity, 1000);
    }
    componentDidMount () {
        EventRegister.emit('videoPaused', {
            isClosed: "false"
        })
        Orientation.lockToPortrait();
    }

    checkNetworkConnectivity = () => {
        Keyboard.dismiss();
        this.setState({
            result: false
        })
        // For Android devices
        if (Platform.OS === "android") {
            NetInfo.fetch().then(state => {
                if (!state.isConnected) {
                    Alert.alert(
                        'Network Error',
                        `Failed to connect to Freizeit. Please check your device's network Connection.`,
                        [
                            { text: 'Cancel' , onPress: () => {
                                    this.setState({
                                        isConnected: false,
                                    })
                                }
                            },
                            {
                                text: 'Retry', onPress: () => {
                                    this.checkNetworkConnectivity();
                                }
                            }
                        ]
                    )
                } else {
                    this.setState({
                        isConnected: true,
                    })
                    //Get Search Results
                    this.getSearchResults();
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
            if (state.isConnected === false) {
                Alert.alert(
                    'Network Error',
                    `Failed to connect to Freizeit. Please check your device's network Connection.`,
                    [
                        { text: 'Cancel' , onPress: () => {
                            this.setState({
                                isConnected: false
                            })
                        }
                        },
                        {
                            text: 'Retry', onPress: () => {
                                this.checkNetworkConnectivity();
                            }
                        }
                    ]
                )
            } else {
                this.setState({
                    isConnected: true
                })
               //Get Search Results
               this.getSearchResults();
            }
        });
        
        // Unsubscribe
        unsubscribe();
    };

    getSearchResults = () => {
        if(this.state.value != ''){
            // if(this.props.token !== '' ){
                this.setState({ result: false, isLoading: true, status: ''});
                HttpRequest.getSearchResults(this.props.token, { query: this.state.value })
                .then((res) => {
                    const result = res.data;
                    if (res.status == 200 && result.error == false) {
                        this.setState({ result: true, isLoading: false, value: this.state.value, data: result.data, status: '200'})
                    } else {
                        this.setState({ result: false, isLoading: false , value: this.state.value, data: [], status: '404' })
                        console.log("Search API Error : ",result);
                        // this.notify('info','Oops!',result.message != undefined ? result.message : result.status,result.message != undefined ? false : true);
                    }
                })
                .catch(err => {
                    this.setState({ result: false, isLoading: false , data: [], status: '404' })
                    console.log("Search API Catch Exception: ",err);
                    this.notify('danger','Oops!','Something Went Worng!',false);
                })
            // } else {
            //     this.setState({ result: false, isLoading: false, data: [] , status: '404' })
            //     console.log("Search Error: Token not found");
            //     this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
            // }  
        }
    }

    onChangeText = (text) => {
        this.setState({
            result: false,
            value: text
        })
        if(text.length > 0) {
            this.onChangeTextDelayed()
        } else {
            this.setState({
                result: false,
                value: '',
                data: []
            })
        } 
    }

    remove(){
        if(this.state.result)
        {
            this.setState({
                result: false,
                value:'',
                data: [],
                status: ''
            })
        }
        else{
            this.props.navigation.goBack()
        }
    }

    renderItem = ({ item, index }) => {
        if (item.empty === true) {
          return <View style={[styles.item, styles.itemInvisible]} />;
        }
        return (
            <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.push("Details",{ itemId: item.id, type: item.type, isFavourite: true, refresh: 1 })}>
                <FastImage
                    style={styles.thumbnailImage}
                    source={{
                        uri: item.thumbnail
                    }}
                />
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
            action: action
        })
    }
    //Notification Alerts CLose
    updateNotify() {
        this.setState({
          isNotify: false
        });
    }

    render() {
        const { isConnected, isLoading, result, data, isNotify , title, subtitle, type, action, status } = this.state;
        return(
            <SafeAreaView style={styles.container}>
            {/* <View animation={'slideInLeft'} style={styles.leftContainer}>
                <SideMenu navigation={this.props.navigation} active={'search'} />
            </View> */}
            <LinearGradient colors={['rgba(0,0,0,1)', 'rgba(52,52,54,1) 20%', 'rgba(0,0,0,1)']} style={{flex:1}}>
            <SafeAreaView style={styles.rightContainer}>
            { isNotify &&
                <Alerts 
                    show={isNotify} 
                    type={type} 
                    title={title} 
                    subtitle={subtitle}
                    navigation={this.props.navigation} 
                    action={action} 
                    onRef={ref => (this.parentReference = ref)}
                    parentReference = {this.updateNotify.bind(this)}
                />
            }
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View animation={'slideInRight'} style={styles.mainContainer}>
                    <View style={styles.searchContainer}>
                    <Item style={styles.searchView}>
                    {/* onChangeText={(text) => this.change(text)} */}
                        <TextInput 
                            placeholder='Search..' 
                            ref={input => { this.Textinput = input }} 
                            style={styles.input} 
                            placeholderTextColor="grey" 
                            value={this.state.value} 
                            selectionColor='#fff'
                            onChangeText={this.onChangeText}
                        />
                        { isLoading &&
                            <ActivityIndicator size='small' color='#fff' style={{justifySelf:'center'}} /> 
                        }
                        { !isLoading &&
                            <Icon type= "AntDesign" name='search1'style={{fontSize: 23, color: COLORS.white}}  />
                        }
                    </Item>
                    </View>
                    <TouchableOpacity onPress={() => this.remove()} style={styles.removeView}>
                    <Icon type= "AntDesign" name='close'style={{fontSize: 35, color: COLORS.primary}}  />
                    </TouchableOpacity>
                </View>
                <View animation={'slideInRight'} style={styles.resultContainer}>
                    { !isConnected && 
                    <View style={[{flexGrow:1,flexDirection:'column'},styles.noResultContainer]}>
                        <Text style={{fontSize:16, fontWeight: '600', color:'#fff', textAlign:'center',margin: '5%'}} >There is a problem connecting to Freizeit. Please Try again later.</Text>
                        <Button title="Retry" color="#191a1f" onPress={() =>  this.checkNetworkConnectivity()} />
                    </View> 
                    }
                    { !result && !isLoading && status == '' && isConnected && 
                    <View style={styles.noResultContainer}>
                            <FastImage
                                    style={styles.notFoundImage}
                                    source={require('../../../assets/img/search/search1.png')}
                                    resizeMode={FastImage.resizeMode.contain}
                            />
                    </View>  
                    }
                    { !result && !isLoading && status == '404' && isConnected && 
                    <View style={styles.noResultContainer}>
                            <FastImage
                                    style={styles.notFoundImage}
                                    source={require('../../../assets/img/search/search1.png')}
                                    resizeMode={FastImage.resizeMode.contain}
                            />
                    </View>  
                    }
                    { result && !isLoading && isConnected && 
                    <View style={styles.foundResultContainer}>
                        <Text style={styles.thumbnailHeader} > Results</Text> 
                        <FlatList
                                data={formatData(data, numColumns)}
                                style={{ height:'100%'}}
                                renderItem={this.renderItem}
                                numColumns={numColumns}
                        />
                    </View>   
                    } 
                </View>
                </ScrollView>
                {/* <View  animation={'slideInUp'}  style={styles.footerContainer}>
                    <BottomLine />
                </View> */}
            </SafeAreaView>
            </LinearGradient>
        </SafeAreaView>
        )
    }
}

const mapStateToProps = state => {
    // console.log(`map state to props home `, state);
    return {
      token: state.token
    };
};
  
  
const mapDispatchToProps = (dispatch) => {
    return {
        loginToken: bindActionCreators(loginToken, dispatch),
    };
}
  
  export default connect(mapStateToProps,mapDispatchToProps)(Search);