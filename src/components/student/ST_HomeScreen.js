import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ST_HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeMessage}>Welcome (Student Name) !</Text>
      </View>

      <View style={styles.foundItemsContainer}>
        <Text style={styles.sectionTitle}>Recent Found Items</Text>
        {/* Add recent found items list here */}
      </View>

      <View style={styles.announcementContainer}>
        <Text style={styles.sectionTitle}>Announcement</Text>
        <Text style={styles.announcementText}>OSA Room: XYZ</Text>
        <Text style={styles.announcementText}>Office Hours: 7:30AM - 5:00PM (Lunch break: 12:00PM - 1:00PM)</Text>
        <Text style={styles.announcementText}>Employees:</Text>
        <View style={styles.employeeContainer}>
          {/* Add employees list here */}
        </View>
      </View>

      {/* Bottom navigation bar */}
      <View style={styles.bottomNav}>
        {/* Add bottom navigation items here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  welcomeContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  foundItemsContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  announcementContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  announcementText: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
  },
  employeeContainer: {
    marginLeft: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default ST_HomeScreen;
