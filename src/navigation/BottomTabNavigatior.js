import React from 'react';
import TabBarIcon from './TabBarIcon';
import Wishlist from '../screens/Wishlist';
import NewsScreen from '../screens/News';
import EntertainmentScreen from '../screens/Entertainment';
import Downloads from '../screens/Downloads';
import More from '../screens/More';
import HomeScreen from '../screens/Home';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import colors from '../constants/colors';
import { Platform } from 'react-native';

const Tabs = createBottomTabNavigator();


const BottomTabNavigatior = () => {
  return (
    <Tabs.Navigator
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarActiveBackgroundColor: colors.backgroudColor,
        tabBarInactiveBackgroundColor: colors.backgroudColor,
        tabBarLabelStyle: {
          // paddingTop: 5,
          marginBottom: Platform.OS == 'android' ? 10 : 0,
          fontSize: 10,
        },
        tabBarStyle: {
          backgroundColor: colors.backgroudColor,
          borderTopWidth: 1,
          borderTopColor: colors.backgroudColor,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems:'center',
          height: Platform.OS == 'android' ? 60 : 80
        },
        headerShown: false,
        tabBarIconStyle: {width: 12, height: 12}
      })}
    >
      <Tabs.Screen
        name="Hometab"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => <TabBarIcon focused={focused} icon={require('../../assets/icons/sideMenu/home_icon.png')} />,
        }}
        component={HomeScreen}
      />
      <Tabs.Screen
        name="Wishlist"
        options={{
          tabBarIcon: ({focused}) => <TabBarIcon focused={focused} icon={require('../../assets/icons/sideMenu/myList_icon.png')} />,
        }}
        component={Wishlist}
      />
      <Tabs.Screen
        name="News"
        options={{
          // tabBarLabel: 'Home',
          // headerShown: true,
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              focused={focused}
              icon={require('../../assets/icons/sideMenu/news.png')}
              // iconfocused={require('../../assets/icons/gnote.png')}
            />
          ),
        }}
        component={NewsScreen}
      />
      <Tabs.Screen
        name="Entertainment"
        options={{
          // tabBarLabel: 'Home',
          // headerShown: true,
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              focused={focused}
              icon={require('../../assets/icons/sideMenu/movies2.png')}
              // iconfocused={require('../../assets/icons/gnote.png')}
            />
          ),
        }}
        component={EntertainmentScreen}
      />
      <Tabs.Screen
        name="Download"
        options={{
          // tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => <TabBarIcon focused={focused} icon={require('../../assets/icons/sideMenu/download_icon.png')} />,
        }}
        component={Downloads}
      />
      <Tabs.Screen
        name="More"
        options={{
          // tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => <TabBarIcon focused={focused} icon={require('../../assets/icons/sideMenu/toggle_icon.png')} />,
        }}
        component={More}
      />
    </Tabs.Navigator>
  );
};

export default BottomTabNavigatior;
