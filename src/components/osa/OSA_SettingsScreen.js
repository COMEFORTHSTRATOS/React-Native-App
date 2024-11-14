import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const OSA_SettingsScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Perform logout actions here
    // For simplicity, let's navigate back to the Login screen
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>

      {/* App Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>
        <Text>- Language Settings</Text>
        <Text>- Theme Settings</Text>
        <Text>- Notification Settings</Text>
      </View>

      {/* Privacy and Security */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy and Security</Text>
        <Text>- Manage Privacy Settings</Text>
        <Text>- Two-factor Authentication</Text>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text>- App Version</Text>
        <Text>- Terms of Service</Text>
        <Text>- Privacy Policy</Text>
      </View>

      {/* Log Out */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logout}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
    color: 'black',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    color: 'black',
  },
  logout: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
});

export default OSA_SettingsScreen;