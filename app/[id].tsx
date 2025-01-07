import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { useLocalSearchParams, Stack } from 'expo-router'
import events from '~/assets/events.json'
import dayjs from 'dayjs'

const EventPage = () => {
  const {id} = useLocalSearchParams()

  const event = events.find(event => event.id === id)

  if(!event) {
    return <Text>Event not found</Text>
  }

  return (
    <View className='p-3 bg-gray-100 flex-1 gap-3'>
      <Stack.Screen options={{title: 'Event', headerTintColor: 'black'}} />
      <Image
          source={{uri: event.image}}
          className='w-full aspect-video rounded-xl'
      />
      <Text numberOfLines={2} className='text-3xl font-bold'>
          {event.title}
      </Text>
      <Text className='text-lg font-semibold uppercase text-amber-800'> 
          {dayjs(event.datetime).format('ddd, D MMM')}, · {dayjs(event.datetime).format('h:mm A')}
      </Text>
      <Text numberOfLines={2} className='text-lg'>
          {event.description}
      </Text>

      {/* Footer */}
      <View className='absolute bottom-0 left-0 right-0 p-5 pb-10 border-t border-gray-400 flex-row justify-between items-center'>
        <Text className='font-semibold text-xl'>Free</Text>

        <Pressable className='bg-red-400 p-5 px-8 rounded-lg'>
          <Text className='text-lg font-bold text-white'>Join and RSVP</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default EventPage