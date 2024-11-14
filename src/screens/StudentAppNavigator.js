import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, StatusBar } from 'react-native';
import ST_HomeScreen from './../components/student/ST_HomeScreen';
import ST_FoundItemsScreen from './../components/student/ST_FoundItemsScreen';
import ST_MyReportsScreen from './../components/student/ST_MyReportsScreen';
import ST_SettingsScreen from './../components/student/ST_SettingsScreen';
import ST_TermsofService from './../components/student/ST_TermsofService';
import ST_PrivacyPolicy from './../components/student/ST_PrivacyPolicy';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const StudentAppNavigator = () => {
  return (
    <>
      <StatusBar backgroundColor="#ffde1a" barStyle="light-content" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? require('../assets/bottom_navbar/home_ui.png') : require('../assets/bottom_navbar/home_ui.png');
            } else if (route.name === 'Found Items') {
              iconName = focused ? require('../assets/bottom_navbar/found_items_ui.png') : require('../assets/bottom_navbar/found_items_ui.png');
            } else if (route.name === 'My Reports') {
              iconName = focused ? require('../assets/bottom_navbar/my_reports_ui.png') : require('../assets/bottom_navbar/my_reports_ui.png');
            } else if (route.name === 'Settings') {
              iconName = focused ? require('../assets/bottom_navbar/settings_ui.png') : require('../assets/bottom_navbar/settings_ui.png');
            }

            return <Image source={iconName} style={{ width: 24, height: 24 }} />;
          },
          tabBarActiveTintColor: 'orange',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarItemStyle: {
            backgroundColor: 'white', // Background color for all tabs
          },
          tabBarStyle: {
            display: 'flex',
          },
          tabBarIndicatorStyle: {
            backgroundColor: 'transparent', // Remove the indicator
          },
          headerStyle: {
            backgroundColor: '#ffde1a', // Header background color
          },
          headerTintColor: 'black', // Header text color
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen name="Home" component={ST_HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Found Items" component={ST_FoundItemsScreen} options={{ headerShown: false }} />
        <Tab.Screen name="My Reports" component={ST_MyReportsScreen}  />
        <Tab.Screen name="Settings" component={SettingsStackNavigator} options={{ headerShown: false }} />
      </Tab.Navigator>
    </>
  );
};

const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffde1a', // Set the background color for the header
        },
        headerTintColor: 'black', // Set the text color for the header
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Settings" component={ST_SettingsScreen} />
      <Stack.Screen name="Terms of Service" component={ST_TermsofService} />
      <Stack.Screen name="Privacy Policy" component={ST_PrivacyPolicy} />
    </Stack.Navigator>
  );
};

export default StudentAppNavigator;
