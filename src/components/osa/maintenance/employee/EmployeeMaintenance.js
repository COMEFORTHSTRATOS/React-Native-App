import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Add_Employee from './Add_Employee';
import firebase from 'firebase/compat/app'; // Import Firebase compat SDK
import 'firebase/compat/firestore'; // Import Firestore service

const EmployeeMaintenance = () => {
  const navigation = useNavigation();

  // Function to navigate to Add Employee screen
  const navigateToAddEmployee = () => {
    navigation.navigate('Add Employee');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Employee Details</Text>

        <TouchableOpacity style={styles.addButton} onPress={navigateToAddEmployee}>
          <Text style={styles.addButtonText}>Add Employee</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8dc',
    paddingHorizontal: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  addButton: {
    backgroundColor: 'yellow',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default EmployeeMaintenance;
