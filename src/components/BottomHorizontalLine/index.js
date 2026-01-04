import React from 'react'
import { View } from 'react-native'
import styles from './styles';

export default bottomHorizontalLine = (props) => {
    return (
        <View >
            <View style={styles.bottomTopBorder} />
            <View style={styles.bottomBorder} />
        </View>
    );
}