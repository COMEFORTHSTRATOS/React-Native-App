import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const ST_TermsofService = () => {

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>I. Introduction</Text>
      <Text style={styles.paragraph}>
        These Terms of Service govern your use of the School Lost and Found Mobile app operated by T.I.P. Quezon City (referred to as "the App" or "our service"). By accessing or using the App, you agree to be bound by these Terms of Service.
      </Text>

      <Text style={styles.sectionTitle}>II. User Accounts</Text>
      <Text style={styles.paragraph}>
        To use certain features of the App, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use or security breaches of your account.
      </Text>

      <Text style={styles.sectionTitle}>III. Content</Text>
      <Text style={styles.paragraph}>
        The App allows users to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are solely responsible for the Content you post, and you agree not to post any Content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another's privacy, or otherwise objectionable.
      </Text>

      <Text style={styles.sectionTitle}>IV. Intellectual Property</Text>
      <Text style={styles.paragraph}>
        The App and its original content, features, and functionality are owned by T.I.P. Quezon City and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
      </Text>

      <Text style={styles.sectionTitle}>V. Disclaimer</Text>
      <Text style={styles.paragraph}>
        The App is provided "as is" and "as available" without warranties of any kind, whether express or implied. T.I.P. Quezon City does not warrant that the App will function uninterrupted, secure, or error-free. Your use of the App is at your own risk.
      </Text>

      <Text style={styles.sectionTitle}>VI. Limitation of Liability</Text>
      <Text style={styles.paragraph}>
        In no event shall T.I.P. Quezon City be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the App.
      </Text>

      <Text style={styles.sectionTitle}>VII. Governing Law</Text>
      <Text style={styles.paragraph}>
        These Terms of Service shall be governed by and construed in accordance with the laws of [Your Country], without regard to its conflict of law provisions.
      </Text>

      <Text style={styles.sectionTitle}>VIII. Changes</Text>
      <Text style={styles.paragraph}>
        T.I.P. Quezon City reserves the right, at its sole discretion, to modify or replace these Terms of Service at any time. By continuing to access or use the App after any revisions become effective, you agree to be bound by the revised terms.
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: 'black', // Set text color to black
  },
  paragraph: {
    fontSize: 15,
    marginBottom: 15,
    color: 'black', // Set text color to black
  }
});

export default ST_TermsofService;
