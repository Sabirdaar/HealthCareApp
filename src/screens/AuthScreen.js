import React from "react";
import { StyleSheet, Image, Text, View, TouchableOpacity } from "react-native";
import Colors from '../constants/Colors';


const AuthScreen = ({ navigation }) => {
  return (
    <View style={styles.Register}>
      <View style={styles.Picture}>
        <Image
          style={styles.Logo}
          source={require('../../assets/logo.png')}
        />
        <Text style={styles.AppName}>Mobile Health Care App</Text>
        <Text style={styles.AppText}>Health Advice Application</Text>
      </View>

      <Text style={styles.DescriptionText}>
        Dummy text, we are working on the app. This is just a proposed design
        subject to further edits. LOL! Based on what that Salih guy says, sigh!
      </Text>

      <TouchableOpacity
        style={styles.ButtonLogin}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Text style={styles.ButtonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.ButtonSignUp}
        onPress={() => navigation.navigate('CreateAccount')}
      >
        <Text style={styles.ButtonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        styles={styles.ButtonText}
        onPress={() => navigation.navigate('CreateAccount')}
        >
            <Text style={styles.ButtonText}>Proceed Without an account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  Register: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  Picture: {
    alignItems: "center",
    marginTop: 170,
    marginBottom: 100,
    padding: 20,
  },
  Logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    color: '#2260FF',
  },
  AppName: {
    color: Colors.primaryColor,
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  AppText: {
    color: Colors.primaryColor,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
    marginTop: 20,
  },
  DescriptionText: {
    color: Colors.primaryColor,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 30,
  },
  ButtonLogin: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 25,
    width: "80%",
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  ButtonSignUp: {
    backgroundColor: "#9BBFFF",
    borderRadius: 25,
    width: "80%",
    paddingVertical: 10,
    alignItems: "center",
  },
  ButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AuthScreen;
