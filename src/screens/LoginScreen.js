import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, HelperText, IconButton } from 'react-native-paper';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const handleLogin = () => {
        if (!email || !password) {
            setErrorMessage('Please fill in both fields.');
            return;
        }
        console.log('Logging in with:', { email, password });
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineLarge" style={styles.title}>Log In</Text>
            <Text style={styles.subtitle}>Welcome Back</Text>
            {errorMessage ? <HelperText type="error" visible>{errorMessage}</HelperText> : null}
            
            <TextInput 
                label="Email" 
                value={email} 
                onChangeText={setEmail} 
                mode="outlined" 
                style={styles.input} 
                placeholder="example@example.com"
            />
            <View style={styles.passwordContainer}>
                <TextInput 
                    label="Password" 
                    secureTextEntry={secureTextEntry} 
                    value={password} 
                    onChangeText={setPassword} 
                    mode="outlined" 
                    style={[styles.input, styles.passwordInput]} 
                    right={<TextInput.Icon icon={secureTextEntry ? "eye-off" : "eye"}
                            onPress={()=> setSecureTextEntry(!secureTextEntry)}
                    />}
                    placeholder="**********"
                />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <Button mode="contained" onPress={handleLogin/*() => navigation.navigate('HomeScreen')*/} style={styles.loginButton}>
                Log In 
            </Button>
            
            
            <Text style={styles.orText}>or Sign in with</Text>
            
            <View style={styles.socialContainer}>
                <IconButton icon="google" size={30} style={styles.socialIcon} onPress={() => console.log('Google Sign-In')} />
                <IconButton icon="facebook" size={30} style={styles.socialIcon} onPress={() => console.log('Facebook Sign-In')} />
                <IconButton icon="fingerprint" size={30} style={styles.socialIcon} onPress={() => console.log('Fingerprint Sign-In')} />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
                <Text style={styles.signUpText}>
                    Don’t have an account?{'  '}<Text style={styles.signUpLink}>Sign Up</Text>
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
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2260FF',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#2260FF',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
    },
    forgotPassword: {
        textAlign: 'right',
        color: '#2260FF',
        marginBottom: 20,
        fontSize: 12,
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

export default LoginScreen;
