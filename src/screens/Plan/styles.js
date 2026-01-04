import { StyleSheet, Platform, Dimensions } from "react-native";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import COLORS from "../../constants/colors";

export default (styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#191a1f',
        flexDirection:'column'
    },
    header: {
      flex:1/2,
      backgroundColor:'red',
      justifyContent:'center',
      alignItems:'center'
    },
    headerImage: {
      width:'90%',
      height: '70%',
      resizeMode: 'contain',
      alignSelf:'center'
    },
    backButton: {
      position:'absolute', 
      alignSelf:'flex-end', 
      top:20,
      right:20
    },
    footer: {
      flex:1,
      flexDirection:'column', 
      backgroundColor:'#fff', 
      justifyContent:'center', 
      alignItems:'center'
    },
    pricingContainer: {
      flex:0.4, 
      flexDirection: 'row',  
      margin: 10
    },
    pricingBoxView: {
      width: '100%',
      height: '100%',
      borderColor:'#ccc',
      borderWidth: 0.5, 
      margin:'2%', 
      padding: '5%',
      position:'relative'
    },
    pricingBoxHeader: {
      flex: 0.3, 
      justifyContent:'center',
      alignItems: 'center',
      backgroundColor: '#ff0000',
    },
    pricingBoxFooter: {
      flex: 0.7, 
      justifyContent:'center', 
      alignItems:'center',
      flexDirection: 'row'
    },
    pricingFooterText: {
      fontSize: 20,
      margin: 2
    },
    descriptionContainer: {
      flex:0.6, 
      flexDirection:'column', 
      justifyContent:'center', 
      alignItems:'center', 
      margin: 10, 
      paddingBottom: 10
    },
    descriptionText: {
      fontSize: 16, 
      fontWeight:'600', 
      color: '#000', 
      textAlign:'center'
    },
    paySubscription:{
      width: deviceWidth - 20,
      height: Platform.OS === 'ios' ? deviceHeight/20 : deviceHeight/15,
      backgroundColor: COLORS.primary,
      borderRadius: deviceWidth/2,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf:'flex-end',
      margin: 20
    },
    payText:{
      color: COLORS.white,
      fontWeight:'bold'
    },
   
}));