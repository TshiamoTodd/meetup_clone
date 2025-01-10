import { Stack } from 'expo-router';
import { Alert, Button, Pressable, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/context/AuthProvider';
import Feather from '@expo/vector-icons/Feather';

export default function Home() {
  const {session} = useAuth()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const {  data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, full_name`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
        setFullName(data.full_name)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
    full_name,
  }: {
    username: string
    website: string
    avatar_url: string
    full_name: string
  }) {
    try {
      console.log(loading)
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        full_name,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
      console.log(loading)
    }
  } 

  return (
    <View className='bg-gray-100 p-5 flex-1 gap-3'>
      <Stack.Screen options={{ title: 'Profile' }} />
      <TextInput
        editable={false}
        value={session!.user?.email}
        placeholder="email"
        autoCapitalize={'none'}
        className='border p-3 border-gray-300 rounded-md text-gray-500'
      />
      <TextInput
        onChangeText={(text) => setFullName(text)}
        value={fullName}
        placeholder="full name"
        autoCapitalize={'none'}
        className='border p-3 border-gray-300 rounded-md'
      />
      <TextInput
        onChangeText={(text) => setUsername(text)}
        value={username}
        placeholder="username"
        autoCapitalize={'none'}
        className='border p-3 border-gray-300 rounded-md'
      />

      <TextInput
        onChangeText={(text) => setWebsite(text)}
        value={website}
        placeholder="website"
        autoCapitalize={'none'}
        className='border p-3 border-gray-300 rounded-md'
      />

      <Pressable 
          className='rounded-md border border-red-500 p-3 px-8 items-center justify-center'
          onPress={() => updateProfile({username, website, avatar_url: avatarUrl, full_name: fullName})}
          disabled={loading}
      >
          {loading 
            ? <Feather className='animate-spin' name="loader" size={20} color="red" /> 
            : <Text className='text-lg font-bold text-red-500'>Save</Text>
          }
      </Pressable>
      <Pressable
        onPress={() => supabase.auth.signOut()}
        className='rounded-md bg-red-500 p-5 px-8 items-center justify-center'
      >
        <Text className='text-white'>Sign Out</Text>
      </Pressable>
    </View>
  );
}
