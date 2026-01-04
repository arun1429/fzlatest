import React, { Component } from 'react'
import { View, Image, SafeAreaView, TouchableOpacity, FlatList, Text } from 'react-native'
import FastImage from 'react-native-fast-image'
import * as Animatable from 'react-native-animatable';
import {Icon } from 'native-base';
import Orientation from 'react-native-orientation';

import HttpRequest from '../../utils/HTTPRequest';

import { connect } from 'react-redux';
import { loginToken, allSeries } from '../../Redux/Actions/Actions';
import { bindActionCreators } from 'redux';
//components
import SideMenu from '../../components/SideMenu';
import BottomLine from '../../components/BottomHorizontalLine/'
import Alerts from '../../components/Alerts/'
//style
import styles from './styles';
import COLORS from "../../constants/colors";
import HeaderWithTittle from '../../components/Header/HeaderWithText';

  
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

class TrendingNow extends Component {
    constructor(props){
        super(props)
        this.state = {
            isDataFetched: false,
            value: '',
            isNotify: false,
            title: '',
            subtitle: '',
            type: '',
            action: false,
            data: []
        }
    }
    componentDidMount () {
        Orientation.lockToPortrait();
        this.getTrendingNow();
    }

    getTrendingNow = () => {
        this.setState({ isDataFetched: false, data:[]  });
        // if(this.props.token !== ''){
            HttpRequest.getTrendingNow(this.props.token)
            .then((res) => {
                const result = res.data;
                if (res.status == 200 && result.error == false) {
                    const myData = result.data.filter(res=>res.image !== null)
                    this.setState({ isDataFetched: true,data: myData });
                } else {
                    this.setState({ isDataFetched: false, data:[] })
                    console.log("All Trending Now API Error : ",result);
                    if(result.message == undefined ){
                        this.notify('danger','Oops!',result.status, false);
                    }
                    // this.notify('danger','Oops!',result.message != undefined ? result.message : result.status,result.message != undefined ? false : true);
                }
            })
            .catch(err => {
                this.setState({ isDataFetched: false, data:[]  })
                console.log("All Trending Now API Catch Exception: ",err);
                this.notify('danger','Oops!','Something Went Worng!',false);
            })
        // } else {
        //     this.setState({ isDataFetched: false, data:[]  })
        //     console.log("All Trending Now Error: Token not found");
        //     this.notify('danger','Oops!','We are unable to process your request at the moment! Please try again later.',false);
        // }  
    }

    renderItem = ({ item, index }) => {
        if (item.empty === true) {
          return <View style={[styles.item, styles.itemInvisible]} />;
        }
        return (
            <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.push("Details",{ itemId: item.id, type: item.type, refresh: 1  })}>
                <FastImage
                    style={styles.thumbnailImage}
                    source={{ uri: item.image}}
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
    //Notification Alerts CLose
    updateNotify() {
        this.setState({
          isNotify: false
        });
    }

    render() {
        const { isDataFetched, isNotify , title, subtitle, type, action } = this.state;
        return(
            <View style={styles.container}>
            {/* <Animatable.View animation={'slideInLeft'} style={styles.leftContainer}>
                <SideMenu navigation={this.props.navigation} active={'Home'} />
            </Animatable.View> */}
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
                {/* <View animation={'slideInRight'} style={styles.toolbarContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Icon type= "AntDesign" name='close'style={{fontSize: 35, color: COLORS.primary, alignSelf:'flex-end'}}  />
                    </TouchableOpacity>
                </View> */}
                <HeaderWithTittle name={"TRENDING NOW"} navigation={this.props.navigation} />
                <View animation={'slideInRight'} style={styles.resultContainer}>
                    {  !isDataFetched &&
                    <View style={styles.noResultContainer}>
                        <FastImage
                            style={styles.notFoundImage}
                            source={require('../../../assets/img/search/no_search_found_old.png')}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </View>  
                    }
                    { isDataFetched &&
                    <View style={styles.foundResultContainer}>
                    {/* <Text style={styles.thumbnailHeader} > TRENDING NOW</Text>  */}

                    <FlatList
                        data={formatData(this.state.data, numColumns)}
                        style={{ height:'100%'}}
                        renderItem={this.renderItem}
                        numColumns={numColumns}
                    />
                    </View>   
                    } 
                </View>
                </View>
                {/* <View  animation={'slideInUp'}  style={styles.footerContainer}>
                    <BottomLine />
                </View> */}
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
  
  export default connect(mapStateToProps,mapDispatchToProps)(TrendingNow);