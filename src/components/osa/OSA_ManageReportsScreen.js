import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import firebase from 'firebase/compat/app';
import 'firebase/firestore';

const OSA_ManageReportsScreen = () => {
  const [reports, setReports] = useState([]);
  const navigation = useNavigation(); // Get navigation object

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const snapshot = await firebase.firestore().collectionGroup('reports').get();
        const reportData = snapshot.docs.map(doc => doc.data());
        setReports(reportData);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  const handleViewReport = (reportData) => {
    navigation.navigate('Handle Reports', { reportData: reportData });
  }

  const renderReportItem = ({ item }) => (
    <View style={styles.report}>
      <TouchableOpacity>
        <View style={styles.reportHeader}>
          <Text style={styles.text}>Report ID: {item.reportId}</Text>
          <Text style={styles.text}>Date Reported: {item.submissionTimestamp?.toDate()?.toLocaleDateString()}</Text>
        </View>
        <View style={styles.reportDetails}>
          <Image source={{ uri: item.imageUrl }} style={styles.reportImage} />
          <View style={styles.reportText}>
            <Text style={styles.text}>Student ID: {item.studentNo}</Text>
            <Text style={styles.text}>Status: {item.status}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewButton} onPress={() => handleViewReport(item)}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.reportsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8dc',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  text: {
    color: 'black',
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
    backgroundColor: 'white',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reportDetails: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reportImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  reportText: {
    flex: 1,
  },
  viewButton: {
    backgroundColor: '#fffd8d',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  viewButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default OSA_ManageReportsScreen;