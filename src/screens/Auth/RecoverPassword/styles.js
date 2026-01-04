import { StyleSheet, Dimensions } from "react-native";
import COLORS from "../../../constants/colors";

// Retrieve initial screen's width
let screenWidth = Dimensions.get('window').width;

// Retrieve initial screen's height
let screenHeight = Dimensions.get('window').height;

export default styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.backgroudColor,
        flex: 1,
    }, 
    logo:{
        width: screenWidth - screenWidth/3,
        height:'10%',
        resizeMode:'contain',
        alignSelf:'center',
        margin: 10
    },
    infoIcon: {
        height: '60%',
        resizeMode: "contain"
    },
    content: {
        alignItems: 'center',
        justifyContent:'center'
    },
    cardStyle: {
        height: '70%',
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
    cardBody: {
        height: '70%',
        justifyContent:'space-around',
        alignItems: 'stretch',
        backgroundColor: "transparent" 
    },
    bg:{
        flex:1,
        width: '100%',
        height: '100%',
        resizeMode:'contain',
    },
    formItem: {
        flex:0.5,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        borderBottomWidth: 1
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
        alignSelf:'center',
        justifyContent:'center',
    },
    boldText: {
        color: COLORS.white,
        fontWeight:'bold',
    },
    cardFooter: {
        flex:1,
        height: '40%',
        justifyContent:'center',
        alignItems:'center',
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        backgroundColor: "transparent"
    },
    cardFooterText:{
        color: COLORS.white,
        fontWeight:'600',
        margin:5
    },
    inputText: {
        flex:1,
        height:'100%',
        fontSize: 16,
        padding: 2,
        marginLeft: '2%'
    },
    error: {
        fontSize: 12,
        padding: 2,
        color: COLORS.primary,
    },
    backButton: {
        width: 40, 
        height: 40,
        borderRadius: 20, 
        borderWidth:1, 
        backgroundColor:'#272a2f8f',
        justifyContent:'center', 
        alignItems:'center'
    }
});