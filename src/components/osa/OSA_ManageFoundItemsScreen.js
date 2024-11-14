import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Image,
  Alert, Modal, Button, RefreshControl, StyleSheet, Platform,
  useWindowDimensions
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'react-native-image-picker';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import 'firebase/storage';

const OSA_ManageFoundItemsScreen = () => {
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [dateFound, setDateFound] = useState(new Date());
  const [datePicked, setDatePicked] = useState(false);
  const [locationType, setLocationType] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [facilityLocation, setFacilityLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [addingItem, setAddingItem] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const windowWidth = useWindowDimensions().width;

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const db = firebase.firestore();
    try {
      const snapshot = await db.collection('found-items').orderBy('publishedDateTime', 'desc').get();
      const imageUrls = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setImages(imageUrls);
      setFilteredImages(imageUrls); // Set filteredImages to the same initial value as images
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchImages();
    setRefreshing(false);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dateFound;
    setShowDatePicker(Platform.OS === 'ios');
    setDateFound(currentDate);
    setDatePicked(true);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleSelectImage = async () => {
    const { launchImageLibrary } = ImagePicker;
    const options = { mediaType: 'photo', quality: 1 };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image selection');
      } else if (response.error) {
        console.error('Image picker error:', response.error);
      } else {
        const { uri, fileName } = response.assets[0];
        setSelectedImage({ uri, fileName });
      }
    });
  };

  const isFormClickable = () => (
    category !== '' &&
    ((locationType === 'room' && roomNumber !== '') || (locationType === 'facility' && facilityLocation !== '')) &&
    description !== '' &&
    brand !== '' &&
    selectedImage !== null &&
    datePicked
  );

  const handleAddItem = async () => {
    if (!isFormClickable() || addingItem) return;

    try {
      setAddingItem(true);

      const db = firebase.firestore();
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(`found-items/${selectedImage.fileName}`);
      const imageResponse = await fetch(selectedImage.uri);
      const blob = await imageResponse.blob();
      await imageRef.put(blob);
      const downloadURL = await imageRef.getDownloadURL();

      // Convert dateFound to Firestore Timestamp
      const dateFoundTimestamp = firebase.firestore.Timestamp.fromDate(dateFound);

      const newItem = {
        category,
        brand,
        description,
        dateFound: dateFoundTimestamp,
        location: locationType === 'room' ? `${roomNumber}` : facilityLocation,
        imageUrl: downloadURL,
        publishedDateTime: firebase.firestore.FieldValue.serverTimestamp(),
        locationType: locationType
      };

      await db.collection('found-items').add(newItem);

      // Update images state to include the newly added item
      setAddingItem(false);
      Alert.alert('Success', 'Item added successfully!', [{ text: 'OK', onPress: () => {
        console.log('OK Pressed');
        setAddModalVisible(false); // Close the modal
        resetFields(); // Reset form fields
        fetchImages(); // Refresh the screen by fetching images again
      }}]);
    } catch (error) {
      console.error('Error adding item:', error);
      setAddingItem(false);
    }
  };

  const resetFields = () => {
    setCategory(''); setLocationType(''); setRoomNumber('');
    setDescription(''); setBrand(''); setDateFound(new Date()); setDatePicked(false);
    setFacilityLocation(''); setShowDatePicker(false); setSelectedImage(null);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filteredItems = images.filter((item) => {
      const descriptionExists = item.description && typeof item.description === 'string';
      const brandExists = item.brand && typeof item.brand === 'string';
      if (descriptionExists || brandExists) {
        return (
          (descriptionExists && item.description.toLowerCase().includes(text.toLowerCase())) ||
          (brandExists && item.brand.toLowerCase().includes(text.toLowerCase()))
        );
      }
      return false;
    });
    setFilteredImages(filteredItems);
  };

  const imageWidth = (windowWidth - 40) / 3;

  const handlePreviewImage = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewModalVisible(true);
  };

  const [fetchCategory, updateCategory] = useState('');
  const [fetchRoomNumber, updateRoomNumber] = useState('');
  const [fetchDescription, updateDescription] = useState('');
  const [fetchBrand, updateBrand] = useState('');
  const [fetchDateFound, updateDateFound] = useState(new Date());
  const [fetchDatePicked, updateDatePicked] = useState(false);
  const [fetchLocationType, updateLocationType] = useState('');
  const [fetchFacilityLocation, updateFacilityLocation] = useState('');
  const [editingItem, setEditingItem] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const showEditDatePicker = () => {
    setShowDatePicker(true); // Set showDatePicker to true to display the date picker
  };

  const onChangeEditDate = (event, selectedDate) => {
    const currentDate = selectedDate || fetchDateFound;
    setShowDatePicker(Platform.OS === 'ios');
    updateDateFound(currentDate); // Update fetchDateFound state with the selected date
    updateDatePicked(true);
  };

  const resetEditForm = () => {
    updateCategory('');
    updateBrand('');
    updateDescription('');
    updateDateFound(new Date());
    updateLocationType('');
    updateRoomNumber('');
    updateFacilityLocation('');
    updateDatePicked(false);
  };

  const handleEditModalClose = () => {
    setEditModalVisible(false);
    resetEditForm(); // Reset the edit form fields
  };

  const handleEditItem = async () => {
    if (!previewImage) return;

    try {
      const db = firebase.firestore();
      const imageDoc = images.find((item) => item.imageUrl === previewImage);

      if (imageDoc) {
        setEditModalVisible(true); // Open the edit modal

        // Fetch the details of the selected image
        const imageData = await db.collection('found-items').doc(imageDoc.id).get();
        const itemData = imageData.data();

        // Populate the state variables with the fetched data
        updateCategory(itemData.category);
        updateBrand(itemData.brand);
        updateDescription(itemData.description);
        updateDateFound(itemData.dateFound.toDate()); // Convert Firestore Timestamp to JavaScript Date
        updateLocationType(itemData.locationType);

        if (itemData.locationType === 'room') {
          updateRoomNumber(itemData.location);
        } else {
          updateFacilityLocation(itemData.location);
        }

        updateDatePicked(true); // Set datePicked to true since dateFound is fetched
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
      Alert.alert('Error', 'Failed to fetch item details. Please try again later.', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
    }
  };

  // State variable to track if any field has changed
  const [fieldsChanged, setFieldsChanged] = useState(false);

  // Function to check if any field has changed
  const checkFieldsChanged = () => {
    if (
      category !== fetchCategory ||
      brand !== fetchBrand ||
      description !== fetchDescription ||
      dateFound.getTime() !== fetchDateFound.getTime() ||
      locationType !== fetchLocationType ||
      (locationType === 'room' && roomNumber !== fetchRoomNumber) ||
      (locationType === 'facility' && facilityLocation !== fetchFacilityLocation)
    ) {
      setFieldsChanged(true);
    } else {
      setFieldsChanged(false);
    }
  };

  useEffect(() => {
    checkFieldsChanged(); // Call checkFieldsChanged on initial render
  }, [category, brand, description, dateFound, locationType, roomNumber, facilityLocation]);

  const handleUpdateItem = async () => {
    if (!previewImage) return;

    try {
      const db = firebase.firestore();
      const imageDoc = images.find((item) => item.imageUrl === previewImage);

      if (imageDoc) {
        // Update only if any field has changed
        if (fieldsChanged) {
          const imageData = await db.collection('found-items').doc(imageDoc.id).get();
          const itemData = imageData.data();

          const updatedItem = {
            category: fetchCategory,
            brand: fetchBrand,
            description: fetchDescription,
            dateFound: firebase.firestore.Timestamp.fromDate(fetchDateFound),
            location: fetchLocationType === 'room' ? fetchRoomNumber : fetchFacilityLocation,
            locationType: fetchLocationType
          };

          await db.collection('found-items').doc(imageDoc.id).update(updatedItem);

          // Update images state with the updated item
          const updatedImages = images.map((item) => (item.imageUrl === previewImage ? { ...item, ...updatedItem } : item));
          setImages(updatedImages);
          setFilteredImages(updatedImages);
          Alert.alert('Success', 'Item updated successfully!', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
          setPreviewModalVisible(false);
          setEditModalVisible(false);
        } else {
          // If no field has changed, display a message
          Alert.alert('No Changes', 'No changes were made to the item.', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
        }
      }
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item. Please try again later.', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
    }
  };

  const handleDeleteItem = async () => {
      if (!previewImage) return;

      try {
        const db = firebase.firestore();
        const storageRef = firebase.storage().refFromURL(previewImage);

        // Show confirmation dialog before deleting the item
        Alert.alert(
          'Confirm Deletion',
          'Are you sure you want to delete this item?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            },
            {
              text: 'Delete',
              onPress: async () => {
                await storageRef.delete(); // Delete image from Firebase Storage

                const imageDoc = images.find((item) => item.imageUrl === previewImage);
                if (imageDoc) {
                  await db.collection('found-items').doc(imageDoc.id).delete(); // Delete document from Firebase Firestore
                  const updatedImages = images.filter((item) => item.imageUrl !== previewImage);
                  setImages(updatedImages); // Update images state
                  setFilteredImages(updatedImages); // Update filteredImages state
                  setPreviewModalVisible(false); // Close preview modal after deletion
                  Alert.alert(
                    'Success',
                    'Item deleted successfully!',
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
                  );
                }
              }
            }
          ],
          { cancelable: false }
        );
      } catch (error) {
        console.error('Error deleting item:', error);
        Alert.alert('Error', 'Failed to delete item. Please try again later.', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
      }
    };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput style={styles.searchInput} placeholder="Search..." onChangeText={handleSearch} maxLength={200}/>
        <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.imageContainer}>
          {filteredImages.map((item, index) => (
            <TouchableOpacity key={index} style={{ marginBottom: 8 }} onPress={() => handlePreviewImage(item.imageUrl)}>
              <Image source={{ uri: item.imageUrl }} style={{ width: imageWidth, height: imageWidth, borderRadius: 10 }} />
            </TouchableOpacity>
          ))}
          {[...Array(Math.max(0, 3 - (filteredImages.length % 3)))].map((_, index) => (
            <View key={`empty-${index}`} style={{ width: imageWidth, height: imageWidth, borderRadius: 10 }} />
          ))}
        </View>
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={addModalVisible} onRequestClose={() => setAddModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Add Item Form</Text>
              <TouchableOpacity onPress={() => {
                  setAddModalVisible(false);
                  resetFields();
              }}>
                  <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
            {/* Item Category */}
            <Text style={styles.modalText}>Category:</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.picker} dropdownIconColor="gray">
                <Picker.Item label="Select a Category" value="" />
                <Picker.Item label="Electronics" value="Electronics" />
                <Picker.Item label="School Supplies" value="School Supplies" />
                <Picker.Item label="Garments / Clothing" value="Clothing and accessories" />
                <Picker.Item label="Personal Items" value="Personal Items" />
              </Picker>
            </View>
            {/* Item Brand */}
            <Text style={styles.modalText}>Brand:</Text>
            <TextInput style={styles.input} onChangeText={setBrand} value={brand} placeholder="If none, type NA" placeholderTextColor="gray" maxLength={50} />
            {/* Item Description */}
            <Text style={styles.modalText}>Description: </Text>
            <TextInput
              style={styles.input} onChangeText={setDescription} value={description}
              placeholder="Name, Color, Material, Size, Specifications, Contents etc."
              placeholderTextColor="gray" multiline={true} maxLength={200}
            />
            {/* Date Found */}
            <Text style={styles.modalText}>Date Found:</Text>
            <TouchableOpacity style={[styles.input, { color: 'black' }]} onPress={showDatepicker}>
              <Text style={{ color: 'black', fontSize: 14 }}>{datePicked ? dateFound.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Select Date Found'}</Text>
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker testID="dateTimePicker" value={dateFound} mode="date" is24Hour={true} display="default" onChange={onChangeDate} />}
            {/* Location Type */}
            <Text style={styles.modalText}>Location:</Text>
            <View style={styles.locationContainer}>
              <View style={styles.radioButton}>
                <RadioButton value="room" status={locationType === 'room' ? 'checked' : 'unchecked'} onPress={() => setLocationType('room')} color="black" />
                <Text style={styles.radioButtonText}>Room</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton value="facility" status={locationType === 'facility' ? 'checked' : 'unchecked'} onPress={() => setLocationType('facility')} color="black" />
                <Text style={styles.radioButtonText}>Facility</Text>
              </View>
            </View>
            {/* Room Number (If Location is Room) */}
            {locationType === 'room' && (
              <View>
                <Text style={styles.modalText}>Room Number:</Text>
                <TextInput style={styles.input} onChangeText={setRoomNumber} value={roomNumber} placeholder="Enter room number" placeholderTextColor="gray" keyboardType="numeric" maxLength={4} />
              </View>
            )}
            {/* Facility Location (If Location is Facility) */}
            {locationType === 'facility' && (
              <View>
                <Text style={styles.modalText}>Facility Location:</Text>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={facilityLocation} onValueChange={(itemValue) => setFacilityLocation(itemValue)} style={styles.picker} dropdownIconColor="black">
                    <Picker.Item label="Select a Facility Location" value="" />
                    <Picker.Item label="Chapel" value="chapel" />
                    <Picker.Item label="Lobby" value="lobby" />
                    <Picker.Item label="Hallway" value="hallway" />
                    <Picker.Item label="Congregating Area" value="congregatingArea" />
                    <Picker.Item label="Garden" value="garden" />
                    <Picker.Item label="Parking Lot" value="parkingLot" />
                    <Picker.Item label="Comfort Room" value="comfortRoom" />
                    <Picker.Item label="Canteen" value="canteen" />
                    <Picker.Item label="Study Area" value="studyArea" />
                    <Picker.Item label="Library" value="library" />
                    <Picker.Item label="PE CENTER" value="peCenter" />
                    <Picker.Item label="Seminar Room" value="seminarRoom" />
                  </Picker>
                </View>
              </View>
            )}
            {/* Select Image */}
            <View style={styles.selectImageContainer}>
              <Text style={styles.modalText}>Item Image</Text>
              <TouchableOpacity style={styles.selectImageButton} onPress={handleSelectImage}>
                <Text style={styles.selectImageText}>{selectedImage ? selectedImage.fileName : 'Select Image...'}</Text>
              </TouchableOpacity>
            </View>
            {/* Submit Button */}
            <Button title="Add Item" onPress={handleAddItem} disabled={!isFormClickable()} />
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Edit Item Form</Text>
              <TouchableOpacity onPress={() => {
                setEditModalVisible(false);
                resetEditForm();
              }}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
            {/* Item Category */}
            <Text style={styles.modalText}>Category:</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={fetchCategory} onValueChange={(itemValue) => updateCategory(itemValue)} style={styles.picker} dropdownIconColor="gray">
                <Picker.Item label="Select a Category" value="" />
                <Picker.Item label="Electronics" value="Electronics" />
                <Picker.Item label="School Supplies" value="School Supplies" />
                <Picker.Item label="Garments / Clothing" value="Clothing and accessories" />
                <Picker.Item label="Personal Items" value="Personal Items" />
              </Picker>
            </View>
            {/* Item Brand */}
            <Text style={styles.modalText}>Brand:</Text>
            <TextInput style={styles.input} onChangeText={updateBrand} value={fetchBrand} placeholder="If none, type NA" placeholderTextColor="gray" maxLength={50} />
            {/* Item Description */}
            <Text style={styles.modalText}>Description: </Text>
            <TextInput
              style={styles.input} onChangeText={updateDescription} value={fetchDescription}
              placeholder="Name, Color, Material, Size, Specifications, Contents etc."
              placeholderTextColor="gray" multiline={true} maxLength={200}
            />
            {/* Date Found */}
            <Text style={styles.modalText}>Date Found:</Text>
            <TouchableOpacity style={[styles.input, { color: 'black' }]} onPress={showEditDatePicker}>
              <Text style={{ color: 'black', fontSize: 14 }}>{fetchDatePicked ? fetchDateFound.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Select Date Found'}</Text>
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker testID="dateTimePicker" value={fetchDateFound} mode="date" is24Hour={true} display="default" onChange={onChangeEditDate} />}
            {/* Location Type */}
            <Text style={styles.modalText}>Location:</Text>
            <View style={styles.locationContainer}>
              <View style={styles.radioButton}>
                <RadioButton value="room" status={fetchLocationType === 'room' ? 'checked' : 'unchecked'} onPress={() => updateLocationType('room')} color="black" />
                <Text style={styles.radioButtonText}>Room</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton value="facility" status={fetchLocationType === 'facility' ? 'checked' : 'unchecked'} onPress={() => updateLocationType('facility')} color="black" />
                <Text style={styles.radioButtonText}>Facility</Text>
              </View>
            </View>
            {/* Room Number (If Location is Room) */}
            {fetchLocationType === 'room' && (
              <View>
                <Text style={styles.modalText}>Room Number:</Text>
                <TextInput style={styles.input} onChangeText={updateRoomNumber} value={fetchRoomNumber} placeholder="Enter room number" placeholderTextColor="gray" keyboardType="numeric" maxLength={4} />
              </View>
            )}
            {/* Facility Location (If Location is Facility) */}
            {fetchLocationType === 'facility' && (
              <View>
                <Text style={styles.modalText}>Facility Location:</Text>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={fetchFacilityLocation} onValueChange={(itemValue) => updateFacilityLocation(itemValue)} style={styles.picker} dropdownIconColor="black">
                    <Picker.Item label="Select a Facility Location" value="" />
                    <Picker.Item label="Chapel" value="Chapel" />
                    <Picker.Item label="Lobby" value="Lobby" />
                    <Picker.Item label="Hallway" value="Hallway" />
                    <Picker.Item label="Congregating Area" value="Congregating Area" />
                    <Picker.Item label="Garden" value="Garden" />
                    <Picker.Item label="Parking Lot" value="Parking Lot" />
                    <Picker.Item label="Comfort Room" value="Comfort Room" />
                    <Picker.Item label="Canteen" value="Canteen" />
                    <Picker.Item label="Study Area" value="Study Area" />
                    <Picker.Item label="Library" value="Library" />
                    <Picker.Item label="PE CENTER" value="PE CENTER" />
                    <Picker.Item label="Seminar Room" value="Seminar Room" />
                  </Picker>
                </View>
              </View>
            )}
            {/* Submit Button */}
            <Button title="Update Item" onPress={handleUpdateItem} disabled={!fieldsChanged} />
          </View>
        </View>
      </Modal>

      {/* Preview Modal */}
      <Modal animationType="slide" transparent={true} visible={previewModalVisible} onRequestClose={() => setPreviewModalVisible(false)}>
        <View style={styles.previewModalContainer}>
          <TouchableOpacity style={styles.closePreviewButton} onPress={() => setPreviewModalVisible(false)}>
            <Text style={styles.closePreviewButtonText}>Close</Text>
          </TouchableOpacity>
          <Image source={{ uri: previewImage }} style={{ width: '100%', height: '80%' }} resizeMode="contain" />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEditItem}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteItem}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: 'black',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: 'white',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#fffd8d',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
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
  selectImageButton: {
    backgroundColor: 'lightyellow',
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'flex-start', // Align button to the start of the parent container
    paddingHorizontal: 20, // Add horizontal padding to the button
    paddingVertical: 10, // Add vertical padding to the button
  },
  selectImageText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  previewModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  closePreviewButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closePreviewButtonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    width: '40%',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#fffd8d',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  editButton: {
    backgroundColor: 'blue',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
});

export default OSA_ManageFoundItemsScreen;