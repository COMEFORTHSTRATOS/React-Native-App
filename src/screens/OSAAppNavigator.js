import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, View, TouchableOpacity, TouchableWithoutFeedback, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import OSA_ManageHomeScreen from './../components/osa/OSA_ManageHomeScreen';
import OSA_ManageFoundItemsScreen from './../components/osa/OSA_ManageFoundItemsScreen';
import OSA_ManageReportsScreen from './../components/osa/OSA_ManageReportsScreen';
import OSA_HandleReportsScreen from './../components/osa/OSA_HandleReportsScreen';
import OSA_SettingsScreen from './../components/osa/OSA_SettingsScreen';
import OSA_SideMenu from './../components/osa/OSA_SideMenu';
import SideMenuIcon from './../assets/sidemenu_ui.png';
import EmployeeMaintenance from './../components/osa/maintenance/employee/EmployeeMaintenance';
import StudentMaintenance from './../components/osa/maintenance/student/StudentMaintenance';
import Add_Employee from './../components/osa/maintenance/employee/Add_Employee';
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
      <TouchableWithoutFeedback onPress={() => setIsSideMenuOpen(false)}>
        <View style={{ flex: 1 }}>
          <Stack.Navigator>
            <Stack.Screen name="MainTab" options={{ headerShown: false }}>
              {() => (
                <Tab.Navigator
                  screenOptions={({ route }) => ({
                    header: props => <CustomHeader {...props} title={route.name} />,
                  })}
                >
                  <Tab.Screen name="Home" component={OSA_ManageHomeScreen} />
                  <Stack.Screen name="Settings" component={OSA_SettingsScreen} />
                </Tab.Navigator>
              )}
            </Stack.Screen>
            <Stack.Screen name="Manage Found Items" component={OSA_ManageFoundItemsScreen} />
            <Stack.Screen name="Manage Reports" component={OSA_ManageReportsScreen} />
            <Stack.Screen name="Handle Reports" component={OSA_HandleReportsScreen} />
            <Stack.Screen name="Employee Maintenance" component={EmployeeMaintenance} />
            <Stack.Screen name="Student Maintenance" component={StudentMaintenance} />
            <Stack.Screen name="Add Employee" component={Add_Employee} />
            <Stack.Screen name="Add Student" component={Add_Student} />
          </Stack.Navigator>
          {/* Pass navigation prop to OSA_SideMenu */}
          {isSideMenuOpen && <OSA_SideMenu navigation={navigation} />}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default OSAAppNavigator;
