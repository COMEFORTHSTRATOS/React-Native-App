import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, RefreshControl, Modal, Alert } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import 'firebase/storage';

const OSA_HandleStudentAddItemsScreen = () => {
  const [studentAddItems, setStudentAddItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [viewItemModalVisible, setViewItemModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchStudentAddItems();
  }, []);

  const fetchStudentAddItems = async () => {
    try {
      const db = firebase.firestore();
      const snapshot = await db.collection('student-add-item').get();
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudentAddItems(items);
    } catch (error) {
      console.error('Error fetching student add item:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudentAddItems();
    setRefreshing(false);
  };

  const resetFields = () => {
    setSelectedItem(null);
  };

  const handleViewItem = (item) => {
    console.log("View Button Clicked!");
    setSelectedItem(item);
    setViewItemModalVisible(true);
  };

  const onAdd = async () => {
    try {
      // Show a confirmation dialog before adding the item
      Alert.alert(
        'Confirm Add',
        'Are you sure you want to add this item?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Add',
            onPress: async () => {
              const db = firebase.firestore();
              const storage = firebase.storage();

              // Get the item data
              const itemRef = db.collection('student-add-item').doc(selectedItem.id);
              const snapshot = await itemRef.get();
              const data = snapshot.data();

              // Transfer the item information to found-items collection
              await db.collection('found-items').add({
                brand: data.brand,
                category: data.category,
                dateFound: data.dateFound,
                description: data.description,
                imageUrl: data.imageUrl,
                location: data.location,
                locationType: data.locationType,
                publishedDateTime: firebase.firestore.FieldValue.serverTimestamp()
              });

              // Upload the image to found-items in Firebase Storage
              if (data.imageUrl) {
                const imageRef = storage.refFromURL(data.imageUrl);
                const downloadURL = await imageRef.getDownloadURL();

                const newImageRef = storage.ref(`found-items/${imageRef.name}`);
                const response = await fetch(downloadURL);
                const blob = await response.blob();
                await newImageRef.put(blob);

                // Delete the original image
                await imageRef.delete();
              }

              // Delete the item from student-add-item in Firestore
              await itemRef.delete();

              // After successful transfer, close the modal and reset the fields
              setViewItemModalVisible(false);
              resetFields();
              // Optionally, you can also refresh the list of items after transfer
              await fetchStudentAddItems();
              // Show an alert for successful transfer
              Alert.alert('Success', 'Item transferred successfully');
            },
            style: 'default',
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error transferring item:', error);
    }
  };

  const onRemove = async () => {
    try {
      // Show a confirmation dialog before deleting
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this item?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              const db = firebase.firestore();
              const storage = firebase.storage();

              // Get the item data
              const itemRef = db.collection('student-add-item').doc(selectedItem.id);
              const snapshot = await itemRef.get();
              const data = snapshot.data();

              // Delete the item from Firestore
              await itemRef.delete();

              // Delete the image from Firebase Storage
              if (data.imageUrl) {
                const imageRef = storage.refFromURL(data.imageUrl);
                await imageRef.delete();
              }

              // After successful deletion, close the modal and reset the fields
              setViewItemModalVisible(false);
              resetFields();
              // Optionally, you can also refresh the list of items after deletion
              await fetchStudentAddItems();
              // Show an alert for successful deletion
              Alert.alert('Success', 'Item deleted successfully');
            },
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Add Items</Text>
      <ScrollView
        style={styles.addItemList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {studentAddItems.map((item, index) => (
          <View key={index} style={styles.addItem}>
            <TouchableOpacity onPress={() => handleViewItem(item)}>
              <View style={styles.addItemHeader}>
                <Text style={styles.text}>Student UID: {item.studentUID}</Text>
              </View>
              <View style={styles.addItemDetails}>
                <Image source={{ uri: item.imageUrl }} style={styles.addItemImage} />
                <View style={styles.addItemText}>
                  <Text style={styles.text}>Student No.: {item.studentNo}</Text>
                  <Text style={styles.text}>Student Name: {item.studentName}</Text>
                  <Text style={styles.text}>Year Level / Program: {item.yearLevel} / {item.program}</Text>
                  <Text style={styles.text}>Date Published: {item.publishedDateTime?.toDate().toLocaleString()}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.viewButton} onPress={() => handleViewItem(item)}>
                <Text style={styles.viewButtonText}>VIEW</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={viewItemModalVisible} onRequestClose={() => setViewItemModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>View Item</Text>
              <TouchableOpacity onPress={() => {
                setViewItemModalVisible(false);
                resetFields();
              }}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
            {selectedItem && (
              <>
                {/* Item Image */}
                <Image source={{ uri: selectedItem.imageUrl }} style={[styles.modalImage, { alignSelf: 'center' }]} />
                {/* Category and Brand on the same line */}
                <View style={styles.modalRow}>
                  <View style={styles.modalColumn}>
                    <View style={styles.inputContainer}>
                      <Image source={require('../../assets/label_ui/category_ui.png')} style={styles.icon} />
                      <Text style={styles.modalText}>Category:</Text>
                    </View>
                    <Text style={styles.input}>{selectedItem.category}</Text>
                  </View>
                  <View style={styles.modalColumn}>
                    <View style={styles.inputContainer}>
                      <Image source={require('../../assets/label_ui/brand_ui.png')} style={styles.icon} />
                      <Text style={styles.modalText}>Brand:</Text>
                    </View>
                    <Text style={styles.input}>{selectedItem.brand}</Text>
                  </View>
                </View>
                {/* Other fields */}
                <View style={styles.inputContainer}>
                  <Image source={require('../../assets/label_ui/description_ui.png')} style={styles.icon} />
                  <Text style={styles.modalText}>Description: </Text>
                </View>
                <Text style={styles.input}>{selectedItem.description}</Text>
                <View style={styles.inputContainer}>
                  <Image source={require('../../assets/label_ui/date_found_ui.png')} style={styles.icon} />
                  <Text style={styles.modalText}>Date Found:</Text>
                </View>
                <Text style={styles.input}>{selectedItem.dateFound?.toDate().toLocaleDateString()}</Text>
                {/* Location Type and Location on the same line */}
                <View style={styles.modalRow}>
                  <View style={styles.modalColumn}>
                    <View style={styles.inputContainer}>
                      <Image source={require('../../assets/label_ui/location_ui.png')} style={styles.icon} />
                      <Text style={styles.modalText}>Location:</Text>
                    </View>
                    <Text style={styles.input}>{selectedItem.locationType}</Text>
                  </View>
                  <View style={styles.modalColumn}>
                    {selectedItem.locationType === 'room' && (
                      <>
                        <View style={styles.inputContainer}>
                          <Image source={require('../../assets/label_ui/room_number_ui.png')} style={styles.icon} />
                          <Text style={styles.modalText}>Room Number:</Text>
                        </View>
                        <Text style={styles.input}>{selectedItem.location}</Text>
                      </>
                    )}
                    {selectedItem.locationType === 'facility' && (
                      <>
                        <View style={styles.inputContainer}>
                          <Image source={require('../../assets/label_ui/facility_location_ui.png')} style={styles.icon} />
                          <Text style={styles.modalText}>Facility Location:</Text>
                        </View>
                        <Text style={styles.input}>{selectedItem.location}</Text>
                      </>
                    )}
                  </View>
                </View>
                  <View style={styles.inputContainer}>
                    <Image source={require('../../assets/label_ui/item_image_ui.png')} style={styles.icon} />
                    <Text style={styles.modalText}>Item Image</Text>
                  </View>
                  <Text style={styles.input}>{selectedItem.imageUrl}</Text>
                {/* Add and Remove Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.addButton} onPress={onAdd}>
                    <Text style={styles.buttonText}>Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
                    <Text style={styles.buttonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  text: {
    color: 'black',
  },
  addItemList: {
    flex: 1,
  },
  addItem: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  addItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addItemDetails: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  addItemImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  addItemText: {
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
    width: '94%',
    paddingLeft: 22,
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 8,
    color: 'black',
    marginRight: 5,
    marginBottom: 5,
  },
  modalRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  modalColumn: {
    flex: 1,
  },
 buttonContainer: {
     flexDirection: 'row',
     justifyContent: 'space-evenly',
     marginTop: 10,
   },
   addButton: {
     backgroundColor: 'green',
     paddingVertical: 10,
     paddingHorizontal: 20,
     borderRadius: 5,
   },
   removeButton: {
     backgroundColor: 'red',
     paddingVertical: 10,
     paddingHorizontal: 20,
     borderRadius: 5,
   },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalImage: {
    width: '50%',
    height: '20%',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
});

export default OSA_HandleStudentAddItemsScreen;
