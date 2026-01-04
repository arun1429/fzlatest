import React, { Component } from 'react'
import { View, StyleSheet, Linking, Platform } from "react-native";
import {
  SCLAlert,
  SCLAlertButton
} from 'react-native-scl-alert'

export default class Alerts extends Component {
    constructor(props){
        super(props)
        this.state = {
          show: false
        }
    }

    componentWillMount = () => {
        if(this.props.show){
            this.setState({ show: true })
        } else {
            this.setState({ show: false })
        }
    }

    handleClose = () => {
        this.props.parentReference();
        this.setState({ show: false })
        if (this.props.navigation !== undefined && this.props.action !== undefined) {
            if(this.props.action == true){
                this.props.navigation.goBack();
            } else if(this.props.action != false && this.props.action != "UPDATE") {
                this.props.navigation.navigate(this.props.action);
            } else if(this.props.action == "UPDATE") {
                //Platform.OS === "android"
                Linking.openURL(Platform.OS === "android" ? 'https://play.google.com/store/apps/details?id=com.freizeitMedia' : 'https://apps.apple.com/in/app/freizeit-media/id1529561669');
            } else { /*Do Nothing jus close*/ }
        } else {
            if(Platform.OS == "android"){
                Linking.openSettings();
            } else {
                Linking.openURL('app-settings://');
            }
            
        }
    }

    render() {
        const { type, title, subtitle } = this.props;
        return (
            <View style={styles.container}>
                <SCLAlert
                theme={type}
                show={this.state.show}
                title={title}
                subtitle={subtitle}
                cancellable={false}
                overlayStyle={{backgroundColor: '#141415ad'}}
                >
                    <SCLAlertButton theme={type} onPress={this.handleClose}>Ok</SCLAlertButton>
                </SCLAlert>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 2,
        
        // marginLeft:'10%',
        // flexDirection:'row',
        // justifyContent: 'space-evenly',
        // alignItems:'center',
    }
  });
  
