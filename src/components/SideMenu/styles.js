const React = require("react-native");
const { Platform, Dimensions } = React;

import Colors from "../../constants/colors";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

// 191a1f
export default {
    bgColor: {
        flex:1,
        backgroundColor: Colors.cardGrey,
        justifyContent:'space-between',
    },
    container: {
        flex:1,
        height: deviceHeight,
        flexDirection: 'column',
        backgroundColor: Colors.cardGrey,
     
    },
    header: {
        flex: 1,
        flexDirection: 'column',
        width: '100%'
    },
    logo: {
        width: null,
        height: deviceHeight/7,
        resizeMode:'contain'
    },
    content: {
        flex:1,
        flexDirection: 'column',
        justifyContent:'space-evenly',
        height: deviceHeight,
       
    },
    iconContainer: {
        width:'100%',
        height: 55,
        justifyContent:'center',
        alignItems: 'center',
        marginBottom: '10%',
    },
    toggleContainer: { 
        borderRightColor:'#e61e25',
        borderRightWidth:3,
    },
    icon: {
        flex: 1,
        opacity: 0.5,
        width: '50%',
        height: '50%',
        resizeMode:'contain'
    },
    activeIcon: {
        flex: 1,
        opacity: 1,
        width: '70%',
        height: '70%',
        resizeMode:'contain'
    }
};
