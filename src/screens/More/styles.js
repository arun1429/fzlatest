import colors from '../../constants/colors';

const React = require('react-native');
const {Platform, Dimensions} = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
  container: {
    flex: 1,
    backgroundColor: colors.backgroudColor,
  },
  drawerHeader: {
    backgroundColor: colors.backgroudColor,
    height: 180,
    padding: 25,
  },
  customerPicture: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    borderWidth: 3,
    borderColor: '#e51e25',
    alignSelf: 'center',
  },
  scrollViewContainer: {
    // flexGrow: 1,
    // margin: '2%',
  },
  contentPicture: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  headerTextContainer: {
    alignSelf: 'center',
    paddingTop: 12,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: Platform.OS === 'android' ? 'bold' : '800',
  },
  subHeader: {
    height: 100,
    alignItems: 'flex-start',
    backgroundColor: '#000',
    flexDirection: 'column',
    paddingTop: 5,
  },

  drawerCover: {
    alignSelf: 'stretch',
    height: Platform.OS === 'android' ? deviceHeight / 3.4 : deviceHeight / 3.4,
    width: null,
    position: 'relative',
    marginBottom: 10,
  },
  drawerImage: {
    position: 'absolute',
    marginTop: Platform.OS === 'android' ? deviceHeight / 22 : deviceHeight / 23,
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  headerName: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? deviceHeight / 13 : deviceHeight / 14,
  },
  headerMobile: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? deviceHeight / 22 : deviceHeight / 23,
  },
  infoText: {
    fontWeight: Platform.OS === 'ios' ? '500' : '400',
    fontSize: 18,
    color: 'white',
  },
  text: {
    fontSize: Platform.OS === 'android' ? 14 : 15,
    marginLeft: 20,
    color: '#fff',
  },
  badgeText: {
    fontSize: Platform.OS === 'ios' ? 13 : 11,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: Platform.OS === 'android' ? -3 : undefined,
  },
  leftContainer: {
    padding: '1%',
    // backgroundColor: 'blue',
  },
  Icon: {
    color: '#fff',
    fontSize: 28,
    width: 30,
  },
  Icon22: {
    color: '#fff',
    fontSize: 28,
    width: 40,
  },
  ImageIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  footerContainer: {
    backgroundColor: colors.backgroudColor,
  },
  footerLeftView: {
    padding: '3%',
    flexDirection: 'row',
  },
  items: {
    backgroundColor: colors.backgroudColor,
    // marginTop: 0,
    paddingTop: 0,
    padddingBottom: 0,
    // borderColor: 'blue',
    // borderWidth: 1,
  },
  activeItem: {
    borderRightWidth: 3,
    borderRightColor: 'red',
  },
  removeView: {
    alignSelf: 'flex-end',
  },
};
