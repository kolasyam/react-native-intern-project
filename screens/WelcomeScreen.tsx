import {Button, Text, View, StyleSheet} from 'react-native';
import React from 'react';

const WelcomeScreen = (props: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome</Text>
      <View style={{marginBottom: 10}}>
        <Button
          title="Go to SignUp Page"
          onPress={() => props.navigation.navigate('SignupScreen')}
        />
      </View>
      <Button
        title="Go to LogIn Page"
        onPress={() => props.navigation.navigate('LoginScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
});

export default WelcomeScreen;
