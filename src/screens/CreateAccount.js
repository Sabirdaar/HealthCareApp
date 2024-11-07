import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text, ActivityIndicator } from 'react-native';
import { TextInput, Button, HelperText, IconButton } from 'react-native-paper';
import CountryPicker from 'react-native-country-picker-modal';
import { createUserWithEmail, googleSignIn } from '../constants/FireBaseConfig';

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

    // Account creation handler
    const handleCreateAccount = async () => {
        if (validateFields()) {
            setLoading(true);
            setErrors({});
            try {
                await createUserWithEmail(email, password, {
                    fullName,
                    mobileNumber: `+${phoneCode}${mobileNumber}`,
                    birthDate: `${birthDate.day}/${birthDate.month}/${birthDate.year}`,
                });
                navigation.navigate('HomeScreen');
            } catch (error) {
                setErrors((prev) => ({ ...prev, email: 'Email is already in use or invalid' }));
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
            navigation.navigate('HomeScreen');
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
                    style={styles.loginButton}
                    loading={loading}
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>

                {/* Error Message for Google Sign-In */}
                {errors.google && <HelperText type="error">{errors.google}</HelperText>}

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
    // styles remain the same as in your original code
});

export default CreateAccount;
