import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, IconButton } from 'react-native-paper';
import CountryPicker from 'react-native-country-picker-modal';

const CreateAccount = ({ navigation }) => {
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

    const handleCreateAccount = () => {
        if (validateFields()) {
            const fullMobileNumber = `+${phoneCode}${mobileNumber}`;
            console.log('Creating account for:', { fullName, email, fullMobileNumber, birthDate });
            // Add account creation logic here
        }
    };

    const onCountrySelect = (country) => {
        setCountryCode(country.cca2);
        setPhoneCode(country.callingCode[0]);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <Text style={styles.title}>Create New Account</Text>

                <TextInput
                    label="Full Name"
                    value={fullName}
                    onChangeText={(text) => {
                        setFullName(text);
                        setErrors((prev) => ({ ...prev, fullName: null }));
                    }}
                    mode="outlined"
                    style={styles.input}
                    placeholder="Full Name"
                    error={!!errors.fullName}
                />
                {errors.fullName && <HelperText type="error">{errors.fullName}</HelperText>}

                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        setErrors((prev) => ({ ...prev, email: null }));
                    }}
                    mode="outlined"
                    style={styles.input}
                    placeholder="example@example.com"
                    keyboardType="email-address"
                    error={!!errors.email}
                />
                {errors.email && <HelperText type="error">{errors.email}</HelperText>}

                <TextInput
                    label="Password"
                    secureTextEntry={secureTextEntry}
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    style={styles.input}
                    placeholder="**********"
                    error={!!errors.password}
                />
                {errors.password && <HelperText type="error">{errors.password}</HelperText>}

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
                    placeholder="**********"
                    error={!!errors.confirmPassword}
                />
                {errors.confirmPassword && <HelperText type="error">{errors.confirmPassword}</HelperText>}

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

                <View style={styles.dateOfBirthContainer}>
                    <TextInput
                        label="Day"
                        value={birthDate.day}
                        onChangeText={(text) => setBirthDate({ ...birthDate, day: text })}
                        mode="outlined"
                        style={styles.dateInput}
                        keyboardType="numeric"
                        placeholder="DD"
                    />
                    <TextInput
                        label="Month"
                        value={birthDate.month}
                        onChangeText={(text) => setBirthDate({ ...birthDate, month: text })}
                        mode="outlined"
                        style={styles.dateInput}
                        keyboardType="numeric"
                        placeholder="MM"
                    />
                    <TextInput
                        label="Year"
                        value={birthDate.year}
                        onChangeText={(text) => setBirthDate({ ...birthDate, year: text })}
                        mode="outlined"
                        style={styles.dateInput}
                        keyboardType="numeric"
                        placeholder="YYYY"
                    />
                </View>
                {errors.dateOfBirth && <HelperText type="error">{errors.dateOfBirth}</HelperText>}

                <Button mode="contained" onPress={handleCreateAccount} style={styles.loginButton}>
                    Sign Up
                </Button>

                <Text style={styles.orText}>or sign up with</Text>
                <View style={styles.socialContainer}>
                    <IconButton icon="google" size={30} style={styles.socialIcon} onPress={() => {}} />
                    <IconButton icon="facebook" size={30} style={styles.socialIcon} onPress={() => {}} />
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.signUpText}>
                        Already have an account? <Text style={styles.signUpLink}>Log in</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

// Styles for CreateAccount
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2260FF',
        textAlign: 'center',
        marginBottom: 10,
    },
    input: {
        marginBottom: 15,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#d3bbea13',
        borderRadius: 5,
        padding: 8,
        borderWidth: .5,
        borderTop: '#00000025',
        borderBottom: '#00000015',
        borderLeft: '#00000015',
        borderRight: '#00000023',
    },
    phoneCode: {
        marginHorizontal: 10,
        fontSize: 16,
        color: '#0e004e',
         
        
    },
    phoneInput: {
        flex: 1,  
        backgroundColor: null ,
        borderBottomColor: null,
    },
    dateOfBirthContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    dateInput: {
        flex: 1,
        marginHorizontal: 5,
    },
    loginButton: {
        backgroundColor: '#2260FF',
        borderRadius: 25,
        paddingVertical: 10,
        marginBottom: 20,
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
        textAlign: 'center',
        fontSize: 17,
        color: '#2260FF',
        fontWeight: 'bold',
    },
});

export default CreateAccount;
