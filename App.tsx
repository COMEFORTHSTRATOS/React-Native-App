import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from 'firebase/compat/app'; // Import Firebase compat SDK
import 'firebase/compat/auth'; // Import Auth service for authentication features
import 'firebase/compat/storage';
import { firebaseConfig } from './firebaseConfig'; // Import configuration from separate file
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import OSA_LoginScreen from './src/components/osa/OSA_LoginScreen.js';
import OSAAppNavigator from './src/screens/OSAAppNavigator';
import ST_LoginScreen from './src/components/student/ST_LoginScreen.js';
import StudentAppNavigator from './src/screens/StudentAppNavigator';

const App = () => {

  const Stack = createStackNavigator();

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />  {/* Register Screen */}

        <Stack.Screen name="OSA_LoginScreen" component={OSA_LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OSAView" component={OSAAppNavigator} options={{ headerShown: false }} />

        <Stack.Screen name="ST_LoginScreen" component={ST_LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StudentView" component={StudentAppNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;