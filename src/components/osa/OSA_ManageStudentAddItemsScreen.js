import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const OSA_HandleStudentAddItemsScreen = () => {
  // Dummy data for demonstration purposes
  const reports = [
    { lostItemCode: 'el_1234', status: 'Completed' },
    { lostItemCode: 'cl_5678', status: 'Rejected' },
    { lostItemCode: 'ac_9012', status: 'Pending' },
    { lostItemCode: 'el_3456', status: 'Completed' },
    { lostItemCode: 'cl_7890', status: 'Completed' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reports</Text>
      <ScrollView style={styles.reportsList}>
        {reports.map((report, index) => (
          <View key={index} style={styles.report}>
            <Text>Lost Item Code: {report.lostItemCode}</Text>
            <Text>Status: {report.status}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reportsList: {
    flex: 1,
  },
  report: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default OSA_HandleStudentAddItemsScreen;