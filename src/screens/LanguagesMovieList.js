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
    Button,
    StyleSheet,
    ImageBackground
} from 'react-native'
import { Item } from 'native-base';
import FastImage from 'react-native-fast-image'
import * as Animatable from 'react-native-animatable';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation';
import NetInfo from "@react-native-community/netinfo";
import { EventRegister } from 'react-native-event-listeners'

//API
import { connect } from 'react-redux';
import { userInfo, loginToken } from '../Redux/Actions/Actions';
import { bindActionCreators } from 'redux';
//style
import colors from '../constants/colors';
import HeaderWithTittle from '../components/Header/HeaderWithText';
import HTTPRequest from '../utils/HTTPRequest';

const numColumns = 2;

const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
        data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
        numberOfElementsLastRow++;
    }

    return data;
};

const MyLanguages = [
    { id: 1, name: "Hindi", bgcolors: colors.brandPrimary },
    { id: 1, name: "English", bgcolors: colors.brandPrimary },
    { id: 1, name: "Tamil", bgcolors: colors.brandPrimary }

]

class MovieLanguages extends Component {
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
            isConnected: true,
            token: ''
        }
    }
    componentDidMount() {
        console.log("headerText",this.props.route?.params?.HeaderName)
        EventRegister.emit('videoPaused', {
            isClosed: "false"
        })

        Orientation.lockToPortrait();
        this.getMoviesLangugaes()
    }


    getMoviesLangugaes = () => {
        this.setState({ isLoading: true });
        HTTPRequest.getMoviesByLanguages(this.state.token,this.props.route?.params?.HeaderName)
            .then((res) => {
                const result = res.data;
                console.log("All Movies By Languages data  : ", JSON.stringify(result.data));
                if (res.status == 200 && result.error == false) {

                    this.setState({
                        data: result.data,
                        isLoading: false
                    })
                } else {
                    console.log("All  Movies By Languages API Error : ", result);
                    this.setState({
                        data: [],
                        isLoading: false
                    })
                }
            })
            .catch(err => {
                this.setState({ isLoading: false, data: [] })
                console.log("All  Movies By Languages API Catch Exception: ", err);
            })
    }


    callDetailsScreen = (item) => {
        if (item.isPaid == 2) {
            if (this.props.token != "") {
                console.log("Exclusive content")
                this.props.navigation.navigate('Exclusive', {  itemId: item.id, type: item.type, isFavourite: true, refresh: 1})
            } else {
                console.log("Details with exclusive content")

                this.props.navigation.navigate("Details", {  itemId: item.id, type: item.type, isFavourite: true, refresh: 1 })
            }
        } else {
            console.log("Details content")
            this.props.navigation.navigate("Details", {  itemId: item.id, type: item.type, isFavourite: true, refresh: 1 })
        }

    }

    renderItem = ({ item, index }) => {

        return (
            <TouchableOpacity
                key={item.language}
                onPress={() =>this.callDetailsScreen(item)}
                style={styles.renderLanguages} >
                <FastImage style={{ height: '100%', width: '100%', justifyContent: 'flex-end', alignItems: 'center', borderRadius: 5 }}
                    source={{ uri: item.image }}
                    imageStyle={{ borderRadius: 6}}
                    resizeMode={'cover'} >
                </FastImage>
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
        const { isLoading, data } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <HeaderWithTittle name={this.props.route?.params?.HeaderName} navigation={this.props.navigation} />

                {isLoading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                    <ActivityIndicator size='large' color='#fff' style={{ justifySelf: 'center' }} />
                </View>}

                {!isLoading && data.length == 0 &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20,color:colors.white }}>No movie found in this language!</Text>
                    </View>
                }

                {!isLoading && data != 0 &&
                    <FlatList
                        data={formatData(this.state.data, numColumns)}
                        style={{ height: '100%', }}
                        renderItem={this.renderItem}
                        numColumns={numColumns}
                    />
                }

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroudColor
    },
    renderLanguages: {
        height: 100,
        margin: 5,
        width: "47%",
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
})


const mapStateToProps = (state) => {
    return {
      info: state.info,
      token: state.token
    };
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
      userInfo: bindActionCreators(userInfo, dispatch),
      loginToken: bindActionCreators(loginToken, dispatch),
    };
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(MovieLanguages);

