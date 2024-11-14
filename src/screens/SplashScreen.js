import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      // Navigate to the Login screen after 2 seconds
      navigation.replace('Login');
    }, 4000); // 2 seconds
  }, []);

  return (
    <View style={styles.container}>
     <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.text}>Your App Name</Text>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // You can set your own background color
  },
  logo: {
    width: 150, // Adjust according to your logo size
    height: 150, // Adjust according to your logo size
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 18,
  },
});

export default SplashScreen;