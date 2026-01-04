import { StyleSheet, Platform, Dimensions } from "react-native";
import { color } from "react-native-reanimated";
import colors from "../../constants/colors";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default (styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: colors.backgroudColor,
        flexDirection:'column'
    },
    header:{
        backgroundColor:colors.backgroudColor,
        height: deviceHeight/4.5,
        justifyContent:'flex-start',
        alignItems:'flex-end',
        padding:'5%'
      },
      avatar: {
        width: deviceWidth/3.5,
        height: deviceWidth/3.5,
        borderRadius: (deviceWidth/3.5)/2,
        borderWidth: 4,
        borderColor: "#ff0000",
        marginBottom:10,
        alignSelf:'center',
        position: 'absolute',
        marginTop: deviceHeight/4.5 - (deviceWidth/3.5)/2,
      },
      name:{
        fontSize:22,
        color:"#FFFFFF",
        fontWeight:'600',
      },
      body:{
        flex: 0.3,
        justifyContent:'center',
        alignItems:'center',
        marginTop: (deviceWidth/3.5)/2
      },
      bodyContent: {
        flex: 0.5,
        justifyContent:'center',
        alignItems:'center',
      },
      name:{
        fontSize:25,
        color: "#fff",
        fontWeight: "600",
      },
      info:{
        fontSize:16,
        color: "#00BFFF",
        marginTop:10
      },
      description:{
        fontSize:12,
        color: "#fff",
        marginTop:10,
        textAlign: 'center'
      },
      footer: {
        flex:1,
        flexDirection:'column',
        padding: 20,
        justifyContent: 'space-between',
        alignItems: 'stretch',
        position:'relative',
        backgroundColor:'#fff',
        borderRadius: 20,
        margin: '2%' 
      },
      
      items: {
        flex:1,
        height: '100%',
        flexDirection:'column',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        borderColor: '#ff0000',
        borderBottomWidth: 1,
        marginBottom: 20
    },
    buttonContainer: {
        height: deviceHeight/8,
        margin: 10,
    },
    updateBtn: {
      backgroundColor:'#ff0000',
        width:deviceWidth,
        padding: 5,
        alignSelf:'center',
        justifyContent:'center',
        margin: deviceHeight/25
    }
}));