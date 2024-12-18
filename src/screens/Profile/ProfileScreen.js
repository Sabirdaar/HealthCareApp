// import React, { useState } from 'react';
// import {StyleSheet, View, TextInput, Alert, ScrollView, Switch, TouchableOpacity,} from 'react-native';
// import { Avatar, Text, Button, IconButton } from 'react-native-paper';
// import * as ImagePicker from 'expo-image-picker';
// import { deleteUser } from 'firebase/auth'; // Firebase function to delete user
// import { auth } from '../constants/FireBaseConfig'; // Your Firebase auth configuration

// const ProfileScreen = ({ navigation }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [expandedSections, setExpandedSections] = useState({
//     medicalHistory: false,
//     lifestyle: false,
//     symptoms: false,
//   });

//   const [profileInfo, setProfileInfo] = useState({
//     // Personal Information
//     name: 'Jane Doe',
//     gender: 'Female',
//     dateOfBirth: '1990-01-01',
//     email: 'jane.doe@example.com',
//     phone: '+123 456 7890',
//     height: '170 cm',
//     weight: '65 kg',
//     smokes: false,
//     drinksAlcohol: false,
//     avatar: 'https://via.placeholder.com/100', // Default avatar

//     // Medical History
//     userId: '123456',
//     chronicDiseases: 'None',
//     allergies: 'None',
//     medications: 'None',
//     surgicalHistory: 'None',
//     familyHistory: 'None',

//     // Lifestyle
//     exerciseFrequency: 'Daily',
//     dietType: 'Balanced',
//     lifestyleNotes: 'No additional notes',

    
//   });

//   const handleInputChange = (key, value) => {
//     setProfileInfo({ ...profileInfo, [key]: value });
//   };

//   const toggleSection = (section) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission denied', 'We need access to your photos to set a profile picture.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setProfileInfo({ ...profileInfo, avatar: result.assets[0].uri });
//     }
//   };

//   const handleDeleteAccount = async () => {
//     Alert.alert(
//       'Delete Account',
//       'Are you sure you want to delete your account? This action cannot be undone.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const user = auth.currentUser;
//               if (user) {
//                 await deleteUser(user); // Firebase delete user
//                 Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
//                 navigation.navigate('LoginScreen'); // Redirect to the login screen
//               } else {
//                 Alert.alert('Error', 'No user is currently logged in.');
//               }
//             } catch (error) {
//               Alert.alert('Error', 'Failed to delete account. Please try again.');
//               console.error('Delete Account Error:', error);
//             }
//           },
//         },
//       ]
//     );
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Avatar Section */}
//       <View style={styles.avatarContainer}>
//         <Avatar.Image size={100} source={{ uri: profileInfo.avatar }} />
//         {isEditing && (
//           <IconButton
//             icon="camera"
//             size={20}
//             style={styles.cameraButton}
//             onPress={pickImage}
//           />
//         )}
//       </View>

//       {/* Personal Information */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Personal Information</Text>
//         {['name', 'gender', 'dateOfBirth', 'email', 'phone', 'height', 'weight'].map((field) => (
//           <View style={styles.fieldContainer} key={field}>
//             <Text style={styles.label}>{field.replace(/([A-Z])/g, ' $1')}</Text>
//             <TextInput
//               style={styles.input}
//               editable={isEditing}
//               value={profileInfo[field]}
//               onChangeText={(text) => handleInputChange(field, text)}
//             />
//           </View>
//         ))}
//         {/* Smokes and Drinks */}
//         {['smokes', 'drinksAlcohol'].map((field) => (
//           <View style={styles.switchContainer} key={field}>
//             <Text style={styles.label}>
//               {field === 'smokes' ? 'Smokes?' : 'Drinks Alcohol?'}
//             </Text>
//             <Switch
//               value={profileInfo[field]}
//               onValueChange={(value) => handleInputChange(field, value)}
//               disabled={!isEditing}
//             />
//           </View>
//         ))}
//       </View>

//       {/* Medical History, Lifestyle, Symptoms Sections */}
//       {/* ... (unchanged sections for medicalHistory, lifestyle, and symptoms) ... */}

//       {/* Edit/Save and Delete Account Buttons */}
//       <View style={styles.buttonContainer}>
//         <Button
//           mode="contained"
//           style={styles.button}
//           onPress={() => setIsEditing(!isEditing)}
//         >
//           {isEditing ? 'Save Changes' : 'Edit Profile'}
//         </Button>
//         <Button
//           mode="contained"
//           style={styles.deleteButton}
//           onPress={handleDeleteAccount}
//         >
//           Delete Account
//         </Button>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   avatarContainer: {
//     position: 'relative',
//   },
//   cameraButton: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#ddd',
//   },
//   section: {
//     width: '100%',
//     marginTop: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   fieldContainer: {
//     marginBottom: 10,
//   },
//   label: {
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   input: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     paddingBottom: 5,
//     marginTop: 5,
//   },
//   switchContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     width: '100%',
//   },
//   button: {
//     marginBottom: 10,
//     backgroundColor: '#2260FF',
//   },
//   deleteButton: {
//     backgroundColor: '#FF5733',
//   },
// });

// export default ProfileScreen;



import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import {Button} from "react-native-paper";
import { deleteUser } from 'firebase/auth'; // Firebase function to delete user
import { auth } from '../../constants/FireBaseConfig'; // Your Firebase auth configuration

const ProfileScreen = () => {
  const navigation = useNavigation();

  //data for the navigation targets
  const menuItems = [
    { title: "Personal Information", screen: "UserInformationScreen" },
    { title: "Lifestyle Information", screen: "LifestyleScreen" },
    { title : "Medical History", screen: "MedicalHistoryScreen"}
  ];

   const handleDeleteAccount = async () => {
     Alert.alert(
       'Delete Account',
       'Are you sure you want to delete your account? This action cannot be undone.',
       [
         { text: 'Cancel', style: 'cancel' },
         {
           text: 'Delete',
           style: 'destructive',
           onPress: async () => {
             try {
               const user = auth.currentUser;
               if (user) {
                 await deleteUser(user);  //Firebase delete user
                 Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
                 navigation.navigate('LoginScreen');  //Redirect to the login screen
               } else {
                 Alert.alert('Error', 'No user is currently logged in.');
               }
             } catch (error) {
               Alert.alert('Error', 'Failed to delete account. Please try again.');
               console.error('Delete Account Error:', error);
             }
           },
         },
       ]
      );
    };

  // Render sections
  const renderSection = (title, items) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.itemContainer}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Text style={styles.itemText}>{item.title}</Text>
          <Icon name="chevron-forward-outline" size={24} color="#4A90E2" />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <Text style={styles.profileName}>S. Adnan</Text>
      </View>

      {/* Section */}
      {renderSection("User Data", menuItems)}

      <Button
           mode="contained"
           style={styles.deleteButton}
           onPress={handleDeleteAccount}
         >
           Delete Account
         </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: "#4A90E2",
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "600",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333333",
    marginTop: 10,
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A90E2",
    marginBottom: 5,
  },
  itemContainer: {
    backgroundColor: "#EAF2FF",
    paddingVertical: 25,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center", 
  },  
  itemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  deleteButton: {
    height: 40,
    marginTop: 150,
    marginBottom: 10,
    backgroundColor: '#FF4C4C',
    width: "50%",
    alignSelf: 'center',
    marginBottom: 0,
  },
});

export default ProfileScreen;
