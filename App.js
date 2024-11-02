import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import WelcomeScreen from './src/screens/WelcomeScreen';
import AuthScreen from './src/screens/AuthScreen';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPassword from './src/screens/ForgotPassword';
import CreateAccount from './src/screens/CreateAccount';
import HomeScreen from './src/screens/HomeScreen';


const Stack = createStackNavigator();

const App = () => {
    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="WelcomeScreen">
                    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}
                    options={{ headerShown: false }}
                    />
                    <Stack.Screen name="AuthScreen" component={AuthScreen}
                    options={{ headerShown: false }}
                    />
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                    <Stack.Screen name="CreateAccount" component={CreateAccount} />
                    <Stack.Screen name="HomeScreen" component={HomeScreen}
                    options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
};

export default App;
