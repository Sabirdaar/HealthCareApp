import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = () => {
        if (!email) {
            setMessage('Please enter your email.');
            return;
        }
        setMessage('Check your email for a link to reset your password.');
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineLarge" style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter your email to receive a reset link</Text>
            <TextInput 
                label="Email" 
                value={email} 
                onChangeText={setEmail} 
                mode="outlined" 
                style={styles.input} 
                placeholder="example@example.com"
            />
            <Button mode="contained" onPress={handleResetPassword} style={styles.button}>
                Reset Password
            </Button>
            {message ? <HelperText type="info" visible>{message}</HelperText> : null}
            
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.footerText}>
                    Remembered your password? <Text style={styles.linkText}>Log in</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2260FF',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: 'gray',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
        backgroundColor: 'white',
    },
    button: {
        marginTop: 10,
        backgroundColor: '#2260FF',
    },
    footerText: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 20,
    },
    linkText: {
        color: '#2260FF',
        fontWeight: 'bold',
    },
});

export default ForgotPassword;
