import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, FlatList,
  Alert, Modal, Button, StyleSheet, Platform
} from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import 'firebase/storage';

const ST_MyReportsScreen = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  const [viewReportModalVisible, setViewReportModalVisible] = useState(false);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [dateFound, setDateFound] = useState(new Date());
  const [locationType, setLocationType] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [facilityLocation, setFacilityLocation] = useState('');
  const [message, setMessage] = useState('');

  const resetFields = () => {
    setCategory(''); setLocationType(''); setRoomNumber('');
    setDescription(''); setBrand(''); setDateFound(new Date());
    setFacilityLocation(''); setMessage('');
  };

  useEffect(() => {
    const fetchReports = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        try {
          const unsubscribe = firebase.firestore().collection('student-reports').doc(user.uid).collection('reports')
            .onSnapshot((snapshot) => {
              setIsLoading(false); // Set loading to false after data arrives
              const reportData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
              // Sort the reports by the date reported in descending order
              reportData.sort((a, b) => {
                const dateA = a.submissionTimestamp?.toDate();
                const dateB = b.submissionTimestamp?.toDate();
                if (dateA && dateB) {
                  return dateB - dateA;
                }
                // Handle cases where one or both dates are null (optional)
                return 0; // Or any other default sorting behavior
              });
              setReports(reportData);
            });

          return () => unsubscribe();
        } catch (error) {
          setIsLoading(false); // Set loading to false on error
          console.error('Error fetching reports:', error);
        }
      }
    };

    fetchReports();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.reportItemContainer} onPress={() => handleViewReport(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.reportItemImage} />
      <View style={styles.reportItemDetails}>
        <Text style={styles.reportItemId}>Report ID: {item.id}</Text>
        <Text style={styles.reportItemText}>Date Reported: {item.submissionTimestamp?.toDate()?.toLocaleDateString()}</Text>
        <Text style={styles.reportItemText}>Status: Pending</Text>
      </View>
      <Text style={styles.viewButtonText}>VIEW</Text>
    </TouchableOpacity>
  );

  const handleViewReport = (report) => {
    setCategory(report.category);
    setBrand(report.brand);
    setDescription(report.description);
    setDateFound(report.dateFound.toDate()); // Convert Firebase Timestamp to JavaScript Date object
    setLocationType(report.locationType);
        // Handle location details based on location type
        if (report.locationType === 'room') {
          setRoomNumber(report.location); // Set room number if location type is room
        } else if (report.locationType === 'facility') {
          setFacilityLocation(report.location); // Set facility location if location type is facility
        }
    setMessage(report.message);
    setViewReportModalVisible(true);
  };

  return (
    <View style={styles.container}>

      <FlatList
        data={reports}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingRight: 4 }}
      />

      <Modal animationType="slide" transparent={true} visible={viewReportModalVisible} onRequestClose={() => setViewReportModalVisible(false)}>
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>View Report</Text>
                <TouchableOpacity onPress={() => {
                  setViewReportModalVisible(false);
                  resetFields();
                }}>
                  <Text style={styles.closeButton}>X</Text>
                </TouchableOpacity>
              </View>
              {/* Item Category */}
              <Text style={styles.modalText}>Category:</Text>
              <Text style={styles.input}>{category}</Text>
              {/* Item Brand */}
              <Text style={styles.modalText}>Brand:</Text>
              <Text style={styles.input}>{brand}</Text>
              {/* Item Description */}
              <Text style={styles.modalText}>Description:</Text>
              <Text style={styles.input}>{description}</Text>
              {/* Date Found */}
              <Text style={styles.modalText}>Date Found:</Text>
              <Text style={styles.input}>{dateFound.toLocaleDateString()}</Text>
              {/* Location Type */}
              <Text style={styles.modalText}>Location:</Text>
              <Text style={styles.input}>{locationType}</Text>
              {/* Room Number (If Location is Room) */}
              {locationType === 'room' && (
                <View>
                  <Text style={styles.modalText}>Room Number:</Text>
                  <Text style={styles.input}>{roomNumber}</Text>
                </View>
              )}
              {/* Facility Location (If Location is Facility) */}
              {locationType === 'facility' && (
                <View>
                  <Text style={styles.modalText}>Facility Location:</Text>
                  <Text style={styles.input}>{facilityLocation}</Text>
                </View>
              )}
              {/* Message Field */}
              <Text style={styles.modalText}>Message:</Text>
              <Text style={styles.input}>{message}</Text>
            </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    padding: 10,
  },
  reportItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  reportItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  reportItemDetails: {
    flex: 1,
    marginRight: 10,
  },
  reportItemId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  reportItemText: {
    color: 'black',
  },
  viewButtonText: {
    color: 'black',
    fontWeight: 'bold',
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
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    color: 'black',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    color: 'black', // Set picker text color
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonText: {
    marginLeft: 10,
    color: 'black',
  },
});

export default ST_MyReportsScreen;