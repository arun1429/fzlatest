
import { StyleSheet, Platform, Dimensions, StatusBar } from "react-native";
import colors from "../../constants/colors";
import COLORS from "../../constants/colors";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default (styles = StyleSheet.create({
    sliderContainer:{
        height:180,
        borderRadius: 10,
        overflow: 'hidden',
    },
    sliderBackground: {
        width: deviceWidth,
        height: deviceHeight/3,
        resizeMode:'contain',
        justifyContent:'flex-end', 
    },
    imageContainer: {
        width: deviceWidth-10, 
        height:180,
        alignSelf:'center',
    },
    image: {
        width: '100%', 
        height: '100%',
        overflow: 'hidden',
        borderRadius: 10,
    },
    nameStyle:{
        color:'white',
        bottom:50,
        fontSize:15,
        left:20,
        fontWeight:'bold',
        width:"65%" 
    },
    count :{
        position:'absolute',
        top:20,
        right:20,
        color:colors.white
    }
}));
