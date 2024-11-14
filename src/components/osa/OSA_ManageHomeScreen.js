import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OSA_ManageHomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeMessage}>Welcome (Employee Name) !</Text>
      </View>

      <View style={styles.announcementContainer}>
        <Text style={styles.sectionTitle}>Announcement</Text>
        <Text style={styles.announcementText}>OSA Room: XYZ</Text>
        <Text style={styles.announcementText}>Office Hours: 7:30AM - 5:00PM (Lunch break: 12:00PM - 1:00PM)</Text>
        <Text style={styles.announcementText}>Employees:</Text>

        <View style={styles.employeeContainer}>
      </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  welcomeContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    margin: 10,
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
     color: 'black',
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
     color: 'black',
  },
  employeeContainer: {
    marginLeft: 20,
  },
});

export default OSA_ManageHomeScreen;