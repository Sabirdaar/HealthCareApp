import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text, ActivityIndicator } from 'react-native';
import { TextInput, Button, HelperText, IconButton } from 'react-native-paper';
import CountryPicker from 'react-native-country-picker-modal';
import { createUserWithEmailAndPassword, googleSignIn, auth } from '../constants/FireBaseConfig';

const CreateAccount = ({ navigation }) => {
  // State management
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' });
  const [countryCode, setCountryCode] = useState('US');
  const [phoneCode, setPhoneCode] = useState('1');
  const [errors, setErrors] = useState({});
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  // Validation logic
  const validateFields = () => {
    const newErrors = {};
    if (!fullName) newErrors.fullName = 'Full Name is required';
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Enter a valid email address';
    if (!password || password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!mobileNumber) newErrors.mobileNumber = 'Enter a valid mobile number';
    if (!birthDate.day || !birthDate.month || !birthDate.year) newErrors.dateOfBirth = 'Date of Birth is required';

    const birthDateObj = new Date(`${birthDate.year}-${birthDate.month}-${birthDate.day}`);
    const today = new Date();
    if (birthDateObj >= today) newErrors.dateOfBirth = 'Date of Birth must be in the past';

    if (birthDate.day === '0' || birthDate.day > 31) newErrors.dateOfBirth = 'Invalid day';
    if (birthDate.month === '0' || birthDate.month > 12) newErrors.dateOfBirth = 'Invalid month';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAccount = async () => {
    if (validateFields()) {
      setLoading(true);
      setErrors({});
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        // Pass user data (email, full name) to next screen
        navigation.navigate('UserDataScreen', {
          email,
          fullName,
          mobileNumber,
          birthDate,
          countryCode,
          phoneCode,
        });
      } catch (error) {
        console.error('Account creation error:', error);
        if (error.code === 'auth/email-already-in-use') {
          setErrors((prev) => ({ ...prev, email: 'This email is already registered.' }));
        } else if (error.code === 'auth/invalid-email') {
          setErrors((prev) => ({ ...prev, email: 'Please provide a valid email address.' }));
        } else if (error.code === 'auth/weak-password') {
          setErrors((prev) => ({ ...prev, password: 'Password should be stronger.' }));
        } else {
          setErrors((prev) => ({ ...prev, email: 'An unexpected error occurred. Please try again.' }));
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await googleSignIn();
      navigation.navigate('UserDataScreen');
    } catch (error) {
      setErrors((prev) => ({ ...prev, google: 'Google Sign-In failed. Please try again.' }));
    } finally {
      setLoading(false);
    }
  };

  // Country selection handler
  const onCountrySelect = (country) => {
    setCountryCode(country.cca2);
    setPhoneCode(country.callingCode[0]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.title}>Create New Account</Text>

        {/* Full Name Input */}
        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            setErrors((prev) => ({ ...prev, fullName: null }));
          }}
          mode="outlined"
          style={styles.input}
          error={!!errors.fullName}
        />
        {errors.fullName && <HelperText type="error">{errors.fullName}</HelperText>}

        {/* Email Input */}
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors((prev) => ({ ...prev, email: null }));
          }}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          error={!!errors.email}
        />
        {errors.email && <HelperText type="error">{errors.email}</HelperText>}

        {/* Password Input */}
        <TextInput
          label="Password"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors((prev) => ({ ...prev, password: null }));
          }}
          mode="outlined"
          style={styles.input}
          error={!!errors.password}
          right={<TextInput.Icon icon={secureTextEntry ? 'eye-off' : 'eye'} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
        />
        {errors.password && <HelperText type="error">{errors.password}</HelperText>}

        {/* Confirm Password Input */}
        <TextInput
          label="Confirm Password"
          secureTextEntry={secureTextEntry}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setErrors((prev) => ({ ...prev, confirmPassword: null }));
          }}
          mode="outlined"
          style={styles.input}
          error={!!errors.confirmPassword}
          right={<TextInput.Icon icon={secureTextEntry ? 'eye-off' : 'eye'} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
        />
        {errors.confirmPassword && <HelperText type="error">{errors.confirmPassword}</HelperText>}

        {/* Mobile Number with Country Picker */}
        <View style={styles.phoneContainer}>
          <CountryPicker
            withFilter
            withFlag
            withCallingCode
            countryCode={countryCode}
            onSelect={onCountrySelect}
            containerButtonStyle={{
              borderRadius: 10,
              paddingVertical: 1,
              paddingHorizontal: 7,
            }}
          />
          <Text style={styles.phoneCode}>+{phoneCode}</Text>
          <TextInput
            value={mobileNumber}
            onChangeText={(text) => {
              setMobileNumber(text);
              setErrors((prev) => ({ ...prev, mobileNumber: null }));
            }}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            style={styles.phoneInput}
            error={!!errors.mobileNumber}
          />
        </View>

        {errors.mobileNumber && <HelperText type="error">{errors.mobileNumber}</HelperText>}

        {/* Date of Birth Inputs */}
        <View style={styles.dateOfBirthContainer}>
          <TextInput
            label="Day"
            value={birthDate.day}
            onChangeText={(text) => setBirthDate({ ...birthDate, day: text })}
            mode="outlined"
            style={styles.dateInput}
            keyboardType="numeric"
          />
          <TextInput
            label="Month"
            value={birthDate.month}
            onChangeText={(text) => setBirthDate({ ...birthDate, month: text })}
            mode="outlined"
            style={styles.dateInput}
            keyboardType="numeric"
          />
          <TextInput
            label="Year"
            value={birthDate.year}
            onChangeText={(text) => setBirthDate({ ...birthDate, year: text })}
            mode="outlined"
            style={styles.dateInput}
            keyboardType="numeric"
          />
        </View>
        {errors.dateOfBirth && <HelperText type="error">{errors.dateOfBirth}</HelperText>}

        {/* Sign-Up Button */}
        <Button
          mode="contained"
          onPress={handleCreateAccount}
          style={styles.signupButton}
          loading={loading}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>

        {/* Google Sign-In Button */}
        <Text style={styles.orText}>or sign up with</Text>
        <View style={styles.socialContainer}>
          <IconButton icon="google" size={30} style={styles.socialIcon} onPress={handleGoogleSignIn} />
        </View>

        {/* Navigation to Login */}
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.signUpText}>
            Already have an account? <Text style={styles.signUpLink}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2260FF',
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    marginBottom: 12,
  },
  signupButton: {
    backgroundColor: '#2260FF',  
    borderRadius: 25,
    paddingVertical: 10,
    marginBottom: 20,
    marginTop: 25,
    elevation: 5,  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  orText: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialIcon: {
    backgroundColor: '#9BBFFF',
    marginHorizontal: 10,
    borderRadius: 50,
  },
  signUpText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
  },
  signUpLink: {
    color: '#2260FF',
    fontWeight: 'bold',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F5F7FA', 
    borderRadius: 12,  
    paddingHorizontal: 4, 
    paddingVertical: 2,   
    borderWidth: 1,
    borderColor: '#D1D1D1', 
  },
  
  phoneCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2260FF', 
    marginRight: 8,
  },
  
  phoneInput: {
    flex: 1,
    backgroundColor: '#D5E9FF',
    paddingVertical: 4,  
    paddingLeft: 6,
    borderRadius: 15, 
    fontSize: 15, 
    color: '#333',
    borderWidth: 1,
    borderColor: '#D1D1D1',  
  },
  
  phoneInputFocused: {
    borderColor: '#2260FF', // Blue border when focused
  },
  
  
});

export default CreateAccount;


