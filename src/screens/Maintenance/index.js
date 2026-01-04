import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import FastImage from 'react-native-fast-image';

//style
import styles from './styles'
const maintenanceImage = require("../../../assets/maintenance.png");
const deviceWidth = Dimensions.get('window').width;


class Maintenance extends Component {
    constructor(props){
        super(props);
    }
   
    render() {
    return (
       <View style={styles.container}>
            <FastImage
                style={styles.headerImage}
                source={ maintenanceImage }
                resizeMode={FastImage.resizeMode.contain}
            />
           <Text style={styles.text}>Under Maintenance</Text>
           <Text style={styles.text}>We're doing our best to be back :)</Text>
       </View>
    );
    }
}
  
export default Maintenance
  
