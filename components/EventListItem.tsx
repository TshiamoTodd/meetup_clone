import { View, Text, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons'
import dayjs from 'dayjs'
import { Link } from 'expo-router';
import { supabase } from '~/utils/supabase';

interface EventProps {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    image_uri: string;
}


export default function EventListItem({event} : {event: EventProps}) {
    const [numberOfAtendees, setNumberOfAtendees] = useState(0)

    const fetchNumberOfAtendees = async () => {
        try {
            const {count} = await supabase.from('attendance')
            .select('*', {count: 'exact', head: true})
            .eq('event_id', event.id)

            setNumberOfAtendees(count ?? 0)
        } catch (error) {
            
        }
    }

    useEffect(() => {
        fetchNumberOfAtendees()
    }, [event.id])
    return (
        <Link href={`/event/${event.id}`} asChild>
            <Pressable className='m-3 pb-3 gap-3 border-b border-gray-400'>
                <View className='flex-row '>
                <View className='flex-1 gap-1 pr-3'>
                    <Text className='text-lg font-semibold uppercase text-amber-800'> 
                        {dayjs(event.date).format('ddd, D MMM')}, · {dayjs(event.date).format('h:mm A')}
                    </Text>
                    <Text numberOfLines={2} className='text-xl font-bold'>
                        {event.title}
                    </Text>
                    <Text className='text-gray-700 mt-2'>
                        {event.location}
                    </Text>
                </View>

                {/* Image Here */}
                <Image
                    source={{uri: event.image_uri}}
                    className='w-2/5 aspect-video rounded-md'
                />
                </View>

                {/* Footer */}
                <View className='flex flex-row gap-3'>
                    <Text className='text-gray-700 mr-auto'>{numberOfAtendees} going</Text>
                    <Feather name="share" size={20} color="gray" />
                    <Feather name="bookmark" size={20} color="gray" />
                </View>
            </Pressable>
        </Link>
    )
}