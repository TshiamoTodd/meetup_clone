import { View, Text, Image, Pressable, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, Stack, Link } from 'expo-router'
import events from '~/assets/events.json'
import dayjs from 'dayjs'
import { supabase } from '~/utils/supabase'
import { useAuth } from '~/context/AuthProvider'

interface Event {
  id: string;
  image_uri: string;
  title: string;
  date: string;
  description: string;
  location: string;
}

const EventPage = () => {
  const {id} = useLocalSearchParams()
  const {user} = useAuth()

  const [loading, setLoading] = useState(false)
  const [attendance, setAttendance] = useState(null)
  const [event, setEvent] = useState<Event | null>(null);

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const {data, error} = await supabase.from('event')
        .select('*')
        .eq('id', id)
        .single()

        setEvent(data)

        const {data: attendanceData, error: attendanceError} = await supabase.from('attendance')
        .select('*')
        .eq('user_id', user?.id)
        .eq('event_id', id)
        .single()

        setAttendance(attendanceData)
      
      console.log(data)
    } catch (error) {
      Alert.alert(error as string)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvent()
  }, [id])

  const joinEvent = async () => {
    try {
      const {data, error} = await supabase.from('attendance').insert({
        event_id: event?.id,
        user_id: user?.id
      })
      .select()
      .single()

      setAttendance(data)
    } catch (error) {
      Alert.alert(error as string)
    }
  }


  if(loading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' color='gray' />
      </View>
    )
  }

  return (
    <View className='p-3 bg-gray-100 flex-1 gap-3'>
      <Stack.Screen options={{title: 'Event', headerTintColor: 'black'}} />
      <Image
          source={{uri: event?.image_uri}}
          className='w-full aspect-video rounded-xl'
      />
      <Text numberOfLines={2} className='text-3xl font-bold'>
          {event?.title}
      </Text>
      <Text className='text-lg font-semibold uppercase text-amber-800'> 
          {dayjs(event?.date).format('ddd, D MMM')}, · {dayjs(event?.date).format('h:mm A')}
      </Text>
      <Text numberOfLines={2} className='text-lg'>
          {event?.description}
      </Text>
      <Text numberOfLines={2} className='text-lg'>
          {event?.location}
      </Text>

      <Link href={`/event/${event?.id}/attendance`}>
        View Attendance
      </Link>

      {/* Footer */}
      <View className='absolute bottom-0 left-0 right-0 p-5 pb-10 border-t border-gray-400 flex-row justify-between items-center'>
        <Text className='font-semibold text-xl'>Free</Text>

        {attendance 
            ? (
                <Text className='text-green-500 font-bold'>
                  You are attending
                </Text> 
            )
          : (
                <Pressable className='bg-red-400 p-5 px-8 rounded-lg' onPress={joinEvent}>
                  <Text className='text-lg font-bold text-white'>Join and RSVP</Text>
                </Pressable>
            )
          }
      </View>
    </View>
  )
}

export default EventPage