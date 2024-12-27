import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
const calculatePasswordStrength = (password: string) => {
  if (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password)
  ) {
    return 'Strong';
  } else if (password.length >= 6) {
    return 'Moderate';
  } else {
    return 'Weak';
  }
};

type SignUpValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpScreen: React.FC = (props: any) => {
  const [passwordStrength, setPasswordStrength] = useState('');

  const initialValues: SignUpValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
      .test('strength', 'Password is too weak', value => {
        if (!value) {
          return false;
        }
        return calculatePasswordStrength(value) !== 'Weak';
      }),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const handleSignUp = async (values: SignUpValues, {resetForm}: any) => {
    try {
      await AsyncStorage.setItem(
        'userCredentials',
        JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      );
      const storedData = await AsyncStorage.getItem('userCredentials');
      if (storedData) {
        const {email, password} = JSON.parse(storedData);
        console.warn(`Email: ${email}\nPassword: ${password}`);
      } else {
        console.warn('No stored credentials found.');
      }
      // Alert.alert('Sign Up Successful', `Welcome, ${values.name}!`);
      resetForm(); // Reset form values
      setPasswordStrength('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save data to local storage');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SignUp Page</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => handleSignUp(values, actions)}>
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
              placeholder="Name"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

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
              onChangeText={text => {
                handleChange('password')(text);
                setPasswordStrength(calculatePasswordStrength(text));
              }}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <Text style={styles.passwordStrength}>
              Password Strength: {passwordStrength}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
            <View style={{marginBottom: 10}}>
              <Button title="Sign Up" onPress={handleSubmit as any} />
            </View>
            <Button
              title="Already have an account"
              onPress={() => props.navigation.navigate('LoginScreen')}
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
  passwordStrength: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
