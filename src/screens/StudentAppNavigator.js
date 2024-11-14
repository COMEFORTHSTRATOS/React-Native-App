import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ST_HomeScreen from './../components/student/ST_HomeScreen';
import ST_FoundItemsScreen from './../components/student/ST_FoundItemsScreen';
import ST_MyReportsScreen from './../components/student/ST_MyReportsScreen';
import ST_SettingsScreen from './../components/student/ST_SettingsScreen';

const Tab = createBottomTabNavigator();

const StudentAppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={ST_HomeScreen} />
      <Tab.Screen name="Found Items" component={ST_FoundItemsScreen} />
      <Tab.Screen name="My Reports" component={ST_MyReportsScreen} />
      <Tab.Screen name="Settings" component={ST_SettingsScreen} />
    </Tab.Navigator>
  );
};

export default StudentAppNavigator;