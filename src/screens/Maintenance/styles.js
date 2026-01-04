import { StyleSheet, Platform, Dimensions } from "react-native";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import COLORS from "../../constants/colors";

export default (styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff',
        flexDirection:'column'
    },
    headerImage: {
      width:'100%',
      height: '50%',
      resizeMode: 'contain'
    },
    text: {
      fontSize: 18, 
      fontWeight:'bold', 
      color: '#000', 
      textAlign:'center'
    },
   
}));