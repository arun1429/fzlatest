import React, {Component} from 'react';
import { WebView } from 'react-native-webview';
import { View, SafeAreaView, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import * as Animatable from 'react-native-animatable';
import { Icon,} from 'native-base';
import Orientation from 'react-native-orientation';
//components
import BottomLine from '../../../../components/BottomHorizontalLine/';
//Style
import styles from './styles'

export default class IntroPrivacy extends Component {
    constructor(props) {
        super(props);
    } 
    componentDidMount () {
        Orientation.lockToPortrait();
    }
    render() {
    return (
        <View style={styles.container}>
        <SafeAreaView style={styles.rightContainer}>
            <View style={styles.marginContainer}>
            <Animatable.View animation={'slideInRight'} style={styles.resultContainer}>
                    <View style={[styles.row,{justifyContent: 'space-between'}]}>
                        <Text style={styles.thumbnailHeader} > Privacy </Text> 
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Intro")} >
                            <Icon type= "AntDesign" name='close'style={{fontSize: 35, color: 'red', alignSelf:'flex-end'}}  />
                            </TouchableOpacity>
                    </View>    
                    
                    <WebView 
                        source={{uri: 'https://fz.freizeitmedia.com/privacy-policy'}} 
                        style={{flex:1,backgroundColor:'#191a1f'}} 
                        startInLoadingState={true}
                        renderLoading={() => <View style={styles.loaderContainer}><ActivityIndicator size='large' color='#ff0000' /></View>}     
                    />
            </Animatable.View>
            </View>
            <Animatable.View  animation={'slideInUp'} style={styles.footerContainer}>
                <BottomLine />
            </Animatable.View>
        </SafeAreaView>
    </View>
    );
  }
}