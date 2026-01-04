import {StyleSheet, Platform, Dimensions} from 'react-native';
import COLORS from '../../constants/colors';
import colors from '../../constants/colors';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default (styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection:'row',
    backgroundColor: COLORS.backgroudColor,
  },
  container11: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {width: deviceWidth / 3.3, color: '#f1f8ff', textAlign: 'center', fontSize: 20},
  tableData: {width: deviceWidth / 3.3, color: '#f1f8ff', textAlign: 'center', alignItems: 'center', fontSize: 17.5},
  tabletext: {color: '#f1f8ff', textAlign: 'center', alignItems: 'center', fontSize: 15},
  text: {margin: 6},
  HeaderText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 13,
  },
  row: {
    flexDirection: 'row',
  },
  // leftContainer: {
  //     width: '12%',
  // },
  rightContainer: {
    flex: 1,
    marginTop: 20,
  },
  marginContainer: {
    flex: 1,
    // margin: '2%',
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '5%',
  },
  searchView: {
    borderColor: 'transparent',
    marginLeft: '2%',
    marginRight: '5%',
  },
  input: {
    marginLeft: '2%',
    color: 'grey',
    fontSize: 18,
  },
  resultContainer: {
    flex: 5,
    marginTop: '2%',
  },
  noResultContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  foundResultContainer: {
    justifyContent: 'space-around',
  },
  headingText: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: '900',
  },
  text: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '500',
  },
  listcontainer: {
    flex: 1,
    marginVertical: 20,
    height: Dimensions.get('window').width,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: (deviceWidth - 10) / 3,
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
  },
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    height: 390,
    // flex: 1,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 7,
  },
  viewType1: {alignItems: 'center', justifyContent: 'center', marginLeft: 10, marginRight: 10, width: '95%' },
  viewTypeText1: {fontSize: 16, color: colors.black},
  updateRadio: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start'},
  textInput2: {
    fontSize: 16,
    width: '90%',
    height: '100%',
    paddingLeft: 3,
    textAlignVertical: 'center',
    color: 'black',
    ...Platform.select({
      ios: {
        lineHeight: 24,
      },
      android: {},
    }),
  },
}));
