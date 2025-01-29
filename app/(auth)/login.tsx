import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function Login() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

 async function signInWithEmail() {
   const { error } = await supabase.auth.signInWithPassword({
     email,
     password,
   });
   if (error) console.error(error);
 }

 async function signUpWithEmail() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
 
    if (error) {
      if (error.message.includes('User already registered')) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) console.error(signInError);
      } else {
        console.error(error);
      }
    }
  }

 return (
   <KeyboardAvoidingView
     style={styles.container}
     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
   >
     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
       <View style={styles.innerContainer}>
         <Text style={styles.title}>VidAI</Text>
         <View style={styles.formContainer}>
           <TextInput
             style={styles.input}
             placeholder="Email"
             placeholderTextColor="#888"
             value={email}
             onChangeText={setEmail}
             autoCapitalize="none"
           />
           <TextInput
             style={styles.input}
             placeholder="Password"
             placeholderTextColor="#888"
             value={password}
             onChangeText={setPassword}
             secureTextEntry
           />
           <TouchableOpacity 
             style={styles.button}
             onPress={signUpWithEmail}
           >
             <Text style={styles.buttonText}>Sign In/Sign UP</Text>
           </TouchableOpacity>
           {/* <TouchableOpacity 
             style={[styles.button, styles.secondaryButton]}
             onPress={signUpWithEmail}
           >
             <Text style={styles.buttonText}>Sign Up</Text>
           </TouchableOpacity> */}
         </View>
       </View>
     </TouchableWithoutFeedback>
   </KeyboardAvoidingView>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#151718',
 },
 innerContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   padding: 20,
 },
 title: {
   fontSize: 32,
   fontWeight: 'bold',
   color: '#fff', // Dark purple color
   textAlign: 'center',
   marginBottom: 100, // Adjusted to move it lower
 },
 formContainer: {
   width: '100%',
   alignItems: 'center',
 },
 input: {
   width: '100%',
   height: 50,
   borderWidth: 1,
   borderColor: '#ccc',
   borderRadius: 5,
   marginBottom: 10,
   paddingHorizontal: 10,
   color: 'white', // Set text color to white
 },
 button: {
   backgroundColor: '#151718',
   padding: 15,
   borderRadius: 5,
   width: '100%',
   alignItems: 'center',
   marginBottom: 10,
   marginTop: 50,
   borderColor: 'white',
   borderWidth: 1, // Add border width
 },
 secondaryButton: {
   backgroundColor: '#333',
 },
 buttonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: 'bold',
 },
});

