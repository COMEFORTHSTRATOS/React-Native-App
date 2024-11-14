import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Switch, Image } from 'react-native';

const VersionText = ({ version }) => {
  return (
    <View style={styles.versionContainer}>
      <Text style={styles.versionText}>{version}</Text>
    </View>
  );
};

const ST_SettingsScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    // Display an alert confirmation before logging out
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Perform logout actions here
            // For simplicity, let's navigate back to the Login screen
            navigation.replace('Login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    console.log("Dark mode toggled. Current mode:", !isDarkMode ? "Dark" : "Light");
  };

  const navigateToTermsOfService = () => {
    navigation.navigate('Terms of Service');
  };

  const navigateToPrivacyPolicy = () => {
    navigation.navigate('Privacy Policy');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkMode && styles.darkMode]}>
      {/* App Preferences */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>App Preferences</Text>
        {/* Theme Mode Toggle */}
        <View style={[styles.themeToggle, styles.sectionItem]}>
          <Text style={[styles.toggleLabel, isDarkMode && styles.darkText]}>Dark Mode</Text>
          <Switch
            trackColor={{ false: '#ccc', true: '#666' }}
            thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#ccc"
            onValueChange={toggleTheme}
            value={isDarkMode}
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>About</Text>
        <TouchableOpacity style={styles.sectionItem}>
          <Text style={[styles.sectionText, isDarkMode && styles.darkText]}>App Version</Text>
          <VersionText version="1.0.0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sectionItem} onPress={navigateToTermsOfService}>
          <Text style={[styles.sectionText, isDarkMode && styles.darkText]}>Terms of Service</Text>
          <Image source={require('../../assets/next_ui.png')} style={[styles.navigationIcon, isDarkMode && styles.darkText]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sectionItem} onPress={navigateToPrivacyPolicy}>
          <Text style={[styles.sectionText, isDarkMode && styles.darkText]}>Privacy Policy</Text>
          <Image source={require('../../assets/next_ui.png')} style={[styles.navigationIcon, isDarkMode && styles.darkText]} />
        </TouchableOpacity>
      </View>

      {/* Log Out */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logout}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff8dc',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  darkMode: {
    backgroundColor: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sectionText: {
    fontSize: 16,
    color: 'black',
  },
  darkText: {
    color: 'white',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 16,
    color: 'black',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  logout: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  versionContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  versionText: {
    fontSize: 14,
    color: 'black',
  },
  navigationIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: 'black',
  },
});

export default ST_SettingsScreen;
