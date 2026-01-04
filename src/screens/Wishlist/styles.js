import { StyleSheet, Platform, Dimensions } from "react-native";
import COLORS from "../../constants/colors";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default (styles = StyleSheet.create({
    container:{
        flex: 1,
        // flexDirection:'row',
        backgroundColor: COLORS.backgroudColor,
    },
    row: {
        flexDirection:'row'
    },
    // leftContainer: {
    //     width: '12%',
    // },
    rightContainer: {
        flex: 1,
        // marginTop:30
    },
    marginContainer: {
        flex:1,
        margin: '2%',
    },
    mainContainer: {
        flexDirection:'row',
        justifyContent:'space-between',
        height:'5%'
    },
    searchView: {
        borderColor: 'transparent',
        marginLeft:'2%', 
        marginRight:'5%'
    },
    input: {
        marginLeft:'2%',
        color:"grey", 
        fontSize:18
    },
    icon: {
        alignSelf:'flex-end'
    },
    resultContainer: {
        flex: 5,
        marginTop:'2%',
    },
    noResultContainer: {
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    foundResultContainer: {
        justifyContent:'space-around',
    },
    notFoundImage: {
        width:'50%',
        height:'80%',
        resizeMode:'contain',
    },
    headingText: {
        color: COLORS.white,
        fontSize:23,
        fontWeight: '900',
    },
    bodyText: {
        color: COLORS.white,
        fontSize:14,
        fontWeight: "normal",
        textAlign: 'center', 
        margin:'5%',
    },
    text:{
        color: COLORS.white,
        fontSize:20,
        fontWeight: "500"
    },
    thumbnailView:{
        width: deviceWidth/2,
        height:deviceWidth/2,
        margin:5,
        borderRadius: 5,
        overflow: 'hidden',
    },
    thumbnailImage:{
        width:'100%',
        height:'100%',
        resizeMode:'cover'
    },
    thumbnailHeaderContainer: {
        flexDirection:'row',
        marginBottom:10
    },
    thumbnailHeader:{
        color:COLORS.white,
        fontSize:15,
        fontWeight: "500",
        // marginTop:10,
        marginBottom:10,
        marginLeft:10
    },
    thumbnailHeaderDivider : {
        backgroundColor: COLORS.primary,
        height: 1.5,
        flex: 1,
        alignSelf: 'center',
        marginRight:10
    },
    footerContainer: {
        bottom:0,
        left:0,
        right:0,
        position:'absolute'
    },
    listcontainer: {
        flex: 1,
        marginVertical: 20,
        height: Dimensions.get('window').width
    },
    item: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        width: (deviceWidth - 10)/3,
        margin: 5,
        borderRadius: 5,
        overflow: 'hidden',
        height: Dimensions.get('window').width / 3, // approximate a square
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    itemText: {
        color: '#fff',
    },
    box: {
        width: '100%',
        height: 50,
    }
}));