import React, {Component} from 'react';
import {Platform, Image} from 'react-native';

// import DrawerEvents from '../components/Drawer/DrawerEvents';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SideMenu from '../components/SideMenu/';
import BottomTabNavigatior from './BottomTabNavigatior';
import Wishlist from '../screens/Wishlist';
import OrderHistory from '../screens/OrderHistory';
import Movies from '../screens/Movies';
import Languages from '../screens/Language';
import Privacy from '../screens/Privacy';
import Help from '../screens/Help';

// Dashboard Main Screens

const defaultStackSettings = {
  headerShown: false,
  gestureEnabled: false,
};
const Drawer = createDrawerNavigator();

// const DrawerNavigator = createDrawerNavigator(
//   {
//     Home: {screen: TabNavigator},
//   },
//   {
//     drawerBackgroundColor: colors.backgroudColor,
//     contentComponent: props => <SideMenu {...props} />,
//     drawerWidth: '75%',
//     // overlayColor: 1,
//     drawerPosition: 'left',
//     // hideStatusBar: Platform.OS === 'ios' ? "false" : "false",
//     drawerType: 'front',
//   },
// );

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={props => <SideMenu {...props} />} initialRouteName="HomeBottomScreen">
      <Drawer.Screen name="HomeBottomScreen" component={BottomTabNavigatior} options={defaultStackSettings} />
      <Drawer.Screen name="WishlistDraw" component={Wishlist} options={defaultStackSettings} />
      <Drawer.Screen name="OrderDraw" component={OrderHistory} options={defaultStackSettings} />
      <Drawer.Screen name="MoviesDraw" component={Movies} options={defaultStackSettings} />
      <Drawer.Screen name="LanguageDraw" component={Languages} options={defaultStackSettings} />
      <Drawer.Screen name="PrivacyDraw" component={Help} options={defaultStackSettings} />
      <Drawer.Screen name="HelpDraw" component={Help} options={defaultStackSettings} />
    </Drawer.Navigator>
  );
};

// const defaultGetStateForAction = DrawerNavigator.router.getStateForAction;

// DrawerNavigator.router.getStateForAction = (action, state) => {
//     if (action.type === 'Navigation/CLOSE_DRAWER') {
//         DrawerEvents.notify('DRAWER_CLOSED' )
//     } else if(action.type === 'Navigation/OPEN_DRAWER') {
//         DrawerEvents.notify('DRAWER_OPENED')
//     } else {
//         DrawerEvents.notify('DRAWER_CLOSED' )
//     }

//     return defaultGetStateForAction(action, state);
// };

export default DrawerNavigator;
