import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { Avatar, Text, Button, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { fetchDocumentById, updateDocument } from '../../constants/firebaseFunctions'; // Firebase functions
import { auth } from '../../constants/FireBaseConfig'; // Firebase Auth configuration

const MedicalHistoryScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    allergies: '',
    avatar: 'https://via.placeholder.com/100',
    chronicDiseases: '',
    familyHistory: '',
    genotype: '',
    medications: '',
    surgicalHistory: '',
    medicalConditions: '',
    bloodType: '',
    vaccinations: '',
    diseases: '', // Added Diseases field
    prescription: '', // Added Prescription field
  });

  useEffect(() => {
    const fetchMedicalHistoryData = async () => {
      try {
        const userId = auth.currentUser.uid; // Get the current user's ID
        const medicalHistoryData = await fetchDocumentById('medicalHistory', userId);
        if (medicalHistoryData) {
          setProfileInfo(medicalHistoryData);
        }
      } catch (error) {
        console.error('Error fetching medical history data:', error);
      }
    };

    fetchMedicalHistoryData();
  }, []);

  const handleInputChange = (key, value) => {
    setProfileInfo({ ...profileInfo, [key]: value });
  };

  const saveChanges = async () => {
    try {
      const userId = auth.currentUser.uid; // Get the current user's ID
      await updateDocument('medicalHistory', userId, profileInfo); // Update Firestore document
      Alert.alert('Success', 'Medical history updated successfully!');
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating medical history data:', error);
      Alert.alert('Error', 'Failed to update medical history. Please try again.');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need access to your photos to set a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileInfo({ ...profileInfo, avatar: result.assets[0].uri });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        <Avatar.Image size={100} source={{ uri: profileInfo.avatar }} />
        {isEditing && (
          <IconButton
            icon="camera"
            size={20}
            style={styles.cameraButton}
            onPress={pickImage}
          />
        )}
      </View>

      {/* Medical History Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical History</Text>

        {/* Allergies */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Allergies</Text>
          <TextInput
            style={styles.input}
            editable={isEditing}
            value={profileInfo.allergies}
            onChangeText={(text) => handleInputChange('allergies', text)}
          />
        </View>

        {/* Chronic Diseases */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Chronic Diseases</Text>
          <TextInput
            style={styles.input}
            editable={isEditing}
            value={profileInfo.chronicDiseases}
            onChangeText={(text) => handleInputChange('chronicDiseases', text)}
          />
        </View>

        {/* Family History */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Family History</Text>
          <TextInput
            style={styles.input}
            editable={isEditing}
            value={profileInfo.familyHistory}
            onChangeText={(text) => handleInputChange('familyHistory', text)}
          />
        </View>

        {/* Genotype */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Genotype</Text>
          <TextInput
            style={styles.input}
            editable={isEditing}
            value={profileInfo.genotype}
            onChangeText={(text) => handleInputChange('genotype', text)}
          />
        </View>

        {/* Medications */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Medications</Text>
          <TextInput
            style={styles.input}
            editable={isEditing}
            value={profileInfo.medications}
            onChangeText={(text) => handleInputChange('medications', text)}
          />
        </View>

        {/* Surgical History */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Surgical History</Text>
          <TextInput
            style={styles.input}
            editable={isEditing}
            value={profileInfo.surgicalHistory}
            onChangeText={(text) => handleInputChange('surgicalHistory', text)}
          />
        </View>

        {/* Medical Conditions */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Medical Conditions</Text>
          <TextInput
            style={styles.input}
            editable={isEditing}
            value={profileInfo.medicalConditions}
            onChangeText={(text) => handleInputChange('medicalConditions', text)}
          />
        </View>

        {/* Blood Type */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Blood Type</Text>
          <TextInput
            style={styles.input}
            editable={isEditing}
            value={profileInfo.bloodType}
            onChangeText={(text) => handleInputChange('bloodType', text)}
          />
        </View>

        {/* Vaccinations */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Vaccinations</Text>
          <TextInput
            style={styles.input}
            editable={isEditing}
            value={profileInfo.vaccinations}
            onChangeText={(text) => handleInputChange('vaccinations', text)}
          />
        </View>

        {/* Diseases */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Diseases</Text>
          <TextInput
            style={styles.input}
            editable={isEditing}
            value={profileInfo.diseases}
            onChangeText={(text) => handleInputChange('diseases', text)}
          />
        </View>

        {/* Prescription */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Prescription</Text>
          <TextInput
            style={styles.input}
            editable={isEditing}
            value={profileInfo.prescription}
            onChangeText={(text) => handleInputChange('prescription', text)}
          />
        </View>
      </View>

      {/* Edit and Save Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => {
            if (isEditing) {
              saveChanges();
            } else {
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ddd',
  },
  section: {
    width: '100%',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#2260FF',
    fontSize: 17,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  button: {
    marginBottom: 10,
    backgroundColor: '#2260FF',
  },
});

export default MedicalHistoryScreen;
