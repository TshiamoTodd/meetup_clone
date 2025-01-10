import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, Pressable, Text } from 'react-native'
import { supabase } from '~/utils/supabase'
import { Button, TextInput } from 'react-native'
import { router, Stack } from 'expo-router'
import { Feather } from '@expo/vector-icons'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loadingSignUp, setLoadingSignUp] = useState(false)
  const [loadingSignIn, setLoadingSignIn] = useState(false)

  async function signInWithEmail() {
    try {
      setLoadingSignIn(true)
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) Alert.alert(error.message)

      setLoadingSignIn(false)
      router.push('/')
    } catch (error) {
      Alert.alert(error as string)
    }
  }

  async function signUpWithEmail() {
    try {
      setLoadingSignUp(true)
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      })

      if (error) Alert.alert(error.message)
      if (!session) Alert.alert('Please check your inbox for email verification!')
        setLoadingSignUp(false)
    } catch (error) {
      Alert.alert(error as string)
    }
  }



  return (
    <View className='p-5 pt-10 bg-gray-100 flex-1 gap-3'>
      <Stack.Screen options={{title: 'Sign in', headerTintColor: 'black'}} />
      <TextInput
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="email@address.com"
        autoCapitalize={'none'}
        className='border p-3 border-gray-300 rounded-md'
      />
      <TextInput
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
        autoCapitalize={'none'}
        className='border p-3 border-gray-300 rounded-md'
      />
      <View className='flex-row gap-2'>
          <Pressable 
              className='rounded-md border border-red-500 p-3 px-8 flex-1 items-center justify-center'
              onPress={() => signInWithEmail()}
              disabled={loadingSignIn}
          >
              {loadingSignIn 
                ? <Feather className='animate-spin' name="loader" size={20} color="red" /> 
                : <Text className='text-lg font-bold text-red-500'>Sign In</Text>
              }
          </Pressable>
          <Pressable 
              className='rounded-md bg-red-500 p-3 px-8 flex-1 items-center justify-center'
              onPress={() => signUpWithEmail()}
              disabled={loadingSignUp}
          >
              {loadingSignUp 
                ? <Feather className='animate-spin' name="loader" size={20} color="white" /> 
                : <Text className='text-lg font-bold text-white'>Sign Up</Text>
              }
          </Pressable>
      </View>
    </View>
  )
}