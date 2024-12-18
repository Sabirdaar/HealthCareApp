import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { TextInput, Button, Switch } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker'; // Updated Picker import
import { auth, firestore } from '../constants/FireBaseConfig'; // Ensure this import is correct
import { doc, setDoc } from 'firebase/firestore';

const UserDataScreen = ({ navigation }) => {
  const [currentStage, setCurrentStage] = useState(1);
  const [userData, setUserData] = useState({
    age: 0,
    createdAt: null,
    dateOfBirth: null,
    email: '',
    gender: '',
    height: 0,
    name: '',
    phoneNumber: 0,
    profilePic: '',
    updatedAt: null,
    weight: 0
  });
  
  const [lifestyleData, setLifestyleData] = useState({
    gender: '',
    exerciseFrequency: '',
    dietType: '',
    alcoholConsumption: false,
    smokingStatus: false,
    sleepHours: 0,
    smokes: false
  });

  const [medicalHistoryData, setMedicalHistoryData] = useState({
    allergies: [""],
    bloodType: "",
    chronicDiseases: [""],
    diseases: [""],
    familyHistory: {
      genotype: ""
    },
    medications: [""],
    precautions: [""]
  });

  const [loading, setLoading] = useState(false);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    // Retrieve and set the user data (email) if needed
    if (auth.currentUser) {
      setUserData(prevData => ({
        ...prevData,
        email: auth.currentUser.email
      }));
    }
  }, []);

  const handleNext = () => setCurrentStage((prev) => prev + 1);
  const handleBack = () => setCurrentStage((prev) => prev - 1);
  const handleSkip = () => setCurrentStage((prev) => prev + 1);


  const handleSubmit = async () => {
    if (userId) {
      setLoading(true);
      try {
        // Save user data to the 'users' collection
        await setDoc(doc(firestore, 'users', userId), {
          name: userData.name,
          email: userData.email,
          age: userData.age,
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender,
          height: userData.height,
          weight: userData.weight,
          phoneNumber: userData.phoneNumber,
          profilePic: userData.profilePic,
          createdAt: userData.createdAt || new Date(),
          updatedAt: userData.updatedAt || new Date(),
        });
  
        // Save lifestyle data to the 'lifestyle' collection
        await setDoc(doc(firestore, 'lifestyle', userId), {
          gender: lifestyleData.gender,
          exerciseFrequency: lifestyleData.exerciseFrequency,
          dietType: lifestyleData.dietType,
          alcoholConsumption: lifestyleData.alcoholConsumption,
          smokingStatus: lifestyleData.smokingStatus,
          sleepHours: lifestyleData.sleepHours,
          smokes: lifestyleData.smokes,
        });
  
        // Save medical history data to the 'medicalHistory' collection
        await setDoc(doc(firestore, 'medicalHistory', userId), {
          bloodType: medicalHistoryData.bloodType,
          familyHistory: {
            genotype: medicalHistoryData.familyHistory.genotype,
          },
          allergies: medicalHistoryData.allergies,
          diseases: medicalHistoryData.diseases,
          chronicDiseases: medicalHistoryData.chronicDiseases,
          medications: medicalHistoryData.medications,
          precautions: medicalHistoryData.precautions,
        });
  
        // Show success message and navigate to another screen
        Alert.alert('Submission Successful', 'Your details have been submitted!');
        navigation.navigate('HomeScreen');
      } catch (error) {
        console.error('Error submitting data: ', error);
        Alert.alert('Error', 'There was an issue saving your data.');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'No user ID found.');
    }
  };
  

  const handleInputChange = (type, field, value) => {
    if (type === 'userData') {
      setUserData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else if (type === 'lifestyleData') {
      setLifestyleData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else if (type === 'medicalHistoryData') {
      setMedicalHistoryData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const renderStage = () => {
    switch (currentStage) {
      case 1: // Lifestyle
        return (
          <View style={styles.stageContainer}>
            <Text style={styles.stageHeader}>Lifestyle and Personal Information</Text>

            <TextInput
              label="Gender"
              value={lifestyleData.gender}
              onChangeText={(text) => handleInputChange('lifestyleData', 'gender', text)}
              style={styles.input}
            />

            <Picker
              selectedValue={lifestyleData.exerciseFrequency}
              onValueChange={(value) => handleInputChange('lifestyleData', 'exerciseFrequency', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Exercise Frequency" value="" />
              <Picker.Item label="None" value="None" />
              <Picker.Item label="Rarely" value="Rarely" />
              <Picker.Item label="Weekly" value="Weekly" />
              <Picker.Item label="Daily" value="Daily" />
            </Picker>

            <TextInput
              label="Diet Type"
              value={lifestyleData.dietType}
              onChangeText={(text) => handleInputChange('lifestyleData', 'dietType', text)}
              style={styles.input}
            />

            <View style={styles.switchContainer}>
              <Text>Do you consume alcohol?</Text>
              <Switch
                value={lifestyleData.alcoholConsumption}
                onValueChange={(value) => handleInputChange('lifestyleData', 'alcoholConsumption', value)}
                color="#2260FF"
              />
            </View>

            <View style={styles.switchContainer}>
              <Text>Do you smoke?</Text>
              <Switch
                value={lifestyleData.smokingStatus}
                onValueChange={(value) => handleInputChange('lifestyleData', 'smokingStatus', value)}
                color="#2260FF"
              />
            </View>

            <TextInput
              label="Daily Sleep Hours"
              value={String(lifestyleData.sleepHours)}
              onChangeText={(text) => handleInputChange('lifestyleData', 'sleepHours', Number(text))}
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
        );

      case 2: // Medical History
        return (
          <View style={styles.stageContainer}>
            <Text style={styles.stageHeader}>Medical History</Text>

            <TextInput
              label="Blood Type"
              value={medicalHistoryData.bloodType}
              onChangeText={(text) => handleInputChange('medicalHistoryData', 'bloodType', text)}
              style={styles.input}
            />

            <TextInput
              label="Genotype"
              value={medicalHistoryData.familyHistory.genotype}
              onChangeText={(text) => handleInputChange('medicalHistoryData', 'familyHistory.genotype', text)}
              style={styles.input}
            />

            <TextInput
              label="Allergies"
              value={medicalHistoryData.allergies.join(', ')}
              onChangeText={(text) => handleInputChange('medicalHistoryData', 'allergies', text.split(','))}
              style={styles.input}
            />

            <TextInput
              label="Diseases"
              value={medicalHistoryData.diseases.join(', ')}
              onChangeText={(text) => handleInputChange('medicalHistoryData', 'diseases', text.split(','))}
              style={styles.input}
            />

            <TextInput
              label="Chronic Diseases"
              value={medicalHistoryData.chronicDiseases.join(', ')}
              onChangeText={(text) => handleInputChange('medicalHistoryData', 'chronicDiseases', text.split(','))}
              style={styles.input}
            />

            <TextInput
              label="Medications"
              value={medicalHistoryData.medications.join(', ')}
              onChangeText={(text) => handleInputChange('medicalHistoryData', 'medications', text.split(','))}
              style={styles.input}
            />
          </View>
        );

      case 3: // Review & Submit
        return (
          <View style={styles.stageContainer}>
            <Text style={styles.stageHeader}>Review & Submit</Text>

            <Text style={styles.summaryText}>All your details are ready for submission.</Text>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={[styles.button, styles.submitButton]}
            >
              Submit
            </Button>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {renderStage()}

      <View style={styles.buttonContainer}>
        {currentStage > 1 && (
          <Button mode="outlined" onPress={handleBack} style={styles.button}>
            Back
          </Button>
        )}
        {currentStage < 3 && (
          <>
            <Button mode="text" onPress={handleSkip} style={styles.button}>
              Skip
            </Button>
            <Button mode="contained" onPress={handleNext} style={styles.button}>
              Next
            </Button>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  stageContainer: {
    marginBottom: 20,
  },
  stageHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2260FF',
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#F5F7FA',
  },
  picker: {
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 70,
  },
  button: {
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 8,
    backgroundColor: '#2260FF',
  },
  submitButton: {
    backgroundColor: '#34C759',
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default UserDataScreen;
