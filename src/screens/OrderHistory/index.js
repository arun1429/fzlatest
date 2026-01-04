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
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation';
import NetInfo from "@react-native-community/netinfo";
//API
import HttpRequest from '../../utils/HTTPRequest';
//Redux
import { connect } from 'react-redux';
import { loginToken } from '../../Redux/Actions/Actions';
import { bindActionCreators } from 'redux';
//components
import { StyleSheet } from 'react-native';
import HeaderWithTittle from '../../components/Header/HeaderWithText';
import colors from '../../constants/colors';
import { EventRegister } from 'react-native-event-listeners'

//style

class Order extends Component {
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
        EventRegister.emit('videoPaused', {
            isClosed: "false"
        })
        Orientation.lockToPortrait();
        this.getOrderResults();
    }


    getOrderResults = () => {

        this.setState({ result: false, isLoading: true, status: '' });
        HttpRequest.getOrderHistory(this.props.token)
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

            <TouchableOpacity style={styles.item}>
                <LinearGradient colors={[colors.black, 'rgba(52,52,54,1) 20%', colors.brandPrimary]} style={{ padding: 10, width: "95%", alignSelf: 'center', borderRadius: 5 }}>
                    <View style={{ flexDirection: 'row',justifyContent:'space-between',alignItems:'center' }}>
                        <Text style={{ color: colors.white, padding: 10 }}>
                           Order ID 
                        </Text>
                        <Text style={{ color: colors.white, padding: 10 }}>
                          {item.order_id}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row',justifyContent:'space-between',alignItems:'center' }}>
                        <Text style={{ color: colors.white, padding: 10 }}>
                           Amount  
                        </Text>
                        <Text style={{ color: colors.white, padding: 10 }}>
                          {item.amount}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row',justifyContent:'space-between',alignItems:'center' }}>
                        <Text style={{ color: colors.white, padding: 10 }}>
                          Payment Status 
                        </Text>
                        <Text style={{ color: colors.white, padding: 10 }}>
                          {item.paymentstatus}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row',justifyContent:'space-between',alignItems:'center' }}>
                        <Text style={{ color: colors.white, padding: 10 }}>
                           Date / Time 
                        </Text>
                        <Text style={{ color: colors.white, padding: 10 }}>
                          {item.created_at}
                        </Text>
                    </View>
                   
                </LinearGradient>
            </TouchableOpacity>
        );
    };



    render() {
        const { result, isLoading, data } = this.state;
        return (
                <SafeAreaView style={styles.container} >

                    <HeaderWithTittle name={"My Order"} navigation={this.props.navigation} />
                    {isLoading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                    <ActivityIndicator size='large' color='#fff' style={{ justifySelf: 'center' }} />
                </View>}

                {!isLoading && data.length == 0 &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20,color:colors.white }}>No Order available!</Text>
                    </View>
                }
                   {!isLoading && data != 0 &&  <FlatList
                        style={{ marginTop: 10,marginBottom:5 }}
                        data={data}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={(item, index) => this.renderItem(item, index)}
                        ItemSeparatorComponent={() => <View style={{ height: 10, width: '100%' }}></View>}
                    />
                   }
                </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:colors.backgroudColor
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

export default connect(mapStateToProps, mapDispatchToProps)(Order);