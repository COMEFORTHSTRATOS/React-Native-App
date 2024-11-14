import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ST_PrivacyPolicy = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.heading}>1. Information Collection and Use</Text>
      <Text style={styles.paragraph}>
        Our app collects certain information about students to provide and improve the service. This information may include students' names, email addresses, contact information, device information, and usage data. We use this information to personalize their experience, communicate with them, and enhance the functionality of the app.
      </Text>

      <Text style={styles.heading}>2. Data Security</Text>
      <Text style={styles.paragraph}>
        We prioritize the security of student data and employ industry-standard measures to protect it from unauthorized access, disclosure, alteration, or destruction. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
      </Text>

      <Text style={styles.heading}>3. Student Privacy</Text>
      <Text style={styles.paragraph}>
        Our app is designed to respect and protect student privacy. We do not knowingly collect personal information from students except as permitted by applicable laws and regulations or with parental consent. If you believe that we have inadvertently collected information from a student without proper consent, please contact us immediately, and we will take appropriate steps to address the situation.
      </Text>

      <Text style={styles.heading}>4. Third-Party Services</Text>
      <Text style={styles.paragraph}>
        Our app may contain links to third-party websites or services that are not operated by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites or services. We encourage students and parents to review the privacy policies of any third-party sites or services before providing any personal information.
      </Text>

      <Text style={styles.heading}>5. Changes to This Privacy Policy</Text>
      <Text style={styles.paragraph}>
        We may update our Privacy Policy from time to time. Any changes will be reflected on this page, and the effective date will be updated accordingly. We encourage users to review this Privacy Policy periodically for any changes. Your continued use of the app after the posting of changes to this Privacy Policy will constitute your acknowledgment of the modifications and your consent to abide and be bound by the updated Privacy Policy.
      </Text>

      <Text style={styles.footer}>
        This Privacy Policy was last updated on April 7, 2024. If you have any questions or concerns about our Privacy Policy, please contact us at info@tip.edu.ph.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff8dc',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: 'black',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
    marginTop: 10,
  },
  footer: {
    fontSize: 14,
    color: 'black',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default ST_PrivacyPolicy;
