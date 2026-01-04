import React from 'react'
import {  Image } from 'react-native'
import { hideNavigationBar } from 'react-native-navigation-bar-color';
import { Header, Left, Body, Right, Button } from 'native-base';
//Components
import StatusBar from '../StatusBar/'
import styles from './styles';

export default toolBar = ({navigation}) => {
  hideNavigationBar();
    return (
        <Header transparent >
         <StatusBar />
          <Left>
            <Image source={require('../../../assets/img/logo/toolbar_logo.png')} style={styles.logo}/>
          </Left>
          <Body></Body>
          <Right>
            <Button transparent onPress={() => navigation.navigate("IntroHelp")}>
              <Image source={require('../../../assets/icons/help.png')} style={styles.infoIcon}/>
            </Button>
            <Button transparent onPress={() => navigation.navigate("IntroPrivacy")}>
                <Image source={require('../../../assets/icons/privacy.png')} style={styles.infoIcon}/>
            </Button>
          </Right>
        </Header>
    );
} 
