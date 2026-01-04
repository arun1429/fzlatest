import {StyleSheet} from 'react-native';
import COLORS from '../../constants/colors';

export default StyleSheet.create({
  newsText: {
    flex: 1,
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  newsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  newsMeta: {
    marginTop: 5,
    fontSize: 14,
    color: COLORS.textGrey,
  },
});
