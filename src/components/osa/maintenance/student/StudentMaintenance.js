import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app'; // Import Firebase compat SDK
import 'firebase/compat/firestore'; // Import Firestore service
import 'firebase/compat/auth';
import 'firebase/compat/storage';

const StudentMaintenance = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Function to navigate to Add Student screen
  const navigateToAddStudent = () => {
    navigation.navigate('Add Student');
  };

  // Function to fetch students from Firestore
  const fetchStudents = async () => {
    try {
      const studentRef = firebase.firestore().collection('students');
      const snapshot = await studentRef.get();
      const studentList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(studentList);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setRefreshing(false); // Stop refreshing animation
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Function to render individual student item
  const renderStudentItem = ({ item }) => (
    <View style={styles.studentItem}>
      <Text style={styles.studentText}>Student UID: {item.id}</Text>
      <Text style={styles.studentText}>Student No: {item.studentNo}</Text>
      <Text style={styles.studentText}>Full Name: {item.firstName} {item.lastName}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => handleEditStudent(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDeleteStudent(item)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Function to handle refreshing the student list
  const handleRefresh = () => {
    setRefreshing(true); // Start refreshing animation
    fetchStudents(); // Fetch students again
  };

  // Function to handle editing a student
  const handleEditStudent = (student) => {
   console.log("Edit Button Clicked!");
  };

  // Function to handle deleting a student
  const handleDeleteStudent = (student) => {
    console.log("Delete Button Clicked!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Student Details</Text>
        <TouchableOpacity style={styles.addButton} onPress={navigateToAddStudent}>
          <Text style={styles.addButtonText}>Add Student</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={students}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.id}
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
  studentItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  studentText: {
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

export default StudentMaintenance;