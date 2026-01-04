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
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation';
import NetInfo from "@react-native-community/netinfo";
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
import { StyleSheet } from 'react-native';
import HeaderWithTittle from '../../components/Header/HeaderWithText';
import colors from '../../constants/colors';
import { color } from 'react-native-reanimated';
//style

class Plans extends Component {
    constructor(props) {
        super(props)
        this.state = {
            result: false,
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

    }
    componentDidMount() {
        Orientation.lockToPortrait();
        // this.checkNetworkConnectivity()
        this.getPlansResults();
    }

    checkNetworkConnectivity = () => {

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
                            {
                                text: 'Cancel', onPress: () => {
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
                    this.getPlansResults();
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
                        {
                            text: 'Cancel', onPress: () => {
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
                this.getPlansResults();
            }
        });

        // Unsubscribe
        unsubscribe();
    };

    getPlansResults = () => {

        this.setState({ result: false, isLoading: true, status: '' });
        HttpRequest.getPlans(this.props.token)
            .then((res) => {
                const result = res.data;
                console.log("Plans API data : ", result);
                if (res.status == 200 && result.error == false) {
                    this.setState({ result: true, isLoading: false, value: this.state.value, data: result.data, status: '200' })
                } else {
                    this.setState({ result: false, isLoading: false, value: this.state.value, data: [], status: '404' })
                    console.log("Plans API Error : ", result);
                    // this.notify('info','Oops!',result.message != undefined ? result.message : result.status,result.message != undefined ? false : true);
                }
            })
            .catch(err => {
                this.setState({ result: false, isLoading: false, data: [], status: '404' })
                console.log("Plans API Catch Exception: ", err);
                this.notify('danger', 'Oops!', 'Something Went Worng!', false);
            })
    }


    renderItem = ({ item, index }) => {
        return (

            <TouchableOpacity style={styles.card} onPress={() => this.props.navigation.push("Details", { itemId: item.id, type: item.type, isFavourite: true, refresh: 1 })}>
                <LinearGradient colors={[colors.backgroudColor, 'rgba(52,52,54,1) 20%', colors.brandPrimary]} style={{ padding: 10, width: "95%", alignSelf: 'center', borderRadius: 5 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: colors.white, padding: 10 }}>
                            {item.liveSpecials}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: colors.white, padding: 10, fontSize: 20, paddingRight: 10 }}>
                                {item.pricesl}
                            </Text>
                            <Text style={{ color: colors.white, fontSize: 12 }}>
                                {item.validity}
                            </Text>
                        </View>
                    </View>
                    <Text style={{ color: colors.white, padding: 10 }}>
                        {item.watches}
                    </Text>
                    <Text style={{ color: colors.white, padding: 10 }}>
                        {item.adsfree}
                    </Text>

                    <Text style={{ color: colors.white, padding: 10 }}>
                        {item.maxvideocond}
                    </Text>
                    <Text style={{ color: colors.white, padding: 10 }}>
                        {item.maxaudiocond}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    };



    render() {
        const { result, isLoading, data } = this.state;
        return (
                <SafeAreaView style={styles.container} >

                    <HeaderWithTittle name={"Chose your plans"} navigation={this.props.navigation} />

                    <FlatList
                        style={{ marginTop: 10,marginBottom:5 }}
                        data={this.state.data}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={(item, index) => this.renderItem(item, index)}
                        ItemSeparatorComponent={() => <View style={{ height: 10, width: '100%' }}></View>}
                    />
                   
                </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    card: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.26,
        elevation: 8,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10
      }
})

const mapStateToProps = state => {

    return {
        token: state.token
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        loginToken: bindActionCreators(loginToken, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Plans);