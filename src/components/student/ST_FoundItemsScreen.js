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

const ST_FoundItemsScreen = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const windowWidth = useWindowDimensions().width;
  const imageWidth = (windowWidth - 40) / 3;

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
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
  const [studentMessage, setStudentMessage] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false); // Add state for tracking submission status
  const [selectedImageUrl, setSelectedImageUrl] = useState(''); // State to store selected image URL

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

  const resetFields = () => {
    setCategory(''); setLocationType(''); setRoomNumber('');
    setDescription(''); setBrand(''); setDateFound(new Date()); setDatePicked(false);
    setFacilityLocation(''); setShowDatePicker(false); setStudentMessage(''); setSelectedImage(null);
  };

  const isReportFormClickable = () => (
    category !== '' &&
    ((locationType === 'room' && roomNumber !== '') || (locationType === 'facility' && facilityLocation !== '')) &&
    description !== '' &&
    brand !== '' &&
    studentMessage !== '' &&
    datePicked
  );

  const isAddFormClickable = () => (
    category !== '' &&
    ((locationType === 'room' && roomNumber !== '') || (locationType === 'facility' && facilityLocation !== '')) &&
    description !== '' &&
    brand !== '' &&
    selectedImage !== null &&
    datePicked
  );

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const db = firebase.firestore();
    try {
      const snapshot = await db.collection('found-items').orderBy('publishedDateTime', 'desc').get();
      const allImages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Fetch all student reports
      const user = firebase.auth().currentUser;
      const studentReportsSnapshot = await db.collection('student-report').doc(user.uid).collection('reports').get();
      const studentReports = studentReportsSnapshot.docs.map(doc => doc.data());

      // Filter out images with reported URLs
      const filteredImages = allImages.filter((item) => {
        for (const report of studentReports) {
          // Check if the item URL matches any reported URLs and the report status is "Pending"
          if (report.imageUrl === item.imageUrl &&  (report.status === 'Pending' || report.status === 'Accepted')) {
            return false; // Exclude the image
          }
        }
        return true; // Include the image
      });

      setImages(filteredImages);
      setFilteredImages(filteredImages); // Set filteredImages to the same initial value as images
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchImages();
    setRefreshing(false);
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

  const handlePreviewImage = (imageUrl) => {
    setPreviewImage(imageUrl);
    setSelectedImageUrl(imageUrl); // Set selected image URL
    setPreviewModalVisible(true);
  };

  const handleReportItem = () => {
    setReportModalVisible(true);
  };

  const handleSubmitReport = async () => {
    try {
      if (submittingReport) {
        return; // Prevent duplicate submissions
      }
      setSubmittingReport(true); // Set submitting status to true
      const user = firebase.auth().currentUser;
      if (user) {
        const studentDocRef = firebase.firestore().collection('students').doc(user.uid);
        const studentDocSnapshot = await studentDocRef.get();
        if (studentDocSnapshot.exists) {
          const studentData = studentDocSnapshot.data();
          const reportId = Math.random().toString(36).substring(2); // Generate a random report ID
          const imageUrl = selectedImageUrl; // Use selected image URL

          const submissionTimestamp = firebase.firestore.FieldValue.serverTimestamp();

          const reportData = {
            reportId,
            category,
            brand,
            description,
            dateFound,
            location: locationType === 'room' ? `${roomNumber}` : facilityLocation,
            studentMessage,
            imageUrl,
            studentNo: studentData.studentNo,
            studentName: `${studentData.firstName} ${studentData.lastName}`,
            program: studentData.program,
            yearLevel: studentData.yearLevel,
            submissionTimestamp: submissionTimestamp,
            status: 'Pending', // Add status field and set it to pending
            locationType: locationType, // Set locationType based on the selected location
            studentUID: user.uid,
          };

          // Use the UID as the document ID for student reports
          await firebase.firestore().collection('student-report').doc(user.uid).collection('reports').doc(reportId).set(reportData);
          Alert.alert('Success', 'Report submitted successfully!');
          resetFields();
          setPreviewModalVisible(false);
          setReportModalVisible(false);
          fetchImages();
        } else {
          console.error("Student document does not exist");
        }
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setSubmittingReport(false); // Reset submitting status to false after submission or error
      resetFields();
    }
  };

  const handleAddItem = async () => {
      if (!isAddFormClickable() || addingItem) return;

      try {
        setAddingItem(true);

        const db = firebase.firestore();
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`student-add-item/${selectedImage.fileName}`);
        const imageResponse = await fetch(selectedImage.uri);
        const blob = await imageResponse.blob();
        await imageRef.put(blob);
        const downloadURL = await imageRef.getDownloadURL();

        // Convert dateFound to Firestore Timestamp
        const dateFoundTimestamp = firebase.firestore.Timestamp.fromDate(dateFound);

        // Get current user
        const currentUser = firebase.auth().currentUser;

        // Retrieve student information from Firestore
        const studentDoc = await db.collection('students').doc(currentUser.uid).get();
        const studentData = studentDoc.data();

        // Construct the new item object
        const newItem = {
          category,
          brand,
          description,
          dateFound: dateFoundTimestamp,
          location: locationType === 'room' ? `${roomNumber}` : facilityLocation,
          imageUrl: downloadURL,
          publishedDateTime: firebase.firestore.FieldValue.serverTimestamp(),
          locationType: locationType,
          studentUID: currentUser.uid, // Include student UID
          studentNo: studentData.studentNo, // Include student no.
          studentName: `${studentData.firstName} ${studentData.lastName}`, // Include student name
          yearLevel: studentData.yearLevel, // Include year level
          program: studentData.program // Include program
        };

        // Add the new item to Firestore
        await db.collection('student-add-item').add(newItem);

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Image source={require('../../assets/search_ui.png')} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="black"
            onChangeText={handleSearch}
            maxLength={100}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add</Text>
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
            <View style={styles.inputContainer}>
              <Image source={require('../../assets/label_ui/category_ui.png')} style={styles.icon} />
              <Text style={styles.modalText}>Category:</Text>
            </View>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.picker} dropdownIconColor="gray">
                <Picker.Item label="Select a Category" value="" />
                <Picker.Item label="Electronics" value="Electronics" />
                <Picker.Item label="School Supplies" value="School Supplies" />
                <Picker.Item label="Garments / Clothing" value="Garments / Clothing" />
                <Picker.Item label="Personal Items" value="Personal Items" />
              </Picker>
            </View>
            {/* Item Brand */}
            <View style={styles.inputContainer}>
              <Image source={require('../../assets/label_ui/brand_ui.png')} style={styles.icon} />
              <Text style={styles.modalText}>Brand:</Text>
            </View>
            <TextInput style={styles.input} onChangeText={setBrand} value={brand} placeholder="If none, type NA" placeholderTextColor="gray" maxLength={30} />
            {/* Item Description */}
            <View style={styles.inputContainer}>
              <Image source={require('../../assets/label_ui/description_ui.png')} style={styles.icon} />
              <Text style={styles.modalText}>Description: </Text>
            </View>
            <TextInput
              style={styles.input} onChangeText={setDescription} value={description}
              placeholder="Name, Color, Material, Size, Specifications, Contents etc."
              placeholderTextColor="gray" multiline={true} maxLength={100}
            />
            {/* Date Found */}
            <View style={styles.inputContainer}>
              <Image source={require('../../assets/label_ui/date_found_ui.png')} style={styles.icon} />
              <Text style={styles.modalText}>Date Found:</Text>
            </View>
            <TouchableOpacity style={[styles.input, { color: 'black' }]} onPress={showDatepicker}>
              <Text style={{ color: 'black', fontSize: 14 }}>{datePicked ? dateFound.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Select Date Found'}</Text>
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker testID="dateTimePicker" value={dateFound} mode="date" is24Hour={true} display="default" onChange={onChangeDate} />}
            {/* Location Type */}
            <View style={styles.inputContainer}>
              <Image source={require('../../assets/label_ui/location_ui.png')} style={styles.icon} />
              <Text style={styles.modalText}>Location:</Text>
            </View>
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
                <View style={styles.inputContainer}>
                  <Image source={require('../../assets/label_ui/room_number_ui.png')} style={styles.icon} />
                  <Text style={styles.modalText}>Room Number:</Text>
                </View>
                <TextInput style={styles.input} onChangeText={setRoomNumber} value={roomNumber} placeholder="Enter room number" placeholderTextColor="gray" keyboardType="numeric" maxLength={4} />
              </View>
            )}
            {/* Facility Location (If Location is Facility) */}
            {locationType === 'facility' && (
              <View>
                <View style={styles.inputContainer}>
                  <Image source={require('../../assets/label_ui/facility_location_ui.png')} style={styles.icon} />
                  <Text style={styles.modalText}>Facility Location:</Text>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={facilityLocation} onValueChange={(itemValue) => setFacilityLocation(itemValue)} style={styles.picker} dropdownIconColor="black">
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
            {/* Select Image */}
            <View style={styles.selectImageContainer}>
              <View style={styles.inputContainer}>
                <Image source={require('../../assets/label_ui/item_image_ui.png')} style={styles.icon} />
                <Text style={styles.modalText}>Item Image</Text>
              </View>
              <TouchableOpacity style={styles.selectImageButton} onPress={handleSelectImage}>
                <Text style={styles.selectImageText}>{selectedImage ? selectedImage.fileName : 'Select Image...'}</Text>
              </TouchableOpacity>
            </View>
            {/* Add Item Button */}
           <TouchableOpacity
             style={[styles.addItemButton, { backgroundColor: isAddFormClickable() ? 'yellow' : 'lightgray' }]}
             onPress={handleAddItem}
             disabled={!isAddFormClickable()}
           >
             <Text style={{ alignItems:'center', color: isAddFormClickable() ? 'black' : 'gray', fontWeight: 'bold' }}>Add Item</Text>
           </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={reportModalVisible} onRequestClose={() => setReportModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Report Item Form</Text>
              <TouchableOpacity onPress={() => {
                  setReportModalVisible(false);
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
            <View style={styles.pickerContainer}>
              <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.picker} dropdownIconColor="gray">
                <Picker.Item label="Select a Category" value="" />
                <Picker.Item label="Electronics" value="Electronics" />
                <Picker.Item label="School Supplies" value="School Supplies" />
                <Picker.Item label="Garments / Clothing" value="Garments / Clothing" />
                <Picker.Item label="Personal Items" value="Personal Items" />
              </Picker>
            </View>
            {/* Item Brand */}
            <View style={styles.inputContainer}>
              <Image source={require('../../assets/label_ui/brand_ui.png')} style={styles.icon} />
              <Text style={styles.modalText}>Brand:</Text>
            </View>
            <TextInput style={styles.input} onChangeText={setBrand} value={brand} placeholder="If none, type NA" placeholderTextColor="gray" maxLength={30} />
            {/* Item Description */}
            <View style={styles.inputContainer}>
              <Image source={require('../../assets/label_ui/description_ui.png')} style={styles.icon} />
              <Text style={styles.modalText}>Description: </Text>
            </View>
            <TextInput
              style={styles.input} onChangeText={setDescription} value={description}
              placeholder="Name, Color, Material, Size, Specifications, Contents etc."
              placeholderTextColor="gray" multiline={true} maxLength={100}
            />
            {/* Date Found */}
            <View style={styles.inputContainer}>
              <Image source={require('../../assets/label_ui/date_found_ui.png')} style={styles.icon} />
              <Text style={styles.modalText}>Date Found:</Text>
            </View>
            <TouchableOpacity style={[styles.input, { color: 'black' }]} onPress={showDatepicker}>
              <Text style={{ color: 'black', fontSize: 14 }}>{datePicked ? dateFound.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Select Date Found'}</Text>
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker testID="dateTimePicker" value={dateFound} mode="date" is24Hour={true} display="default" onChange={onChangeDate} />}
            {/* Location Type */}
            <View style={styles.inputContainer}>
              <Image source={require('../../assets/label_ui/location_ui.png')} style={styles.icon} />
              <Text style={styles.modalText}>Location:</Text>
            </View>
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
                <View style={styles.inputContainer}>
                  <Image source={require('../../assets/label_ui/room_number_ui.png')} style={styles.icon} />
                  <Text style={styles.modalText}>Room Number:</Text>
                </View>
                <TextInput style={styles.input} onChangeText={setRoomNumber} value={roomNumber} placeholder="Enter room number" placeholderTextColor="gray" keyboardType="numeric" maxLength={4} />
              </View>
            )}
            {/* Facility Location (If Location is Facility) */}
            {locationType === 'facility' && (
              <View>
                <View style={styles.inputContainer}>
                  <Image source={require('../../assets/label_ui/facility_location_ui.png')} style={styles.icon} />
                  <Text style={styles.modalText}>Facility Location:</Text>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={facilityLocation} onValueChange={(itemValue) => setFacilityLocation(itemValue)} style={styles.picker} dropdownIconColor="black">
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
            {/* My Message Field */}
            <View style={styles.inputContainer}>
              <Image source={require('../../assets/label_ui/message_ui.png')} style={styles.icon} />
              <Text style={styles.modalText}>My Message: </Text>
            </View>
            <TextInput
              style={styles.input} onChangeText={setStudentMessage} value={studentMessage}
              placeholder="State your message"
              placeholderTextColor="gray" multiline={true} maxLength={150}
            />
            {/* Submit Button */}
            <TouchableOpacity
               style={[styles.reportItemButton, { backgroundColor: isReportFormClickable() ? 'yellow' : 'lightgray' }]}
               onPress={handleSubmitReport}
               disabled={!isReportFormClickable()}
            >
              <Text style={{ alignItems:'center', color: isReportFormClickable() ? 'black' : 'gray', fontWeight: 'bold' }}>Submit Report</Text>
            </TouchableOpacity>
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
            <TouchableOpacity style={styles.reportButton} onPress={handleReportItem}>
              <Text style={styles.reportButtonText}>Report Item</Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#ffde1a',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginRight: 10,
    flex: 1,
  },
  searchIcon: {
    width: 15,
    height: 15,
    marginRight: 10,
  },
  searchInput: {
    color:'black',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#fff8dc',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  addButton: {
    backgroundColor: 'yellow',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
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
    width: 20,
    height: 20,
    marginRight: 10,
  },
  modalText: {
    color: 'black',
    marginBottom: 5,
  },
  fieldImage: {
   width: 20,
   height: 20,
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
  addItemButton: {
    alignItems: 'center',
    backgroundColor: 'yellow',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 5,
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
    bottom: 100,
  },
   reportItemButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  reportButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  reportButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ST_FoundItemsScreen;