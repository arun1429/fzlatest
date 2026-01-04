import {StyleSheet, Platform, Dimensions} from 'react-native';
import colors from '../../constants/colors';
import COLORS from '../../constants/colors';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.backgroudColor,
  },
  leftContainer: {
    width: 0,
  },
  rightContainer: {
    flex: 1,
    backgroundColor: colors.backgroudColor,
    // marginTop:20
  },
  scrollViewContainer: {
    flexGrow: 1,
    margin: '2%',
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  searchContainer: {
    width: '90%',
    justifyContent: 'center',
    backgroundColor: COLORS.inputBox,
    borderRadius: 5,
  },
  searchView: {
    flex: 1,
    justifyContent: 'space-between',
    borderColor: 'transparent',
    marginLeft: '2%',
    marginRight: '3%',
  },
  removeView: {
    alignSelf: 'center',
    marginRight: 0,
  },
  input: {
    width: '80%',
    marginLeft: '2%',
    color: '#fff',
    opacity: 0.9,
    fontFamily: 'Arial',
    fontSize: 18,
    padding: 8,
  },
  icon: {
    alignSelf: 'flex-end',
  },
  resultContainer: {
    flex: 1,
    marginTop: '2%',
  },
  noResultContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  foundResultContainer: {
    height: '100%',
    justifyContent: 'space-around',
  },
  notFoundImage: {
    width: '50%',
    height: '70%',
    resizeMode: 'contain',
  },
  text: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '500',
  },
  thumbnailView: {
    width: '30%',
    height: Platform.OS === 'ios' ? deviceHeight / 7 : deviceHeight / 6,
    margin: 5,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbnailHeaderContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  thumbnailHeader: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  thumbnailHeaderDivider: {
    backgroundColor: COLORS.primary,
    height: 1.5,
    flex: 1,
    alignSelf: 'center',
    marginRight: 10,
  },
  footerContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
  },
  listcontainer: {
    flex: 1,
    marginVertical: 20,
    height: Dimensions.get('window').width,
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
});
