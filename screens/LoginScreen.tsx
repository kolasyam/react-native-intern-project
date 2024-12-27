import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
type LoginValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const LoginScreen: React.FC = (props: any) => {
  const [loginError, setLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const initialValues: LoginValues = {
    email: '',
    password: '',
    rememberMe: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleLogin = async (values: LoginValues, {resetForm}: any) => {
    try {
      const storedData = await AsyncStorage.getItem('userCredentials');
      if (storedData) {
        const {email, password} = JSON.parse(storedData);
        if (values.email === email && values.password === password) {
          Alert.alert('Login Successful', `Welcome back ${email}`);
          setLoginError('');
          resetForm();
          if (rememberMe) {
            await AsyncStorage.setItem(
              'rememberedUser',
              JSON.stringify({email: values.email}),
            );
          } else {
            await AsyncStorage.removeItem('rememberedUser');
          }
          setRememberMe(false);
        } else {
          setLoginError('Email and password do not match.');
        }
      } else {
        setLoginError('No stored credentials found. Please sign up first.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve data from local storage');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Page</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => handleLogin(values, actions)}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            {loginError ? (
              <Text style={styles.errorText}>{loginError}</Text>
            ) : null}
            <BouncyCheckbox
              size={25}
              fillColor="blue"
              unFillColor="#FFFFFF"
              text="Remember Me"
              iconStyle={{borderColor: '#ccc'}}
              textStyle={{textDecorationLine: 'none'}}
              isChecked={rememberMe}
              onPress={(isChecked: boolean) => setRememberMe(isChecked)}
            />
            <View style={styles.marginbottom}>
              <Button title="Login" onPress={handleSubmit as any} />
            </View>
            <Button
              title="Go to SignUp Page"
              onPress={() => props.navigation.navigate('SignupScreen')}
            />
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
  },
  marginbottom: {
    marginBottom: 10,
  },
});

export default LoginScreen;
