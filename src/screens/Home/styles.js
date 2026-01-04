import { StyleSheet, Platform, Dimensions, StatusBar } from "react-native";
import COLORS from "../../constants/colors";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default (styles = StyleSheet.create({
    container: {
        flex:1 ,
        flexDirection: 'row',
        backgroundColor: COLORS.backgroudColor,
        // marginTop: StatusBar.currentHeight
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    // sliderContainer: {
    //     flex: 1,
    //     flexDirection: 'column',
    // },
    middleContainer: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: '2%',
        marginRight: '2%',
    },
    footerContainer: {
        bottom: 13,
        // left: 0,
        borderRadius:20,
        height:40,
        width:40,
        right: 10,
        position: 'absolute',
        backgroundColor:"#FFF",
        justifyContent:'center',
        alignItems:'center'
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
    },
    // scrollView: {
    //     flexGrow: 1,
    //     marginBottom: 10
    // },
    text: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: "500"
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop : 5,
        marginBottom : 10,
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
    progressContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: '#a8a8a9',
    },
    progress: {
        borderBottomColor: '#ff0000',
        borderColor: '#191a1f',
        borderBottomWidth: 4,

    },
    thumbnailHeader: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "700",
    },
    thumbnailSeeMore: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "300",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    imageContainer1: {
        flex: 1,
        backgroundColor: 'transparent',
        width: 40,
        height: 40,
        borderRadius: 10,
        marginLeft: 300,
        position: 'relative',
        borderColor: COLORS.white,
        borderWidth: 1,
        overflow: 'hidden'
    },
    imageContainer2: {
        flex: 1,
        backgroundColor: 'transparent',
        width: 50,
        height: 50,
        borderRadius: 10,
        // marginLeft:40,
        marginLeft: 250,
        position: 'relative',
        borderColor: COLORS.white,
        borderWidth: 1,
        overflow: 'hidden'
    },
    imageContainer3: {
        flex: 1,
        backgroundColor: 'transparent',
        width: 100,
        height: 100,
        borderRadius: 20,
        marginLeft: 150,
        position: 'relative',
        borderColor: COLORS.white,
        borderWidth: 1,
        overflow: 'hidden'
    },
    imageContainer4: {
        flex: 1,
        backgroundColor: 'transparent',
        width: 150,
        height: 150,
        borderRadius: 20,
        marginLeft: 5,
        position: 'relative',
        borderColor: COLORS.white,
        borderWidth: 3,
        overflow: 'hidden'
    },
    sliderImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'stretch',
    },
    TouchableOpacityStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
    },
    FloatingButtonStyle: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
    },
    buttonWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white'
    },
    iconDown: {
        marginLeft: 5
    },
    renderEpisodes: {
        marginTop: 10
    },
    image: {
        flex: 1,
        width: deviceWidth / 3.2,
        resizeMode: 'contain',
        marginRight: 10,
        borderColor: '#ff0000',
        borderWidth: 1,
        overflow: 'hidden'
    },
    imageContainer: {
        width: deviceWidth-2, 
        height:180,
        alignSelf:'center',
    },
    images: {
        width: '100%', 
        height: '100%',
        overflow: 'hidden',
        borderRadius: 10,
    },
    buttonPlay: {
        position: 'absolute',
        alignSelf: 'center',
        alignContent: 'center',
    },
    episodeName: {
        flex: 2,
        flexDirection: 'column',
    },
    video: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoEpisode: {
        flexDirection: 'row',
        marginBottom: '10%'
    },
    text: {
        flex: 1,
        fontSize: 16,
        color: 'white'
    },
    summary: {
        flex: 1,
        fontSize: 12,
        color: 'white',
        opacity: 0.6,
        fontWeight: 'normal',
        marginTop: '5%',
        textAlign: 'justify'
    },
    episodeInfo: {
        fontSize: deviceHeight / 60,
        paddingBottom: '2%',
        color: 'white',
        fontWeight: 'normal',
    },
    noResultContainer: {
        flex:1,
        height:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    bannerAds:{ height: 50, width: "98%",  alignSelf: 'center',marginVertical:10 }
}));