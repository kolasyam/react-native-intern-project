import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignUpScreen';
import WelcomeScreen from './screens/WelcomeScreen';
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{
            headerStyle: {
              backgroundColor: 'skyblue',
            },
            headerTitleStyle: {
              fontSize: 30,
            },
          }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerStyle: {
              backgroundColor: 'skyblue',
            },
            headerTitleStyle: {
              fontSize: 30,
            },
          }}
        />
        <Stack.Screen
          name="SignupScreen"
          component={SignupScreen}
          options={{
            headerStyle: {
              backgroundColor: 'skyblue',
            },
            headerTitleStyle: {
              fontSize: 30,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
