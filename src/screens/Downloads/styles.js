import { StyleSheet, Platform, Dimensions } from "react-native";
import COLORS from "../../constants/colors";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default (styles = StyleSheet.create({
    container:{
        flex: 1,
        // flexDirection:'row',
        backgroundColor:COLORS.backgroudColor,
    },
    thumbnailView: {
        width: deviceWidth / 4.0,
        height: deviceWidth / 3.1,
        borderRadius: 5,
        overflow: 'hidden',
        marginRight: 8,
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    rightContainer: {
        flexGrow: 1,
        // marginTop:30
    },
    toolbarContainer:{
        marginTop:30
    },
    scrollViewContainer: {
        flex:1
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

    resultContainer: {
        marginTop:'2%',
    },
    noResultContainer: {
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    foundResultContainer: {
        justifyContent:'space-around',
    },
    notFoundImage: {
        width:'50%',
        marginTop : 20,
        height:'50%',
        resizeMode:'contain'
    },
    headingText: {
        color: COLORS.white,
        fontSize:23,
        fontWeight: "bold",

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
        flex:1,
        borderRadius:10,
        margin:5,
    },
    thumbnailImage:{
        flex:1,
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
    downloadButton: {
        width: '70%',
        height: Platform.OS === 'ios' ? deviceHeight/20 : deviceHeight/15,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20
    },
    downloadText: {
        color: COLORS.white,
        fontWeight:'bold'
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
        // borderRadius:10,
        height: Dimensions.get('window').width / 3, // approximate a square
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    itemText: {
        color: '#fff',
    },
    buttonPlay: {
        flex:1,
        flexDirection:'row',
        position:'absolute',
        bottom: 0,
        backgroundColor:'#191a1f',
        width:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    image: {
        flex:1,
        width: deviceWidth/3.2,
        resizeMode: 'contain',
        marginRight: 10,
        borderColor: '#ff0000',
        borderWidth: 1,
        overflow:'hidden'
    },
}));