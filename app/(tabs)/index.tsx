import { Stack } from 'expo-router';
import { FlatList, Image, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import EventListItem from '~/components/EventListItem';
import events from '~/assets/events.json';

export default function Events() {
  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      {/* Event list item */}
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <EventListItem event={item} />
        )}
        keyExtractor={(item) => item.id}
        className='bg-gray-100'
      />
      
    </>
  );
}
