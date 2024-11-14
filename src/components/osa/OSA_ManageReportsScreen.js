import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';

const OSA_ManageReportsScreen = () => {
  const [reports, setReports] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All'); // State to manage the current filter
  const navigation = useNavigation();

  useEffect(() => {
    fetchReports();
  }, [filter]); // Fetch reports whenever the filter changes

  const fetchReports = async () => {
    try {
      let query = firebase.firestore().collectionGroup('reports');
      if (filter !== 'All') {
        query = query.where('status', '==', filter); // Apply filter condition
      }
      const snapshot = await query.get();
      const reportData = snapshot.docs.map(doc => doc.data());
      setReports(reportData);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleViewReport = (reportData) => {
    navigation.navigate('Handle Reports', { reportData: reportData });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
    setRefreshing(false);
  };

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
            <Text style={styles.text}>Student UID: {item.studentUID}</Text>
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
      <View style={styles.navBar}>
        <TouchableOpacity style={[styles.filterButton, filter === 'All' && styles.activeFilter]} onPress={() => setFilter('All')}>
          <Text style={[styles.filterButtonText, filter === 'All' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, filter === 'Pending' && styles.activeFilter]} onPress={() => setFilter('Pending')}>
          <Text style={[styles.filterButtonText, filter === 'Pending' && styles.activeFilterText]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, filter === 'Accepted' && styles.activeFilter]} onPress={() => setFilter('Accepted')}>
          <Text style={[styles.filterButtonText, filter === 'Accepted' && styles.activeFilterText]}>Accepted</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, filter === 'Rejected' && styles.activeFilter]} onPress={() => setFilter('Rejected')}>
          <Text style={[styles.filterButtonText, filter === 'Rejected' && styles.activeFilterText]}>Rejected</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.reportsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8dc',
    paddingBottom: 10,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#B4B4B8',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  activeFilter: {
    borderBottomWidth: 4, // Add border bottom style
    borderBottomColor: 'yellow', // Change border bottom color for active filter
  },
  filterButtonText: {
    fontWeight: 'bold',
    color: 'black',
  },
  activeFilterText: {
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
    marginHorizontal: 10,
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
    backgroundColor: 'yellow',
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