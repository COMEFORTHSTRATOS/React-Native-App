import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, FlatList,
  Alert, Modal, Button, StyleSheet, Platform, RefreshControl,
  ScrollView
} from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import 'firebase/storage';

const ST_MyReportsScreen = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]); // State for filtered reports
  const [statusFilter, setStatusFilter] = useState('All'); // State for status filter
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const [refreshing, setRefreshing] = useState(false); // Add a refreshing state
  const [viewReportModalVisible, setViewReportModalVisible] = useState(false);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [dateFound, setDateFound] = useState(new Date());
  const [locationType, setLocationType] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [facilityLocation, setFacilityLocation] = useState('');
  const [studentMessage, setStudentMessage] = useState('');
  const [osaMessage, setOSAMessage] = useState('');

  const resetFields = () => {
    setCategory(''); setLocationType(''); setRoomNumber('');
    setDescription(''); setBrand(''); setDateFound(new Date());
    setFacilityLocation(''); setStudentMessage('');
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      try {
        const unsubscribe = firebase.firestore().collection('student-report').doc(user.uid).collection('reports')
          .onSnapshot((snapshot) => {
            setIsLoading(false);
            const reportData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            reportData.sort((a, b) => {
              const dateA = a.submissionTimestamp?.toDate();
              const dateB = b.submissionTimestamp?.toDate();
              if (dateA && dateB) {
                return dateB - dateA;
              }
              return 0;
            });
            setReports(reportData);
            applyFilter(reportData, statusFilter); // Apply filter initially
          });

        return () => unsubscribe();
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching reports:', error);
      }
    }
  };

  const applyFilter = (data, status) => {
    let filteredData = data;
    if (status !== 'All') {
      filteredData = data.filter((item) => item.status === status);
    }
    setFilteredReports(filteredData);
  };

  const changeFilter = (status) => {
    setStatusFilter(status); // Set status filter
    applyFilter(reports, status); // Apply filter
  };

  const onRefresh = () => {
    setRefreshing(true); // Set refreshing state to true
    fetchReports(); // Fetch reports again
    setRefreshing(false); // Set refreshing state to false after fetching is done
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.reportItemContainer} onPress={() => handleViewReport(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.reportItemImage} />
      <View style={styles.reportItemDetails}>
        <Text style={styles.reportItemId}>Report ID: {item.id}</Text>
        <Text style={styles.reportItemText}>Date Reported: {item.submissionTimestamp?.toDate()?.toLocaleDateString()}</Text>
        <Text style={styles.reportItemText}>Status: {item.status}</Text>
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
    setStudentMessage(report.studentMessage);
    setOSAMessage(report.osaMessage); // Set OSA message
    setViewReportModalVisible(true);
  };

  return (
    <View style={styles.container}>

      {/* Top Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'All' && styles.activeFilter]}
          onPress={() => changeFilter('All')}
        >
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'Pending' && styles.activeFilter]}
          onPress={() => changeFilter('Pending')}
        >
          <Text style={styles.filterButtonText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'Accepted' && styles.activeFilter]}
          onPress={() => changeFilter('Accepted')}
        >
          <Text style={styles.filterButtonText}>Accepted</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'Rejected' && styles.activeFilter]}
          onPress={() => changeFilter('Rejected')}
        >
          <Text style={styles.filterButtonText}>Rejected</Text>
        </TouchableOpacity>
      </View>

      {/* Report List */}
      <FlatList
        data={filteredReports}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingRight: 4 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
              <View style={styles.inputContainer}>
                <Image source={require('../../assets/label_ui/category_ui.png')} style={styles.icon} />
                <Text style={styles.modalText}>Category:</Text>
              </View>
              <Text style={styles.input}>{category}</Text>
              {/* Item Brand */}
              <View style={styles.inputContainer}>
                <Image source={require('../../assets/label_ui/brand_ui.png')} style={styles.icon} />
                <Text style={styles.modalText}>Brand:</Text>
              </View>
              <Text style={styles.input}>{brand}</Text>
              {/* Item Description */}
              <View style={styles.inputContainer}>
                <Image source={require('../../assets/label_ui/description_ui.png')} style={styles.icon} />
                <Text style={styles.modalText}>Description: </Text>
              </View>
              <Text style={styles.input}>{description}</Text>
              {/* Date Found */}
              <View style={styles.inputContainer}>
                <Image source={require('../../assets/label_ui/date_found_ui.png')} style={styles.icon} />
                <Text style={styles.modalText}>Date Found:</Text>
              </View>
              <Text style={styles.input}>{dateFound.toLocaleDateString()}</Text>
              {/* Location Type */}
              <View style={styles.inputContainer}>
                <Image source={require('../../assets/label_ui/location_ui.png')} style={styles.icon} />
                <Text style={styles.modalText}>Location:</Text>
              </View>
              <Text style={styles.input}>{locationType}</Text>
              {/* Room Number (If Location is Room) */}
              {locationType === 'room' && (
                <View>
                  <View style={styles.inputContainer}>
                    <Image source={require('../../assets/label_ui/room_number_ui.png')} style={styles.icon} />
                    <Text style={styles.modalText}>Room Number:</Text>
                  </View>
                  <Text style={styles.input}>{roomNumber}</Text>
                </View>
              )}
              {/* Facility Location (If Location is Facility) */}
              {locationType === 'facility' && (
                <View>
                  <View style={styles.inputContainer}>
                    <Image source={require('../../assets/label_ui/facility_location_ui.png')} style={styles.icon} />
                    <Text style={styles.modalText}>Facility Location:</Text>
                  </View>
                  <Text style={styles.input}>{facilityLocation}</Text>
                </View>
              )}
              {/* Student Message Field */}
              <View style={styles.inputContainer}>
                <Image source={require('../../assets/label_ui/message_ui.png')} style={styles.icon} />
                <Text style={styles.modalText}>My Message: </Text>
              </View>
              <Text style={styles.input}>{studentMessage}</Text>
              {/* OSA Message Field */}
              {osaMessage && ( // Check if osaMessage exists
                <View>
                  <View style={styles.inputContainer}>
                    <Image source={require('../../assets/label_ui/message_ui.png')} style={styles.icon} />
                    <Text style={styles.modalText}>OSA Message: </Text>
                  </View>
                  <Text style={styles.input}>{osaMessage}</Text>
                </View>
              )}
            </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8dc',
    paddingBottom: 10,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#ffde1a',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  activeFilter: {
    borderBottomWidth: 4, // Add border bottom style
    borderBottomColor: '#ffa500', // Change border bottom color for active filter
  },
  filterButtonText: {
    fontWeight: 'bold',
    color: 'black',
  },
  reportItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 10,
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