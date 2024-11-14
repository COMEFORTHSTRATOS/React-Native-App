import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';

const OSA_HandleReportsScreen = ({ route }) => {
  // Extract reportData from the route params
  const { reportData } = route.params;
  const [foundItems, setFoundItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('pending');

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

  const handleSendFeedback = () => {
    console.log("Send Feedback Button Clicked!");
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
        <Text style={styles.text}>Student Name: {reportData.studentName} ({reportData.studentNo})</Text>
        <Text style={styles.text}>Program/Year Level: {reportData.program}, {reportData.yearLevel} Year</Text>
        <Text style={styles.text}>Category: {reportData.category}</Text>
        <Text style={styles.text}>Brand: {reportData.brand}</Text>
        <Text style={styles.text}>Description: {reportData.description}</Text>
        <Text style={styles.text}>Date Found: {reportData.dateFound?.toDate()?.toLocaleDateString()}</Text>
        <Text style={styles.text}>Location: {reportData.locationType} - {reportData.location}</Text>
        <Text style={styles.text}>Message: {reportData.message}</Text>
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
      <TouchableOpacity style={styles.respondButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.respondButtonText}>Respond</Text>
      </TouchableOpacity>

      {/* Modal for Respond */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Message:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your message..."
            onChangeText={setMessage}
            value={message}
            multiline={true}
          />
          {/* Change Status */}
          <Text style={styles.modalText}>Change Status:</Text>
          <View style={styles.pickerContainer}>
          <Picker
            selectedValue={status}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
            dropdownIconColor="gray"
          >
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="Accepted" value="accepted" />
            <Picker.Item label="Rejected" value="rejected" />
          </Picker>
          </View>
          <TouchableOpacity style={styles.sendFeedbackButton} onPress={handleSendFeedback}>
            <Text style={styles.sendFeedbackButtonText}>Send Feedback</Text>
          </TouchableOpacity>
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
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  respondButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
   modalText: {
    color: 'black',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
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
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  sendFeedbackButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OSA_HandleReportsScreen;
