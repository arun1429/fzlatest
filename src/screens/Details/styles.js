import { StyleSheet, Platform, Dimensions } from "react-native";
import colors from "../../constants/colors";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default (styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection:'row',
    },
    leftContainer: {
        width: '12%',
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor:colors.backgroudColor
        // marginTop:20
    },
    scrollViewContainer: {
        flexGrow: 1,
        // margin: '2%',
    },
    toolbarContainer: {
        alignItems:'flex-end',
        justifyContent:'flex-end'
    },
    loaderContainer: {
        flex:1,
        justifyContent: 'space-evenly',
    },
    bannerContainer: {
        flex:1,
        height: deviceHeight/ 2.6,
        resizeMode:'cover'
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch'
    },
    iconContainer:{
        height: 50,
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems: 'center',
        marginTop:'2%',
        marginLeft:'2%',
        marginRight:'2%',
    },
    iconView: {
        flexDirection:'row',
        flex:1,
        justifyContent: 'center', 
        alignItems: 'center',
    },  
    icon:{
        marginRight:'2%'
    },
    iconText: {
        position: 'relative',
        fontWeight:'bold',
        color: 'red',
        textAlignVertical: 'center'
    },
    percentageText: {
        position: 'relative',
        fontWeight:'bold',
        color: '#fff',
        textAlignVertical: 'center'
    },
    statsContainer: {
        flex:1,
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems: 'center',
        marginTop:'2%',
        marginLeft:'2%',
        marginRight:'2%',
    },
    statsView: {
        flex:1,
        flexDirection:'column',
        justifyContent:'space-evenly',
        alignItems: 'center',
    },
    statsHeader: {
        opacity:1,
        fontWeight:'600',
        color:'#fff',
        fontSize:14
    },
    statsText: {
        opacity:0.8,
        color:'#fff',
        fontSize:12
    },
    descriptionContainer: {
        flex:1,
        height: '100%',
        flexDirection:'column',
        marginTop:'2%',
        marginLeft:'2%',
        marginRight:'2%',
    },
    descriptionView: {
        alignItems:'flex-start'
    },
    subDescriptionView: {
        justifyContent:'flex-start',
        marginTop: 5,
        marginBottom: 5
    },
    subDescriptionText: {
        marginTop: 5,
        opacity: 0.8,
        color:'#fff',
        textAlign:'justify',
        fontSize:12,
        fontWeight: '400',
        flexWrap: 'wrap'
    },
    descriptionText: {
        color:'#fff',
        textAlign:'justify',
        fontSize:14,
        fontWeight: '600',
        flexWrap: 'wrap'
    },
    headerText: {
        color:'#fff',
        textAlign:'justify',
        fontSize:18,
        fontWeight: '800',
        flexWrap: 'wrap'  
    },
    middleContainer: {
        flex:1,
        flexDirection:'column',
        marginTop:'6%',
        marginLeft:'2%',
        marginRight:'2%',
        // marginBottom:'4%'
    },
    text:{
        color:'#FFF',
        fontSize: 20,
        fontWeight: "500"
    },
    thumbnailView:{
        width:Platform.OS === 'ios' ? deviceWidth/3.5 : deviceWidth/4,
        height:Platform.OS === 'ios' ? deviceHeight/6 : deviceHeight/6,
        marginRight: 6,
        borderRadius:5
        
    },
    thumbnailImage:{
        width:'100%',
        height:'100%',
        resizeMode:'cover',
        borderRadius:5
    },
    episodeImageView:{
        width: '100%',
        height: '100%',
        justifyContent:'center',
        alignItems:'center',
    },
    episodeImage: {
        flex:1,
        width:'60%',
        height:'60%',
        resizeMode:'contain',
    },
    thumbnailHeaderContainer: {
        flexDirection:'column',
        marginBottom:10,
    },
    thumbnailHeader:{
        color:'#FFF',
        fontSize:16,
        fontWeight: "bold",
        paddingRight:8,
        alignSelf:'flex-start'
    },
    thumbnailSubHeader:{
        color:'grey',
        fontSize:16,
        fontWeight: "500",
        paddingRight:8,
        alignSelf:'flex-start'
    },
    thumbnailHeaderDivider : {
        marginBottom:10,
        backgroundColor: 'red',
        height: 2,
    },
    contentContainer: {
        flex:1,
        marginBottom:10
    },
    videoButtonContainer: {
        position: 'absolute',
        flexDirection : 'row',
        bottom:10,
        left:15
    },
    // volumeButtonContainer:{
    //     position: 'absolute',
    //     bottom: 20,
    //     left: 15
    // },
    zoomButtonContainer:{
        position: 'absolute',
        bottom: 20,
        right: 15
    },
    closeButtonContainer: {
        width: 40,
        height: 40,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#333',
        position: 'absolute',
        top: 40,
        right: 5, 
      
        borderRadius: 20
    },
    premiumBadge: {
        position: 'absolute',
        top: 40,
        left:20, 
        backgroundColor:'#ff0000',
        justifyContent:'center',
        alignItems:'center',
        width: 60,
        height: 30,
        borderRadius: 5
    },
    premiumBadgeText: {
        fontSize:16,
        fontWeight:'bold',
        color:'#fff'
    },
    videoButton: {
        width:80,
        height:80,
        resizeMode:'contain'
    },
    footerContainer: {
        bottom:0,
        left:0,
        right:0,
        position:'absolute'
    },
    bannerAds:{ height: 50, width: "98%",  alignSelf: 'center',marginVertical:10 },
    overlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0008',
        color: colors.white,
    },
}));