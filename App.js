import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Fixed the import for bottom tabs
import { FontAwesome } from '@expo/vector-icons'; // Add this import for FontAwesome

import { auth, onAuthStateChanged } from './src/constants/FireBaseConfig'; // Import Firebase Authentication

// Import existing screens (Authentication flow)
import WelcomeScreen from './src/screens/WelcomeScreen';
import AuthScreen from './src/screens/AuthScreen';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPassword from './src/screens/ForgotPassword';
import CreateAccount from './src/screens/CreateAccount';
import UserDataScreen from './src/screens/UserDataScreen';

// Import main app screens (After successful login)
import HomeScreen from './src/screens/HomeScreen';
import FindDoctorScreen from './src/screens/FindDoctorScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import UserInformationScreen from './src/screens/Profile/UserInformation';
import MedicalHistoryScreen from './src/screens/Profile/MedicalHistoryScreen';
import LifestyleScreen from './src/screens/Profile/LifestyleScreen';
import AppointmentsScreen from './src/screens/AppointmentsScreen';

// Import new additional screens (Health-related features)
import ChatScreen from './src/screens/ChatScreen';
import HealthTipsScreen from './src/screens/HealthTipsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import MedicalLibraryScreen from './src/screens/MedicalLibraryScreen';
import FirstAidScreen from './src/screens/FirstAidScreen';


LogBox.ignoreLogs([
  'Support for defaultProps will be removed from function components in a future major release.',
]);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [userData, setUserData] = useState(null); // Store user data directly here
  const [loading, setLoading] = useState(true); // Track loading state for user data

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUserData(firebaseUser); // Store Firebase user data if logged in
      } else {
        setUserData(null); // Clear user data if not logged in
      }
      setLoading(false); // Set loading to false after auth check
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  if (loading) {
    return null; // Or a loading screen, depending on your preference
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={userData ? "HomeScreen" : "WelcomeScreen"}>
          {/* Authentication Flow */}
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Reset Password' }} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} options={{ title: 'Create Account' }} />
          <Stack.Screen name="UserDataScreen" component={UserDataScreen} options={{ title: 'User Data' }} />
          {/* Main App Screens */}
          <Stack.Screen name="HomeScreen" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="DR.GPT" component={ChatScreen} options={{ title: 'DR. GPT' }} />
          <Stack.Screen name="AppointmentsScreen" component={AppointmentsScreen} options={{ title: 'R & M' }} />
          <Stack.Screen name="Nearby Hospitals" component={FindDoctorScreen} options={{ title: 'Find Nearby Hospitals' }} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Profile' }} />
          <Stack.Screen name="UserInformationScreen" component={UserInformationScreen} options={{ title: 'User Information' }} />
          <Stack.Screen name="MedicalHistoryScreen" component={MedicalHistoryScreen} options={{ title: 'Medical History Information' }} />
          <Stack.Screen name="LifestyleScreen" component={LifestyleScreen} options={{ title: 'Lifestyle' }} />
          <Stack.Screen name="EmergencyScreen" component={EmergencyScreen} options={{ title: 'Emergency' }} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }} />
          <Stack.Screen name="MedicalLibraryScreen" component={MedicalLibraryScreen} options={{ title: 'Medical Library' }} />
          <Stack.Screen name="FirstAidScreen" component={FirstAidScreen} options={{ title: 'First Aid' }} />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ title: 'Notification' }} />
          <Stack.Screen name="HealthTipsScreen" component={HealthTipsScreen} options={{ title: 'HealthTipsScreen' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

const Tabs = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#2270FF' },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#000',
        headerStyle: { backgroundColor: '#2260FF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
          headerShown: false,
          headerRight: () => (
            <FontAwesome
              name="cog"
              size={30}
              color="primary"
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate('SettingsScreen')} // Fixed typo
            />
          ),
        })}
      />
      <Tab.Screen
        name="DR. GPT"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="comments" color={color} size={size} />
          ),
          headerRight: () => (
            <FontAwesome
              name="cog"
              size={30}
              color="primary"
              style={{ margin: 15 }}
              onPress={() => navigation.navigate('SettingsScreen')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Reminders and Medications"
        component={AppointmentsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar" color={color} size={size} />
          ),
          headerRight: () => (
            <FontAwesome
              name="cog"
              size={30}
              color="primary"
              style={{ margin: 15 }}
              onPress={() => navigation.navigate('SettingsScreen')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Nearby Hospitals and Doctors"
        component={FindDoctorScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="hospital-o" color={color} size={size} />
          ),
          headerRight: () => (
            <FontAwesome
              name="cog"
              size={30}
              color="primary"
              style={{ margin: 15 }}
              onPress={() => navigation.navigate('SettingsScreen')}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default App;
