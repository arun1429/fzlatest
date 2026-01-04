import React, {useEffect, useRef, useState} from 'react';
// Maintenance Screen
import Maintenance from '../screens/Maintenance/';
// Intro Screens & Splash Screens
import Splash from '../screens/';

import Intro from '../screens/Intro';
import IntroHelp from '../screens/Intro/Webview/Help/';
import IntroPrivacy from '../screens/Intro/Webview/Privacy/';
import IntroFaq from '../screens/Intro/Webview/Faq/';
import Subscriptions from '../screens/Subscriptions';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const defaultStackSettings = {
  headerShown: false,
  gestureEnabled: false,
};

// const AuthNavigastion = createStackNavigator(
//   {
//     Maintenance: {
//       screen: Maintenance,
//       navigationOptions: ({navigation}) => ({
//         header: () => false,
//         drawerLockMode: 'locked-closed',
//       }),
//     },
//     Splash: {
//       screen: Splash,
//       navigationOptions: ({navigation}) => ({
//         header: () => false,
//         drawerLockMode: 'locked-closed',
//       }),
//     },
//     Intro: {
//       screen: Intro,
//       navigationOptions: ({navigation}) => ({
//         header: () => false,
//         drawerLockMode: 'locked-closed',
//       }),
//     },
//     IntroHelp: {
//       screen: IntroHelp,
//       navigationOptions: ({navigation}) => ({
//         header: () => false,
//         drawerLockMode: 'locked-closed',
//       }),
//     },
//     IntroPrivacy: {
//       screen: IntroPrivacy,
//       navigationOptions: ({navigation}) => ({
//         header: () => false,
//         drawerLockMode: 'locked-closed',
//       }),
//     },
//     IntroFaq: {
//       screen: IntroFaq,
//       navigationOptions: ({navigation}) => ({
//         header: () => false,
//         drawerLockMode: 'locked-closed',
//       }),
//     },
//   },
//   {
//     initialRouteName: 'Splash',
//     headerMode: 'none',
//   },
// );

const Stack = createNativeStackNavigator();

const AuthNavigation = (props) => {
  console.log({AuthNavigation: props.initialRouteName});
  return (
    <Stack.Navigator initialRouteName={props.initialRouteName}>
      <Stack.Screen name="Maintenance" component={Maintenance} options={defaultStackSettings} />
      <Stack.Screen name="Splash" component={Splash} options={defaultStackSettings} />
      <Stack.Screen name="Intro" component={Intro} options={defaultStackSettings} />
      <Stack.Screen name="IntroHelp" component={IntroHelp} options={defaultStackSettings} />
      <Stack.Screen name="IntroPrivacy" component={IntroPrivacy} options={defaultStackSettings} />
      <Stack.Screen name="IntroFaq" component={IntroFaq} options={defaultStackSettings} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
