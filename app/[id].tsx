import { View, Text, Image } from 'react-native'
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
    </View>
  )
}

export default EventPage