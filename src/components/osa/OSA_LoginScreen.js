import React, { useState } from 'react';
import { View, Image, ImageBackground, TouchableOpacity, StyleSheet, Text, TextInput, Modal, Button } from 'react-native';
import firebase from 'firebase/compat/app'; // Import Firebase compat SDK
import 'firebase/compat/firestore'; // Import Firestore service
import 'firebase/compat/auth'; // Import Auth service
import 'firebase/compat/storage'; // Import Firebase storage service

const OSA_LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleOSALogin = async () => {
    // Check if the email address ends with "-osa@tip.edu.ph"
    if (!email.toLowerCase().endsWith('-osa@tip.edu.ph')) {
      alert('Invalid Credentials!');
      return;
    }

    try {
      // Sign in with email and password
      await firebase.auth().signInWithEmailAndPassword(email, password);

      // If login is successful, navigate to the OSA view
      navigation.replace('OSAView');
    } catch (error) {
      console.error('Error during login:', error);
      alert('Invalid email or password. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    setModalVisible(true);
  };

  const resetFields = () => {
    setForgotEmail('');
  };

  const handleSendEmail = async () => {
    try {
      await firebase.auth().sendPasswordResetEmail(forgotEmail);
      alert('Password reset email sent! Please check your email inbox to reset your password.');
      setModalVisible(false);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      alert('Failed to send password reset email. Please try again.');
    }
    resetFields();
  };

  return (
    <ImageBackground source={require('./../../assets/intro/login_bg.jpg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Employee Email"
            placeholderTextColor="gray"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            maxLength={80}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="gray"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            maxLength={80}
          />
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordButtonText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleOSALogin}>
            <Text style={styles.buttonText}>LOG IN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.goBackButtonText}>GO BACK</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Image source={require('../../assets/intro/tip_logo.jpg')} style={styles.schoolLogo} resizeMode="contain" />
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Image source={require('../../assets/intro/report_icon.png')} style={styles.reportIcon} resizeMode="contain" />
        </View>
      </View>

      {/* Forgot Password Modal */}
     <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Forgot Password</Text>
              <TouchableOpacity onPress={() => {
                  setModalVisible(false);
                  resetFields();
              }}>
                  <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Email Address"
              placeholderTextColor="gray"
              value={forgotEmail}
              onChangeText={setForgotEmail}
              keyboardType="email-address"
            />
            {/* Submit Button */}
            <Button title="Send" onPress={handleSendEmail}/>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    marginBottom: 20,
    width: '100%',
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    color: 'black', // Placeholder text color
    width: '100%', // Extend input to full width
  },
  buttonsContainer: {
    marginBottom: 10,
    width: '100%', // Extend container to full width
  },
  button: {
    backgroundColor: 'yellow',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%', // Fixing width
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotPasswordButton: {
    marginTop: 10,
  },
  forgotPasswordButtonText: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  goBackButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'white',
    width: '100%',
  },
  goBackButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalHeaderText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  modalText: {
    color: 'black',
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  schoolLogo: {
    width: 50,
    height: 50,
  },
  versionText: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
  },
  reportIcon: {
    width: 30,
    height: 30,
  },
  modalInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    color: 'black',
    width: '100%',
  },
});

export default OSA_LoginScreen;