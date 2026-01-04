import { StyleSheet, Platform, Dimensions } from "react-native";
import colors from "../../constants/colors";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default (styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection:'row',
        backgroundColor: colors.backgroudColor,
    },
    row: {
        flexDirection:'row'
    },
    leftContainer: {
        width: '12%',
    },
    rightContainer: {
        flex: 1,
        marginTop:20
    },
    marginContainer: {
        flex:1,
    },
    mainContainer: {
        flexDirection:'row',
        justifyContent:'space-between',
        height:'5%'
    },
    searchContainer: {
        width:'93%',
        justifyContent:'center',
        backgroundColor:'#191a1f',
    },
    searchView: {
        borderColor: 'transparent',
        marginLeft:'2%', 
        marginRight:'5%'
    },
    input: {
        marginLeft:'2%',
        color:"#21212187", 
        fontFamily:"Arial",
        fontSize:18
    },
    icon: {
        alignSelf:'flex-end',
        marginRight:10
    },
    resultContainer: {
        flex: 5,
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
        width:'65%',
        height:'65%',
        resizeMode:'contain'
    },
    headingText: {
        color:'#fff',
        fontSize:23,
        fontWeight: "bold",

    },
    bodyText: {
        color:'#fff',
        fontSize:14,
        fontWeight: "normal",
        textAlign: 'center', 
        margin:'5%',
    },
    text:{
        color:'#FFF',
        fontSize:20,
        fontWeight: "500"
    },
    thumbnailView:{
        width: '30%',
        height:Platform.OS === 'ios' ? deviceHeight/7 : deviceHeight/6,
        borderRadius:10,
        margin:5,
    },
    thumbnailImage:{
        width:'100%',
        height:'100%',
        resizeMode:'cover',
        borderRadius:10,
    },
    thumbnailHeaderContainer: {
        flexDirection:'row',
        marginBottom:10
    },
    thumbnailHeader:{
        color:'#FFF',
        fontSize:20,
        fontWeight: "500",
        marginTop:10,
        marginBottom:10,
        marginRight:10,
        marginLeft:13
    },
    thumbnailHeaderDivider : {
        backgroundColor: 'red',
        height: 1.5,
        flex: 1,
        alignSelf: 'center',
        marginRight:10
    },
    downloadButton: {
        width: '90%',
        height: Platform.OS === 'ios' ? deviceHeight/20 : deviceHeight/15,
        backgroundColor: '#ff0000',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20
    },
    downloadText: {
        color:'#fff',
        fontWeight:'bold'
    },
    footerContainer: {
        bottom:0,
        left:0,
        right:0,
        position:'absolute'
    },
    separatorBackground: {
        justifyContent:'center',
        backgroundColor:colors.backgroudColor,
        paddingLeft: 10,
        height:60
    },
    seperatorText: {
        fontSize: 18,
        color:'#fff',
        fontWeight:'800'
    },
    separator: {
        backgroundColor:'#333',
        height:1
    },
    items: {
        backgroundColor:'#1716164d',
        height: 60,
        marginLeft: 0, paddingLeft: 15, paddingRight: 0, marginRight: 0
    },
    label: {
        color:'#fff',
        fontSize:14,
    }
}));