import { StyleSheet, Dimensions } from "react-native";
import COLORS from "../../../constants/colors";

// Retrieve initial screen's width
let screenWidth = Dimensions.get('window').width;

// Retrieve initial screen's height
let screenHeight = Dimensions.get('window').height;

export default styles = StyleSheet.create({
    container: {
        height:'100%',
        backgroundColor: COLORS.backgroudColor,
    }, 
    logo:{
        width: screenWidth - screenWidth/3,
        height:screenHeight/7,
        resizeMode:'contain',
        alignSelf:'center',
        margin: 20
    },
    headerLogo:{
        height: Platform.OS == 'ios' ? '60%' : '50%',
        resizeMode: "contain",
    },
    infoIcon: {
        height: '60%',
        resizeMode: "contain"
    },
    content: {
        alignItems: 'center',
        justifyContent:'center',
    },
    cardStyle: {
        height: '87%',
        borderRadius:20,
        backgroundColor: COLORS.cardGrey,
        borderColor: COLORS.cardGrey,
    },
    cardHeader: {
        height: '15%',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        backgroundColor: COLORS.primary
    },
    cardHeaderContent: {
        flex:1,
        justifyContent: 'center',
        alignItems:'center' 
    },
    cardTitle: {
        color: COLORS.white,
        fontWeight:'bold',
        fontSize: 25
    },
    buttonTitle: {
        color: COLORS.white,
        fontWeight:'bold',
        marginLeft : 20,
        fontSize: 18
    },
    buttonTitle2: {
        color: COLORS.black,
        fontWeight:'bold',
        marginLeft : 20,
        fontSize: 18
    },
    cardBody: {
        height: '100%',
        alignItems: 'center',
        backgroundColor: "transparent" 
    },
    bg:{
        flex:1,
        width: '100%',
        height: '100%',
        resizeMode:'contain',
    },
    formItem: {
        flex:1,
        flexDirection:'row',
        height : 60,
        justifyContent:'flex-start',
        alignItems:'center',
        borderBottomWidth: 1,
    },
    label: {
        flex:1,
        color: COLORS.white,
    },
    labelBold: {
        color: COLORS.primary,
        fontWeight:'bold'
    },
    loginBtn: {
        backgroundColor: COLORS.primary,
        width:screenWidth/3,
        alignSelf:'center',
        padding: '5%',
        justifyContent:'center',
        margin: screenHeight/20
    },
    boldText: {
        color: COLORS.white,
        fontWeight:'bold',
        textAlign:'center'
    },
    cardFooter: {
        justifyContent:'center',
        alignItems:'center',
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        backgroundColor: "transparent"
    },
    cardFooterText:{
        color: COLORS.white,
        fontWeight:'600',
        margin :10,
    
    },
    inputText: {
        flex:1,
        height:'100%',
        fontSize: 16,
        padding: 5,
        marginLeft: '2%'
    },
    error: {
        fontSize: 12,
        padding: 5,
        color: COLORS.primary,
    },
    forgotPassword:{
        marginTop: -screenHeight/20,
        padding: 10,
        alignSelf:'center'
    }


});
