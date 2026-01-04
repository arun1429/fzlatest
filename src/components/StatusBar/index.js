import React from 'react'
import { StatusBar as CustomStatusBar } from 'react-native'
import colors from '../../constants/colors';

const StatusBar = (props) => {
    return (
        <CustomStatusBar  {...props} backgroundColor={colors.backgroudColor} />
    );
}

export default StatusBar;
