import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native'; // Import CommonActions
import firebase from 'firebase/compat/app'; // Import Firebase compat SDK
import 'firebase/compat/firestore'; // Import Firestore service
import 'firebase/compat/auth'; // Import Auth service
import 'firebase/compat/storage'; // Import Firebase storage service

// Import images
const manageFoundItemsIcon = require('../../assets/sidemenu/manage_found_item_ui.png');
const manageReportsIcon = require('../../assets/sidemenu/manage_reports_ui.png');
const manageStudentAddItemsIcon = require('../../assets/sidemenu/manage_student_add_items_ui.png');
const employeeMaintenanceIcon = require('../../assets/sidemenu/employee_maintenance_ui.png');
const studentMaintenanceIcon = require('../../assets/sidemenu/student_maintenance_ui.png');

const OSA_SideMenu = ({ toggleSideMenu }) => {
  const navigation = useNavigation();
  const [osaData, setOsaData] = useState(null);

  useEffect(() => {
    // Function to fetch OSA data from Firestore
    const fetchOsaData = async () => {
      try {
        const userId = firebase.auth().currentUser.uid;
        const docRef = firebase.firestore().collection('osa').doc(userId);
        const doc = await docRef.get();
        if (doc.exists) {
          setOsaData(doc.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching OSA data:', error);
      }
    };

    fetchOsaData();
  }, []);

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

    toggleSideMenu(); // Close the side menu
  };

  return (
    <View style={styles.container}>
      {osaData && (
        <>
          <View style={styles.profileContainer}>
            <Image source={{ uri: osaData.imageUrl }} style={styles.profileImage} />
            <Text style={styles.fullName}>{osaData.firstName} {osaData.lastName}</Text>
            <Text style={styles.jobPosition}>{osaData.jobPosition}</Text>
          </View>
          <View style={styles.divider} />
        </>
      )}
      <Text style={styles.category}>Asset Management</Text>
      <TouchableOpacity onPress={() => navigateToSideMenuScreen('Manage Found Items')}>
        <View style={styles.itemContainer}>
          <Image source={manageFoundItemsIcon} style={styles.itemIcon} />
          <Text style={styles.itemText}>Manage Found Items</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToSideMenuScreen('Manage Reports')}>
        <View style={styles.itemContainer}>
          <Image source={manageReportsIcon} style={styles.itemIcon} />
          <Text style={styles.itemText}>Manage Reports</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToSideMenuScreen('Manage Student Add Items')}>
        <View style={styles.itemContainer}>
          <Image source={manageStudentAddItemsIcon} style={styles.itemIcon} />
          <Text style={styles.itemText}>Manage Student Add Items</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.divider} />
      <Text style={styles.category}>User Maintenance</Text>
      <TouchableOpacity onPress={() => navigateToSideMenuScreen('Employee Maintenance')}>
        <View style={styles.itemContainer}>
          <Image source={employeeMaintenanceIcon} style={styles.itemIcon} />
          <Text style={styles.itemText}>Employee Maintenance</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToSideMenuScreen('Student Maintenance')}>
        <View style={styles.itemContainer}>
          <Image source={studentMaintenanceIcon} style={styles.itemIcon} />
          <Text style={styles.itemText}>Student Maintenance</Text>
        </View>
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
    width: 250, // Adjust as needed
    paddingVertical: 20,
    paddingHorizontal: 10,
    zIndex: 2000, // Ensure it overlays other content
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  fullName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  jobPosition: {
    fontSize: 14,
    color: 'black',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 10,
    marginTop: 10,
  },
  category: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  itemIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  itemText: {
    fontSize: 15,
    color: 'black',
  },
});

export default OSA_SideMenu;
