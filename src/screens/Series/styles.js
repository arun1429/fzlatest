import { StyleSheet, Platform, Dimensions } from "react-native";
import COLORS from "../../constants/colors";
import { StatusBarHeight } from '../../constants/function-file';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default (styles = StyleSheet.create({
    container:{
        flex: 1,
        // flexDirection:'row',
        backgroundColor: COLORS.backgroudColor,
    },
    leftContainer: {
        width: '0%',
    },
    rightContainer: {
        flex: 1,
        // marginTop: 40 + StatusBarHeight
    },
    scrollViewContainer: {
        flexGrow: 1,
        margin: '2%',
        height:'100%'
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
        flex:1,
        marginTop:'2%',
    },
    middleContainer: {
        flex:1,
        flexDirection:'column',
        marginLeft: '2%',
        marginRight: '2%',
    },
    noResultContainer: {
        flexGrow:1,
        height:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    foundResultContainer: {
        flex:1,
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
        width: deviceWidth / 4,
        height: deviceWidth / 3.1,
        marginHorizontal: 5,
        borderRadius: 5,
        overflow: 'hidden',
    },
    thumbnailImage:{
        width:'100%',
        height:'100%',
       resizeMode:'cover',
    },
    thumbImage: {
        width:'100%',
        height:'100%',
        resizeMode:'cover',
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
        marginLeft:6,
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
        width: Dimensions.get('window').width / 3,
        height: Dimensions.get('window').width / 3, // approximate a square
        resizeMode:'cover',
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    itemText: {
        color: '#fff',
    },
    loaderContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
}));