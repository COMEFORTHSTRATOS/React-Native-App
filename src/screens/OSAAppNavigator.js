import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, View, TouchableOpacity, TouchableWithoutFeedback, Image, Text, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app'; // Import Firebase compat SDK
import 'firebase/compat/firestore'; // Import Firestore service
import 'firebase/compat/auth'; // Import Auth service
import 'firebase/compat/storage'; // Import Firebase storage service
import OSA_ManageHomeScreen from './../components/osa/OSA_ManageHomeScreen';
import OSA_TermsofService from './../components/osa/OSA_TermsofService';
import OSA_PrivacyPolicy from './../components/osa/OSA_PrivacyPolicy';
import OSA_SettingsScreen from './../components/osa/OSA_SettingsScreen';
import SideMenuIcon from './../assets/sidemenu_ui.png';
import OSA_SideMenu from './../components/osa/OSA_SideMenu';
import OSA_ManageFoundItemsScreen from './../components/osa/OSA_ManageFoundItemsScreen';
import OSA_ManageReportsScreen from './../components/osa/OSA_ManageReportsScreen';
import OSA_HandleReportsScreen from './../components/osa/OSA_HandleReportsScreen';
import OSA_ManageStudentAddItemsScreen from './../components/osa/OSA_ManageStudentAddItemsScreen';
import EmployeeMaintenance from './../components/osa/maintenance/employee/EmployeeMaintenance';
import Add_Employee from './../components/osa/maintenance/employee/Add_Employee';
import StudentMaintenance from './../components/osa/maintenance/student/StudentMaintenance';
import Add_Student from './../components/osa/maintenance/student/Add_Student';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const OSAAppNavigator = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const navigation = useNavigation();

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const CustomHeader = ({ title }) => {
    return (
      <View style={{ flexDirection: 'row', backgroundColor: '#B4B4B8' }}>
        <TouchableOpacity onPress={toggleSideMenu}>
          <Image source={SideMenuIcon} style={{ width: 30, height: 30, marginTop: 12, marginLeft: 8 }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, color: 'black', margin: 14 }}>{title}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#B4B4B8" />
      <TouchableWithoutFeedback onPress={() => setIsSideMenuOpen(false)}>
        <View style={{ flex: 1 }}>
          <Stack.Navigator>
            <Stack.Screen name="MainTab" options={{ headerShown: false }}>
              {() => (
                <Tab.Navigator
                  screenOptions={({ route }) => ({
                    header: props => <CustomHeader {...props} title={route.name} />,
                    tabBarIcon: ({ focused }) => {
                      let iconName;

                      if (route.name === 'Home') {
                        iconName = focused ? require('../assets/bottom_navbar/home_ui.png') : require('../assets/bottom_navbar/home_ui.png');
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
                  })}
                >
                  <Tab.Screen name="Home" component={OSA_ManageHomeScreen} />
                  <Tab.Screen name="Settings" component={SettingsStackNavigator} options={{ headerShown: false }} />
                </Tab.Navigator>
              )}
            </Stack.Screen>
            <Stack.Screen name="Manage Found Items" component={OSA_ManageFoundItemsScreen} options={{ headerStyle: { backgroundColor: '#B4B4B8' } }} />
                        <Stack.Screen name="Manage Reports" component={OSA_ManageReportsScreen} options={{ headerStyle: { backgroundColor: '#B4B4B8' } }} />
                        <Stack.Screen name="Handle Reports" component={OSA_HandleReportsScreen} options={{ headerStyle: { backgroundColor: '#B4B4B8' } }} />
                        <Stack.Screen name="Manage Student Add Items" component={OSA_ManageStudentAddItemsScreen} options={{ headerStyle: { backgroundColor: '#B4B4B8' } }} />
                        <Stack.Screen name="Employee Maintenance" component={EmployeeMaintenance} options={{ headerStyle: { backgroundColor: '#B4B4B8' } }} />
                        <Stack.Screen name="Student Maintenance" component={StudentMaintenance} options={{ headerStyle: { backgroundColor: '#B4B4B8' } }} />
                        <Stack.Screen name="Add Employee" component={Add_Employee} options={{ headerStyle: { backgroundColor: '#B4B4B8' } }} />
                        <Stack.Screen name="Add Student" component={Add_Student} options={{ headerStyle: { backgroundColor: '#B4B4B8' } }} />
          </Stack.Navigator>
          {isSideMenuOpen && <OSA_SideMenu toggleSideMenu={toggleSideMenu} />}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#B4B4B8', // Set the background color for the header
        },
        headerTintColor: 'black', // Set the text color for the header
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Settings " component={OSA_SettingsScreen} />
      <Stack.Screen name="Terms of Service" component={OSA_TermsofService} />
      <Stack.Screen name="Privacy Policy" component={OSA_PrivacyPolicy} />
    </Stack.Navigator>
  );
};

export default OSAAppNavigator;
