import { Stack } from 'expo-router';
import { Image, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import EventListItem from '~/components/EventListItem';
import events from '~/assets/events.json';

export default function Events() {
  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      {/* Event list item */}
      <EventListItem
        event={events[0]}
      />
      <EventListItem
        event={events[1]}
      />
      <EventListItem
        event={events[2]}
      />
      
    </>
  );
}
