import {Platform, PixelRatio, StyleSheet} from 'react-native';
import colors from '../constants/colors';

// Get pixel ratio
let pixelRatio = PixelRatio.get();
if (Platform.OS === 'web') {
  pixelRatio = 1;
}

console.log('====================================');
console.log({pixelRatio});
console.log('====================================');
// Screen height
let height = 1080;

const Style = {
  backgroundColor: '#282c34',
  modalBackgroundColor: '#444c58',
  buttonUnfocusedColor: '#61dafb',
  buttonFocusedColor: '#ACB7BC',
  buttonPressedColor: '#ccc',
  px: size => {
    return Math.round((size * (height / 1080)) / pixelRatio);
  },
};

Style.styles = StyleSheet.create({
  right: {
    backgroundColor: colors.lightBlackColor,
    width: '100%',
    height: Style.px(1080),
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  header: {
    width: Style.px(1520),
    height: Style.px(300),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: Style.px(30),
    color: 'white',
  },
  content: {
    width: Style.px(1520),
    height: Style.px(780),
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Style;
