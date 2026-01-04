import React, {Component} from 'react';
import { WebView } from 'react-native-webview';
import { 
    View, 
    SafeAreaView, 
    TouchableOpacity, 
    ActivityIndicator,
    Alert, 
    Platform,
    Button, 
    Text
} from 'react-native'
import * as Animatable from 'react-native-animatable';
import {Icon } from 'native-base';
import Orientation from 'react-native-orientation';
import NetInfo from "@react-native-community/netinfo";
//components
import SideMenu from '../../components/SideMenu';
import BottomLine from '../../components/BottomHorizontalLine/';
//Style
import styles from './styles'

export default class TermsCondition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: false
        }
    } 
    componentDidMount () {
        Orientation.lockToPortrait();
         //Check internet connectivity
         this.checkNetworkConnectivity()
    }

    checkNetworkConnectivity = () => {
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
            }
        });
        
        // Unsubscribe
        unsubscribe();
    };
    
    render() {
    let { isConnected } = this.state;

    return (
        <View style={styles.container}>
        {/* { this.props.route?.params?.auth &&
        <Animatable.View animation={'slideInLeft'} style={styles.leftContainer}>
            <SideMenu navigation={this.props.navigation} active={'privacy'} />
        </Animatable.View>
        } */}
        <SafeAreaView style={styles.rightContainer}>
            <View style={styles.marginContainer}>
            <Animatable.View animation={'slideInRight'} style={styles.resultContainer}>
                { !isConnected && 
                    <View style={[{flexGrow:1,flexDirection:'column'},styles.noResultContainer]}>
                        <Text style={{fontSize:16, fontWeight: '600', color:'#fff', textAlign:'center',margin: '5%'}} >There is a problem connecting to Freizeit. Please Try again later.</Text>
                        <Button title="Retry" color="#191a1f" onPress={() =>  this.checkNetworkConnectivity()} />
                    </View> 
                }
                { isConnected &&
                    <View style={[styles.row,{justifyContent: 'space-between'}]}>
                        <Text style={styles.thumbnailHeader} > Terms & Conditions</Text> 
                        { this.props.route?.params?.auth &&
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                            <Icon type= "AntDesign" name='close'style={{fontSize: 35, color: 'red', alignSelf:'flex-end'}}  />
                        </TouchableOpacity>
                        }
                        { !this.props.route?.params?.auth &&
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Intro")} >
                                <Icon type= "AntDesign" name='close'style={{fontSize: 35, color: 'red', alignSelf:'flex-end'}}  />
                            </TouchableOpacity>
                        }
                    </View>    
                }
                { isConnected &&     
                    <WebView 
                        source={{uri: 'https://fz.freizeitmedia.com/terms-and-conditions'}} 
                        style={{flex:1,backgroundColor:'#191a1f'}} 
                        startInLoadingState={true}
                        renderLoading={() => <View style={styles.loaderContainer}><ActivityIndicator size='large' color='#ff0000' /></View>}     
                    />
                }
            </Animatable.View>
            </View>
            {/* <Animatable.View  animation={'slideInUp'} style={styles.footerContainer}>
                <BottomLine />
            </Animatable.View> */}
        </SafeAreaView>
    </View>
    );
  }
}