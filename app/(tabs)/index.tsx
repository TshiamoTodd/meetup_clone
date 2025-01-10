import { Stack } from 'expo-router';
import { ActivityIndicator, Alert, FlatList, View } from 'react-native';
import EventListItem from '~/components/EventListItem';
import { supabase } from '~/utils/supabase';
import { useEffect, useState } from 'react';

export default function Events() {
  const [events, setEvents] = useState<any[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const {data, error} = await supabase.from('event').select('*');

      if (error) {
        setError(error.message);
      }

      setEvents(data);
    } catch (err: any) {
      setError(err.message);
      Alert.alert(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Events' }} />
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='gray' />
        </View>
      </>
    )
    
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      {/* Event list item */}
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <EventListItem event={item} />
        )}
        className='bg-gray-100'
      />
      
    </>
  );
}
