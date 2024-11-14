import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native'; // Import CommonActions

const OSA_SideMenu = () => {
  const navigation = useNavigation();

  const navigateToSideMenuScreen = (screenName) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1, // Reset to index 1 which is the "MainTab"
        routes: [
          { name: 'MainTab' },
          { name: screenName },
        ],
      })
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <Text style={styles.category}>Asset Management</Text>
      <TouchableOpacity onPress={() => navigateToSideMenuScreen('Manage Found Items')}>
        <Text style={styles.item}>Manage Found Items</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToSideMenuScreen('Manage Reports')}>
        <Text style={styles.item}>Manage Reports</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <Text style={styles.category}>User Maintenance</Text>
      <TouchableOpacity onPress={() => navigateToSideMenuScreen('Employee Maintenance')}>
        <Text style={styles.item}>Employee Maintenance</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToSideMenuScreen('Student Maintenance')}>
        <Text style={styles.item}>Student Maintenance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#fffec8',
    width: 200, // Adjust as needed
    paddingVertical: 20,
    paddingHorizontal: 10,
    zIndex: 999, // Ensure it overlays other content
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  item: {
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
  },
});

export default OSA_SideMenu;