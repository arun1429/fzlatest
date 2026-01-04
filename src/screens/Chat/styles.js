import { StyleSheet, Platform, Dimensions } from "react-native";
import COLORS from "../../constants/colors";
import { StatusBarHeight } from '../../constants/function-file';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default (styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: COLORS.backgroudColor,
    },
  
}));