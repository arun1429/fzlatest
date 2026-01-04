import { StyleSheet, Dimensions, Platform } from "react-native";
import COLORS from "../../constants/colors";

// Retrieve initial screen's width
let screenWidth = Dimensions.get('window').width;

// Retrieve initial screen's height
let screenHeight = Dimensions.get('window').height;

let FONT_BACK_LABEL   = 35;

export default styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: COLORS.backgroudColor,
    },
    imageBackground: {
      flex:1,
      width: '100%',
      height: '100%',
      resizeMode:'cover',
    },
    mainContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapImage: {
      height:'30%',
      resizeMode: 'contain',
      marginBottom: '5%',
      alignSelf:'center'
    },
    introText1: {
      fontSize: 22,
      color: COLORS.white,
      textAlign: 'center',
      fontWeight:'bold',
      fontStyle:'italic'
    },
    logoImage1: {
      width: '60%',
      height:'20%',
      resizeMode: 'contain',
    },
    introTextImage: {
      height:'5%',
      resizeMode: 'contain',
    },
    image: {
      width: screenWidth/2,
      height: screenHeight/7,
      resizeMode:'contain'
    },
    imageMedium: {
      width: screenWidth,
      height: screenHeight/3.5,
      resizeMode:'contain',
    },
    imageAnimation: {
      width: screenWidth,
      height: screenHeight/2.5,
      resizeMode:'contain',
    },
    text: {
      fontSize: 20,
      color: COLORS.white,
      textAlign: 'center',
    },
    textMargin: {
      margin: 20
    },
    MainTitle:{
      fontSize: 35,
      color: COLORS.white,
      textAlign: 'center',
    },
    title: {
      fontSize: 30,
      color: COLORS.white,
      textAlign: 'center',
    },
    signinButton:{
      height: '5%',
      backgroundColor: COLORS.primary,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 20
    },
    skipButton:{
      padding:7,
      backgroundColor:COLORS.transParent,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      position:'absolute',
      right:20,
      top:100,
      borderWidth:1,
      borderColor:COLORS.white,
      paddingHorizontal:10
    },
    signinText:{
      color: COLORS.white,
      fontWeight:'bold'
    },
    inactiveDots:{
      backgroundColor: COLORS.white
    },
    activeDots:{
      backgroundColor: COLORS.primary
    },
    
});