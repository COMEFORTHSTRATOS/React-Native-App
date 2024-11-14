import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon library
import * as ImagePicker from 'react-native-image-picker'; // Import ImagePicker library
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const Add_Employee = () => {
  const [employeeNo, setEmployeeNo] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [suffix, setSuffix] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true); // State to track button disabled status
  const [existingEmployee, setExistingEmployee] = useState(false); // State to track existing employee number

  const handleSelectImage = async () => {
    const { launchImageLibrary } = ImagePicker;
    const options = { mediaType: 'photo', quality: 1 };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image selection');
      } else if (response.error) {
        console.error('Image picker error:', response.error);
      } else {
        const { uri, fileName } = response.assets[0];
        setSelectedImage({ uri, fileName });
      }
    });
  };

  // Effect to enable/disable button based on field completion and existing employee check
  useEffect(() => {
    if (
      employeeNo.trim() !== '' &&
      firstName.trim() !== '' &&
      middleName.trim() !== '' &&
      lastName.trim() !== '' &&
      jobPosition !== '' &&
      contactNo.trim() !== '' &&
      validateContactNo(contactNo.trim()) &&
      email.trim() !== '' &&
      validateEmail(email.trim()) &&
      username.trim() !== '' &&
      username.length <= 30 && // Ensure username length does not exceed 30 characters
      password.trim() !== '' &&
      password.length <= 30 && // Ensure password length does not exceed 30 characters
      selectedImage &&
      !existingEmployee  // Check if employee number already exists
 // Check if an image is selected
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [employeeNo, firstName, middleName, lastName, jobPosition, contactNo, email, username, password, selectedImage, existingEmployee]);

  // Function to validate contact number format (numbers, length: 10)
  const validateContactNo = (contact) => {
    return /^\d{11}$/.test(contact);
  };

  // Function to validate email address format (must have @tip.edu.ph, length:40)
  const validateEmail = (email) => {
    return /^[^\s@]+-osa@tip\.edu\.ph$/.test(email) && email.length <= 40;
  };

  // Function to check if employee number already exists
  const checkExistingEmployee = async () => {
    try {
      const employeeRef = firebase.firestore().collection('osa');
      const snapshot = await employeeRef.where('employeeNo', '==', employeeNo).get();
      if (!snapshot.empty) {
        setExistingEmployee(true);
      } else {
        setExistingEmployee(false);
      }
    } catch (error) {
      console.error('Error checking existing employee:', error);
    }
  };

  useEffect(() => {
    if (employeeNo.trim() !== '') {
      checkExistingEmployee();
    }
  }, [employeeNo]);

  const resetFields = () => {
    setEmployeeNo('');
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setSuffix('');
    setJobPosition('')
    setContactNo('');
    setEmail('');
    setUsername('');
    setPassword('');
    setSelectedImage(null);
  };

  const handleAddEmployee = async () => {
    try {
      Alert.alert(
        'Confirmation',
        'Are you sure you want to add this employee?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'OK',
            onPress: async () => {
              // Register the user with email and password
              const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);

              // Check if user registration is successful
              if (user) {
                // Upload profile image to Firebase storage
                const imageResponse = await fetch(selectedImage.uri);
                const blob = await imageResponse.blob();
                const imageRef = firebase.storage().ref().child(`osa-profile-images/${user.uid}`);
                await imageRef.put(blob);

                // Get download URL of the uploaded image
                const imageUrl = await imageRef.getDownloadURL();

                // Add additional employee details including image URL to Firestore
                const employeeRef = firebase.firestore().collection('osa').doc(user.uid);
                await employeeRef.set({
                  employeeNo,
                  firstName,
                  middleName,
                  lastName,
                  suffix,
                  jobPosition,
                  contactNo,
                  email,
                  username,
                  imageUrl, // Add image URL to Firestore
                  // Do not store password in Firestore for security reasons
                });

                alert('Employee added successfully!');
                resetFields(); // Reset fields after successful submission
              }
            }
          }
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Employee Maintenance</Text>
      <Text style={styles.heading}>Add Employee</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Employee Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Employee Number"
          placeholderTextColor="gray"
          value={employeeNo}
          onChangeText={setEmployeeNo}
          keyboardType="numeric"
          maxLength={10}
        />
        {existingEmployee && <Text style={styles.errorText}>Employee number already exists.</Text>}
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
        <Text style={styles.label}>Job Position</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={jobPosition}
            onValueChange={(itemValue) => setJobPosition(itemValue)}
            style={styles.picker}
            dropdownIconColor="black" // Set arrow color to black
          >
            <Picker.Item label="Select Job Position" value="" />
            <Picker.Item label="OSA Manager" value="OSA Manager" />
            <Picker.Item label="OSA Coordinator" value="OSA Coordinator" />
            <Picker.Item label="OSA Employee" value="OSA Employee" />
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
        {/* Select Image */}
        <View style={styles.selectImageContainer}>
           <Text style={styles.label}>Profile Image</Text>
           <TouchableOpacity style={styles.selectImageButton} onPress={handleSelectImage}>
              <Text style={styles.selectImageText}>{selectedImage ? selectedImage.fileName : 'Select Image...'}</Text>
           </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.button, buttonDisabled && styles.disabledButton]}
        onPress={handleAddEmployee}
        disabled={buttonDisabled}
      >
        <Text style={styles.buttonText}>Add Employee</Text>
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
  selectImageButton: {
    backgroundColor: 'yellow',
    borderRadius: 5,

    alignSelf: 'flex-start', // Align button to the start of the parent container
    paddingHorizontal: 20, // Add horizontal padding to the button
    paddingVertical: 10, // Add vertical padding to the button
  },
  selectImageText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
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

export default Add_Employee;