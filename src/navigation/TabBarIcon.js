import {View, Image} from 'react-native';
import React from 'react';

const TabBarIcon = ({focused, icon}) => {
  return (
    <Image
      source={icon}
      resizeMode="contain"
      style={{
        width: 14,
        height: 14,
        tintColor: focused ? 'white' : 'grey',
        //   marginBottom: 40,
        //   tintColor: focused ? "blue" : "green",
      }}
    />
  );
};

export default TabBarIcon;
