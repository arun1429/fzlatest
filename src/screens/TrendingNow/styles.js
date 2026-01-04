import { StyleSheet, Platform, Dimensions } from "react-native";
import COLORS from "../../constants/colors";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default (styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection:'row',
        backgroundColor: COLORS.backgroudColor,
    },
    // leftContainer: {
    //     width: '12%',
    // },
    rightContainer: {
        flex: 1,
        // marginTop:20
    },
    scrollViewContainer: {
        flexGrow: 1,
        margin: '2%',
    },
    mainContainer: {
        flexDirection:'row',
        justifyContent:'space-between',
    },
    searchContainer: {
        width:'93%',
        justifyContent:'center',
        backgroundColor: COLORS.inputBox,
    },
    searchView: {
        borderColor: 'transparent',
        marginLeft:'2%', 
        marginRight:'3%'
    },
    removeView: {
        alignSelf:'center'
    },
    input: {
        marginLeft:'2%',
        color:"grey", 
        fontFamily:"Arial",
        fontSize:18
    },
    icon: {
        alignSelf:'flex-end'
    },
    resultContainer: {
        
        marginTop:'2%',
    },
    noResultContainer: {
        justifyContent:'center',
        alignItems:'center'
    },
    foundResultContainer: {
        justifyContent:'space-around',
    },
    notFoundImage: {
        width:'100%',
        height:'100%',
        resizeMode:'contain'
    },
    text:{
        color: COLORS.white,
        fontSize:20,
        fontWeight: "500"
    },
    thumbnailView:{
        flex:1,
        borderRadius:10,
        margin:5,
    },
    thumbnailImage:{
        width:'100%',
        height:'100%',
        resizeMode:'cover',
        // borderColor: '#ff0000',
        // borderWidth: 1,
        // borderRadius:10,
    },
    thumbnailHeaderContainer: {
        flexDirection:'row',
        marginBottom:10
    },
    thumbnailHeader:{
        color:COLORS.white,
        fontSize:15,
        fontWeight: "500",
        marginTop:10,
        marginBottom:10,
        marginRight:10
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
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
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
}));