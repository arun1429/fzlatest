import {Dimensions, StyleSheet} from 'react-native';
import COLORS from '../../constants/colors';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  categoryContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  floatingDot: {
    position: 'absolute',
    width: 5,
    height: 5,
    backgroundColor: COLORS.white,
    bottom: -12,
    borderRadius: 5 / 2,
    left: '50%',
  },
  categoryTitleWrapper: {
    position: 'relative',
    marginRight: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  activeCategory: {
    color: COLORS.black,
    backgroundColor: COLORS.white,
  },
  categoryTitle: {
    color: COLORS.black50,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: COLORS.infoGrey,
    borderRadius: 5,
  },
  seeMore: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '300',
  },
  news: {
    // width: deviceWidth / 4.0,
    height: deviceWidth / 3.1,
    flex: 1,
    flexDirection: 'row',
    // overflow: 'hidden',
    marginTop: 10,
    marginRight: 8,
    marginBottom: 10,
  },
  thumbnailImage: {
    borderRadius: 15,
    height: '100%',
    flex: 0.5,
    resizeMode: 'cover',
  },
  newsText: {
    flex: 1,
    marginLeft: 10,
  },
  newsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  newsMeta: {
    marginTop: 5,
    fontSize: 14,
    color: COLORS.textGrey,
  },
  floatRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '80%',
    // backgroundColor: 'red',
    justifyContent: 'center',
  },
});
