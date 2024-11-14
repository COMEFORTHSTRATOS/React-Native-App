import React from 'react';
import ST_LoginScreen from './../components/student/ST_LoginScreen';
import OSA_LoginScreen from './../components/osa/OSA_LoginScreen';
import { View, ImageBackground, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const handleStudentLogin = () => {
    // Perform student login actions here
    // For simplicity, let's navigate to the Main screen after student login
    navigation.replace('ST_LoginScreen');
  };

  const handleOSALogin = () => {
    // Perform OSA department login actions here
    // For simplicity, let's navigate to the OSA screen after OSA department login
    navigation.replace('OSA_LoginScreen');
  };

  return (
    <ImageBackground source={require('./../assets/intro/login_bg.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Image source={require('./../assets/intro/logo.png')} style={styles.logo} />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleStudentLogin}>
            <Text style={styles.buttonText}>Login as Student</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleOSALogin}>
            <Text style={styles.buttonText}>Login as OSA Department</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Image source={require('./../assets/intro/tip_logo.jpg')} style={styles.schoolLogo} resizeMode="contain" />
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Image source={require('./../assets/intro/report_icon.png')} style={styles.reportIcon} resizeMode="contain" />
        </View>
      </View>
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 60,
  },
  buttonsContainer: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'yellow',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
});

export default LoginScreen;