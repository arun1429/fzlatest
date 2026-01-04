import React, { Component } from 'react'
import { 
    View, 
    SafeAreaView, 
    TouchableOpacity, 
    FlatList, 
    Text,
    ActivityIndicator,
    Alert, 
    Platform,
    Button 
} from 'react-native'
import FastImage from 'react-native-fast-image'
import * as Animatable from 'react-native-animatable';
import Orientation from 'react-native-orientation';
import NetInfo from "@react-native-community/netinfo";
//API
import HttpRequest from '../../utils/HTTPRequest';
//Redux
import { connect } from 'react-redux';
import { loginToken, allSeries } from '../../Redux/Actions/Actions';
import { bindActionCreators } from 'redux';
//components
import SideMenu from '../../components/SideMenu';
import BottomLine from '../../components/BottomHorizontalLine';
import Alerts from '../../components/Alerts';
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

class ComingSoon extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: false,
            isDataFetched: false,
            value: '',
            isNotify: false,
            title: '',
            subtitle: '',
            type: '',
            action: false,
            data: [],
            isConnected: false
        }
    }
    componentDidMount () {
        Orientation.lockToPortrait();
        this.checkNetworkConnectivity();
    }

    checkNetworkConnectivity = () => {
        this.setState({
            isLoading: true
        })
        // For Android devices
        if (Platform.OS === "android") {
            NetInfo.fetch().then(state => {
                if (!state.isConnected) {
                    this.setState({
                        isLoading: false
                    })
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
                        isConnected: true,
                        isLoading: false
                    })
                    //Get ComingSoon Results
                    this.getComingSoon();
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
                this.setState({
                    isLoading: false
                })
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
                    isConnected: true,
                    isLoading: false
                })
               //Get ComingSoon Results
               this.getComingSoon();
            }
        });
        
        // Unsubscribe
        unsubscribe();
    };

    getComingSoon = () => {
        this.setState({ isDataFetched: false, data:[] });
        if(this.props.token !== ''){
            HttpRequest.getComingSoon(this.props.token)
            .then((res) => {
                const result = res.data;
                if (res.status == 200 && result.error == false) {
                    this.setState({ isDataFetched: true, data: result.data })
                } else {
                    this.setState({ isDataFetched: false, data:[] });
                    // console.log("Coming Soon API Error : ",result);
                    if(result.message == undefined ){
                        this.notify('danger','Oops!',result.status, false);
                    }
                }
            })
            .catch(err => {
                this.setState({ isDataFetched: false, data:[] })
                console.log("Coming Soon API Catch Exception: ",err);
                this.notify('danger','Oops!','Something Went Worng!',false);
            })
        } else {
            this.setState({ isDataFetched: false, data:[] })
            console.log("Coming Soon Error: Token not found");
            this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
        }  
    }

    renderItem = ({ item, index }) => {
        if (item.empty === true) {
          return <View style={[styles.item, styles.itemInvisible]} />;
        }
        return (
            <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.push("ComingSoonDetails",{ itemId: item.id, type: item.type  })}>
                <FastImage
                    style={styles.thumbnailImage}
                    source={{ uri : item.thumbnail}}
                    resizeMode={FastImage.resizeMode.cover}
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
    //Notification Alerts Close
    updateNotify() {
        this.setState({
          isNotify: false
        });
    }

    render() {
        const { isLoading, isConnected, isDataFetched, isNotify , title, subtitle, type, action } = this.state;
        return(
            <View style={styles.container}>
            <Animatable.View animation={'slideInLeft'} style={styles.leftContainer}>
                <SideMenu navigation={this.props.navigation} active={'Home'} />
            </Animatable.View>
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
            <View style={styles.scrollViewContainer}>
                <Animatable.View animation={'slideInRight'} style={styles.toolbarContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon type= "AntDesign" name='close'style={{fontSize: 35, color: COLORS.primary, alignSelf:'flex-end',
        marginRight:10}}  />
                    </TouchableOpacity>
                </Animatable.View>
                <Animatable.View animation={'slideInRight'} style={styles.resultContainer}>
                    { !isConnected && 
                    <View style={[{flexGrow:1,flexDirection:'column'},styles.noResultContainer]}>
                        <Text style={{fontSize:16, fontWeight: '600', color:'#fff', textAlign:'center',margin: '5%'}} >There is a problem connecting to Freizeit. Please Try again later.</Text>
                        <Button title="Retry" color="#191a1f" onPress={() =>  this.checkNetworkConnectivity()} />
                    </View> 
                    }
                    {  !isDataFetched && isConnected && 
                    <View style={styles.noResultContainer}>
                        <FastImage
                            style={styles.notFoundImage}
                            source={require('../../../assets/img/search/no_search_found.png')}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </View>  
                    }
                    { isDataFetched && isConnected && 
                    <View style={styles.foundResultContainer}>
                    <Text style={styles.thumbnailHeader} > COMING SOON</Text> 
                        <FlatList
                            data={formatData(this.state.data, numColumns)}
                            style={{ height:'100%'}}
                            renderItem={this.renderItem}
                            numColumns={numColumns}
                        />
                    </View>   
                    } 
                </Animatable.View>
            </View>
            <Animatable.View  animation={'slideInUp'}  style={styles.footerContainer}>
                <BottomLine />
            </Animatable.View>
            </SafeAreaView>
        </View>
        )
    }
}

const mapStateToProps = state => {
    // console.log(`map state to props home `, state);
    return {
      token: state.token,
      series: state.series
    };
};
  
  
const mapDispatchToProps = (dispatch) => {
    return {
        loginToken: bindActionCreators(loginToken, dispatch),
        allSeries: bindActionCreators(allSeries, dispatch),
    };
}
  
  export default connect(mapStateToProps,mapDispatchToProps)(ComingSoon);