import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app'; // Import Firebase compat SDK
import 'firebase/compat/firestore'; // Import Firestore service
import 'firebase/compat/auth';
import 'firebase/compat/storage';

const EmployeeMaintenance = () => {
  const navigation = useNavigation();
  const [employees, setEmployees] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Function to navigate to Add Employee screen
  const navigateToAddEmployee = () => {
    navigation.navigate('Add Employee');
  };

  // Function to fetch employees from Firestore
  const fetchEmployees = async () => {
    try {
      const employeesRef = firebase.firestore().collection('osa');
      const snapshot = await employeesRef.get();
      const employeesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(employeesList);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setRefreshing(false); // Stop refreshing animation
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Function to render individual employee item
  const renderEmployeeItem = ({ item }) => (
    <View style={styles.employeeItem}>
      <Text style={styles.employeeText}>Employee UID: {item.id}</Text>
      <Text style={styles.employeeText}>Employee No: {item.employeeNo}</Text>
      <Text style={styles.employeeText}>Full Name: {item.firstName} {item.lastName}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => handleEditEmployee(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDeleteEmployee(item)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Function to handle refreshing the employee list
  const handleRefresh = () => {
    setRefreshing(true); // Start refreshing animation
    fetchEmployees(); // Fetch employees again
  };

  // Function to handle editing a employee
  const handleEditEmployee = (employee) => {
    console.log("Edit Button Clicked!");
  };

  // Function to handle deleting a employee
  const handleDeleteEmployee = (employee) => {
    console.log("Delete Button Clicked!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Employee Details</Text>
        <TouchableOpacity style={styles.addButton} onPress={navigateToAddEmployee}>
          <Text style={styles.addButtonText}>Add Employee</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={employees}
        renderItem={renderEmployeeItem}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      />
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
  employeeItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  employeeText: {
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: 'blue',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EmployeeMaintenance;