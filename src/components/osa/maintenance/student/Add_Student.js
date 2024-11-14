import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon library
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth'; // Import Firebase Authentication module

const Add_Student = () => {
  const [studentNo, setStudentNo] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [suffix, setSuffix] = useState('');
  const [program, setProgram] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true); // State to track button disabled status
  const [existingStudent, setExistingStudent] = useState(false); // State to track existing student number

  // Effect to enable/disable button based on field completion and existing student check
  useEffect(() => {
    if (
      studentNo.trim() !== '' &&
      firstName.trim() !== '' &&
      middleName.trim() !== '' &&
      lastName.trim() !== '' &&
      program !== '' &&
      yearLevel !== '' &&
      contactNo.trim() !== '' &&
      validateContactNo(contactNo.trim()) &&
      email.trim() !== '' &&
      validateEmail(email.trim()) &&
      username.trim() !== '' &&
      username.length <= 30 && // Ensure username length does not exceed 30 characters
      password.trim() !== '' &&
      password.length <= 30 && // Ensure password length does not exceed 30 characters
      !existingStudent // Check if student number already exists
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [studentNo, firstName, middleName, lastName, program, yearLevel, contactNo, email, username, password, existingStudent]);

  // Function to validate contact number format (numbers, length: 10)
  const validateContactNo = (contact) => {
    return /^\d{11}$/.test(contact);
  };

  // Function to validate email address format (must have @tip.edu.ph, length:40)
  const validateEmail = (email) => {
    return /^[^\s@]+@tip\.edu\.ph$/.test(email) && email.length <= 40;
  };

  // Function to check if student number already exists
  const checkExistingStudent = async () => {
    try {
      const studentRef = firebase.firestore().collection('students');
      const snapshot = await studentRef.where('studentNo', '==', studentNo).get();
      if (!snapshot.empty) {
        setExistingStudent(true);
      } else {
        setExistingStudent(false);
      }
    } catch (error) {
      console.error('Error checking existing student:', error);
    }
  };

  useEffect(() => {
    if (studentNo.trim() !== '') {
      checkExistingStudent();
    }
  }, [studentNo]);

  const handleAddStudent = async () => {
    try {
      // Register the user with email and password
      const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);

      // Check if user registration is successful
      if (user) {
        // Add additional student details to Firestore
        const studentRef = firebase.firestore().collection('students').doc(user.uid); // Use UID as document ID
        await studentRef.set({
          studentNo,
          firstName,
          middleName,
          lastName,
          suffix,
          program,
          yearLevel,
          contactNo,
          email,
          username,
          // Do not store password in Firestore for security reasons
        });

        alert('Student added successfully!');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Student Maintenance</Text>
      <Text style={styles.heading}>Add Student</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Student Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Student Number"
          placeholderTextColor="gray"
          value={studentNo}
          onChangeText={setStudentNo}
          keyboardType="numeric"
          maxLength={10}
        />
        {existingStudent && <Text style={styles.errorText}>Student number already exists.</Text>}
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="gray"
          value={firstName}
          onChangeText={setFirstName}
          maxLength={30}
        />
        <Text style={styles.label}>Middle Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Middle Name"
          placeholderTextColor="gray"
          value={middleName}
          onChangeText={setMiddleName}
          maxLength={20}
        />
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="gray"
          value={lastName}
          onChangeText={setLastName}
          maxLength={20}
        />
        <Text style={styles.label}>Suffix (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Suffix (Optional)"
          placeholderTextColor="gray"
          value={suffix}
          onChangeText={setSuffix}
          maxLength={8}
        />
        <Text style={styles.label}>Program</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={program}
            onValueChange={(itemValue) => setProgram(itemValue)}
            style={styles.picker}
            dropdownIconColor="black" // Set arrow color to black
          >
            <Picker.Item label="Select Program" value="" />
            <Picker.Item label="BSIT" value="BSIT" />
            <Picker.Item label="BSIS" value="BSIS" />
            <Picker.Item label="BSCpE" value="BSCpE" />
            <Picker.Item label="BSCS" value="BSCS" />
          </Picker>
        </View>
        <Text style={styles.label}>Year Level</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={yearLevel}
            onValueChange={(itemValue) => setYearLevel(itemValue)}
            style={styles.picker}
            dropdownIconColor="black" // Set arrow color to black
          >
            <Picker.Item label="Select Year Level" value="" />
            <Picker.Item label="1st" value="1st" />
            <Picker.Item label="2nd" value="2nd" />
            <Picker.Item label="3rd" value="3rd" />
            <Picker.Item label="4th" value="4th" />
            <Picker.Item label="5th" value="5th" />
          </Picker>
        </View>
        <Text style={styles.label}>Contact No.</Text>
        <TextInput
          style={styles.input}
          placeholder="Contact No."
          placeholderTextColor="gray"
          value={contactNo}
          onChangeText={setContactNo}
          keyboardType="phone-pad"
          maxLength={11}
        />
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="gray"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          maxLength={40}
        />
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="gray"
          value={username}
          onChangeText={setUsername}
          maxLength={30}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          maxLength={30}
        />
      </View>
      <TouchableOpacity
        style={[styles.button, buttonDisabled && styles.disabledButton]}
        onPress={handleAddStudent}
        disabled={buttonDisabled}
      >
        <Text style={styles.buttonText}>Add Student</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F1EB9C',
    alignItems: 'center',
    paddingVertical: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  formContainer: {
    width: '80%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  input: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: 'black',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: 'black',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 200 : 50,
    color: 'black', // Set picker text color
  },
  button: {
    backgroundColor: 'yellow',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc', // Change button color when disabled
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Add_Student;