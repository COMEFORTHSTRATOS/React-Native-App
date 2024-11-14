import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';

const OSA_HandleReportsScreen = ({ route }) => {
  // Extract reportData from the route params
  const { reportData } = route.params;
  const [foundItems, setFoundItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [respondModalVisible, setRespondModalVisible] = useState(false);
  const [osaMessage, setOSAMessage] = useState('');
  const [status, setStatus] = useState('Pending');

  useEffect(() => {
    const fetchFoundItems = async () => {
      try {
        const snapshot = await firebase.firestore().collection('found-items').where('imageUrl', '==', reportData.imageUrl).get();
        const foundItemsData = snapshot.docs.map(doc => doc.data());
        setFoundItems(foundItemsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching found items:', error);
        setIsLoading(false);
      }
    };

    fetchFoundItems();
  }, [reportData.imageUrl]);

  const resetFields = () => {
    setStatus('pending');
    setOSAMessage('');
  };

  const handleSendFeedback = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        // Retrieve OSA information
        const osaDocRef = firebase.firestore().collection('osa').doc(user.uid);
        const osaDocSnapshot = await osaDocRef.get();
        if (osaDocSnapshot.exists) {
          const osaData = osaDocSnapshot.data();
          const feedbackData = {
            reportId: reportData.reportId,
            status,
            osaMessage,
            feedbackTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
            osaFullName: `${osaData.firstName} ${osaData.lastName}`,
            osaJobPosition: osaData.jobPosition,
            imageUrl: reportData.imageUrl,
          };
          // Store feedback under 'osa-feedback' collection with OSA's UID as document ID
          await firebase.firestore().collection('osa-feedback').doc(user.uid).collection('feedback').add(feedbackData);

          // Update status in 'student-reports' collection
          await firebase.firestore().collection('student-report').doc(reportData.studentUID).collection('reports').doc(reportData.reportId).update({ status });

          // Update status and osaMessage in 'student-reports' collection
          await firebase.firestore().collection('student-report').doc(reportData.studentUID).collection('reports').doc(reportData.reportId).update({ status, osaMessage });

          // Display success message
          Alert.alert('Success', 'Feedback sent successfully!');

          // Reset fields and close modal
          resetFields();
          setRespondModalVisible(false);
        } else {
          console.error("OSA document does not exist");
        }
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Render report data */}
      <View style={styles.reportHeader}>
        {/* Display the image */}
        <Text style={[styles.text, styles.headerText]}>Report ID: {reportData.reportId}</Text>
        <Text style={[styles.text, styles.headerText]}>Status: {reportData.status}</Text>
        <Image source={{ uri: reportData.imageUrl }} style={styles.image} />
        <Text style={[styles.text, styles.headerText]}>Submission Timestamp: {reportData.submissionTimestamp?.toDate()?.toLocaleString()}</Text>
      </View>
      <View style={styles.reportInfoHeader}>
        <Text style={[styles.text, styles.headerText]}>Report Information:</Text>
      </View>
      <View style={styles.reportInfo}>
        <Text style={styles.text}>Student UID: {reportData.studentUID}</Text>
        <Text style={styles.text}>Student Name: {reportData.studentName} ({reportData.studentNo})</Text>
        <Text style={styles.text}>Program/Year Level: {reportData.program}, {reportData.yearLevel} Year</Text>
        <Text style={styles.text}>Category: {reportData.category}</Text>
        <Text style={styles.text}>Brand: {reportData.brand}</Text>
        <Text style={styles.text}>Description: {reportData.description}</Text>
        <Text style={styles.text}>Date Found: {reportData.dateFound?.toDate()?.toLocaleDateString()}</Text>
        <Text style={styles.text}>Location: {reportData.locationType} - {reportData.location}</Text>
        <Text style={styles.text}>Message: {reportData.studentMessage}</Text>
      </View>

      {/* Render found items */}
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View>
          <View style={styles.foundItemHeader}>
            <Text style={[styles.text, styles.headerText]}>Found Item Information:</Text>
          </View>
          {foundItems.map((item, index) => (
            <View key={index} style={styles.foundItem}>
              <Text style={styles.text}>Category: {item.category}</Text>
              <Text style={styles.text}>Brand: {item.brand}</Text>
              <Text style={styles.text}>Description: {item.description}</Text>
              <Text style={styles.text}>Date Found: {item.dateFound?.toDate()?.toLocaleDateString()}</Text>
              <Text style={styles.text}>Location: {item.locationType} - {item.location}</Text>
              {/* Add other fields as needed */}
            </View>
          ))}
        </View>
      )}

      {/* Respond Button */}
      <TouchableOpacity style={styles.respondButton} onPress={() => setRespondModalVisible(true)}>
        <Text style={styles.respondButtonText}>Respond</Text>
      </TouchableOpacity>

      {/* Modal for Respond */}
      <Modal animationType="slide" transparent={true} visible={respondModalVisible} onRequestClose={() => setRespondModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Report Feedback Form </Text>
              <TouchableOpacity onPress={() => {
                  setRespondModalVisible(false);
                  resetFields();
              }}>
                  <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
            {/* Change Status */}
            <Text style={styles.modalText}>Change Status:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={status}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
                dropdownIconColor="gray"
              >
                <Picker.Item label="Pending" value="Pending" />
                <Picker.Item label="Accepted" value="Accepted" />
                <Picker.Item label="Rejected" value="Rejected" />
              </Picker>
            </View>
            {/* My Message */}
            <Text style={styles.modalText}>My Message:</Text>
            <TextInput style={styles.input} placeholder="Enter your message..." onChangeText={setOSAMessage} value={osaMessage} multiline={true} />
            {/* Send Feedback Button */}
            <TouchableOpacity style={styles.sendFeedbackButton} onPress={handleSendFeedback}>
              <Text style={styles.sendFeedbackButtonText}>Send Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    paddingTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 5,
    marginBottom: 5,
  },
  reportHeader: {
    backgroundColor: '#FFFFAD',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  reportInfoHeader: {
    backgroundColor: '#FFFFAD',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  reportInfo: {
    backgroundColor: '#FFFFAD',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  foundItemHeader: {
    backgroundColor: '#FFEAA7',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  foundItem: {
    backgroundColor: '#FFEAA7',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  text: {
    color: 'black',
  },
  headerText: {
    fontWeight: 'bold',
  },
  respondButton: {
    backgroundColor: 'yellow',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  respondButtonText: {
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
  sendFeedbackButton: {
    backgroundColor: 'yellow',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  sendFeedbackButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default OSA_HandleReportsScreen;