import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import { TextInput, Button, Text, HelperText, IconButton } from 'react-native-paper';
import * as Google from 'expo-auth-session/providers/google';
import { auth, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from '../constants/FireBaseConfig';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "447271841764-iprvi87262sg9lt7tusooake3pls5mo4.apps.googleusercontent.com",
    iosClientId: "447271841764-aigi29l7g4sei3am2h3su1o2q7r1ghmh.apps.googleusercontent.com",
    webClientId: "447271841764-mf51gagkja359ncsger6r5f2qlrs77c5.apps.googleusercontent.com",
  });

  // Handle Google sign-in response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log('User signed in with Google', userCredential.user);
          navigation.navigate('HomeScreen');
        })
        .catch((error) => {
          console.error('Google Sign-In error:', error);
          setErrorMessage('Google login failed. Please try again.');
        });
    }
  }, [response]);

  // Handle Google login button click
  const handleGoogleLogin = async () => {
    if (request) {
      setErrorMessage('');
      try {
        await promptAsync();
      } catch (error) {
        console.error("Google login failed", error);
        setErrorMessage('Google login failed. Please try again.');
      }
    } else {
      console.log("Google request not available.");
    }
  };


// Handle email and password login with specific error handling
const handleLogin = async () => {
  if (!email || !password) {
    setErrorMessage('Please fill in both fields.');
    return;
  }

  setLoading(true);
  setErrorMessage('');
  Keyboard.dismiss();

  try {
    // Ensure auth object is correctly initialized
    if (!auth) {
      throw new Error('Authentication service is not initialized.');
    }

    // Attempt Firebase email/password login
    await signInWithEmailAndPassword(auth, email, password);
    navigation.navigate('HomeScreen');
  } catch (error) {
    console.error("Login error:", error);

    // Display specific error messages based on Firebase error codes
    switch (error.code) {
      case 'auth/wrong-password':
        setErrorMessage('Incorrect password. Please try again.');
        break;
      case 'auth/user-not-found':
        setErrorMessage('No account found with this email.');
        break;
      case 'auth/invalid-credential':
        setErrorMessage('Invalid credentials. Please check your email and password.');
        break;
      case 'auth/invalid-email':
        setErrorMessage('Please enter a valid email address.');
        break;
      default:
        setErrorMessage('Login failed. Please try again later.');
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>Log In</Text>
      <Text style={styles.subtitle}>Welcome Back</Text>

      {errorMessage && <HelperText type="error" visible>{errorMessage}</HelperText>}

      <TextInput 
        label="Email" 
        value={email} 
        onChangeText={setEmail} 
        mode="outlined" 
        style={styles.input}
        placeholder="example@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
        error={errorMessage.includes("email")}
      />

      <TextInput 
        label="Password" 
        secureTextEntry={secureTextEntry} 
        value={password} 
        onChangeText={setPassword} 
        mode="outlined" 
        style={styles.input}
        placeholder="********"
        right={<TextInput.Icon icon={secureTextEntry ? "eye-off" : "eye"} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
        error={errorMessage.includes("password")}
      />

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <Button 
        mode="contained" 
        onPress={handleLogin} 
        style={styles.loginButton} 
        disabled={loading}
      >
        {loading ? <ActivityIndicator size="small" color="#FFF" /> : "Log In"}
      </Button>

      <Text style={styles.orText}>or Sign in with</Text>

      <View style={styles.socialContainer}>
        <IconButton 
          icon="google" 
          size={30} 
          style={styles.socialIcon} 
          onPress={handleGoogleLogin} 
          disabled={loading || !request}
        />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={styles.signUpText}>Don’t have an account? <Text style={styles.signUpLink}>Sign Up</Text></Text>
      </TouchableOpacity>
    </View>
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
  subtitle: {
    fontSize: 16,
    color: '#2260FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
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
    color: '#2260FF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
