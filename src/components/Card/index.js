import React, { Component } from 'react';
import { View } from 'react-native';

import styles from './styles';

export default  Card = props => {
    return <View style={styles.containerStyle}>{props.children}</View>;
};