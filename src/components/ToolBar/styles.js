import { StyleSheet, Platform } from "react-native";

export default styles = StyleSheet.create({
    logo:{
        height: Platform.OS == 'ios' ? '60%' : '50%',
        resizeMode: "contain",
    },
    infoIcon: {
        height: '60%',
        resizeMode: "contain"
    }
});