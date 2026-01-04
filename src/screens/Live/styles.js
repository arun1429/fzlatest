import { StyleSheet, Platform, Dimensions, StatusBar } from "react-native";
import colors from "../../constants/colors";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default styles = StyleSheet.create({
    backButton: {
        borderStyle: "solid",
        borderColor: colors.white,
        backgroundColor: colors.white,
        borderWidth: 3,
        flexDirection: "row",
        padding: 10,
        left: 0,
        position: "absolute",
        borderRadius: 30,
      },
      menu: {
        top: 65,
        left: 8,
        width: 44,
        height: 40,
        position: "absolute",
        zIndex: 100,
      },
      backButtonPosition: {
        top: 0,
        left: 0,
      },
      iconlybrokenarrowLeft :{
        height: 25, 
        width: 25, 
        tintColor: colors.black,
      }
});
