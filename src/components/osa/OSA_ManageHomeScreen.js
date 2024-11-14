import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/firestore'

const OSA_ManageHomeScreen = () => {
  const [osaName, setOSAName] = useState(''); // State to hold student name

  useEffect(() => {
    // Fetch student data from Firestore
    const fetchOSAName = async () => {
      try {
        const userId = firebase.auth().currentUser.uid; // Get current user ID
        const userDoc = await firebase.firestore().collection('osa').doc(userId).get(); // Fetch user document
        if (userDoc.exists) {
          const userData = userDoc.data(); // Get user data
          const { firstName, lastName } = userData; // Extract first name and last name
          setOSAName(`${firstName} ${lastName}`); // Set student name state
        } else {
          console.log('OSA data not found');
        }
      } catch (error) {
        console.error('Error fetching OSA data:', error);
      }
    };

    fetchOSAName(); // Call the fetch function
  }, []); // Empty dependency array ensures the effect runs only once after initial render


  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeMessage}>Welcome, {osaName}!</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Image
          source={require('../../assets/home/osa_banner.png')}
          style={styles.banner}
          resizeMode="contain"
        />
        <Text style={styles.sectionText}>The Technological Institute of the Philippines (T.I.P.) is committed to promote the health, safety and general well-being of its students.</Text>
        <Text style={styles.sectionText}>With the COVID-19 Pandemic, T.I.P. extends its student affairs and services to all T.I.P. Senior High School and College students online.</Text>
        <Text style={styles.sectionTitle}>T.I.P. Online Student Affairs</Text>
        <Text style={styles.sectionText}>This is where you can formally seek assistance about academic and non-academic related concerns from the assigned OSA personnel. We like these concerns looked into and resolved with positive outcomes.</Text>
        <Text style={styles.sectionText}>Consultation Hours: Monday to Friday | 8:00am - 5:00pm</Text>
        <Text style={styles.sectionText}>All messages and conversations shall be treated with utmost confidentiality.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8dc',
    paddingHorizontal: 10,
  },
  welcomeContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  welcomeMessage: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  banner: {
    width: '100%',
    height: '24%', // Adjust height as needed
    marginBottom: 10,
  },
  sectionHeader: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 16,
    marginLeft: 10,
    color: 'black',
  },
  sectionText: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 10,
    color: 'black',
  },
});

export default OSA_ManageHomeScreen;