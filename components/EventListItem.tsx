import { View, Text, Image } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import dayjs from 'dayjs'

interface EventProps {
    id: string;
    title: string;
    description: string;
    datetime: string;
    location: string;
    image: string;
}


export default function EventListItem({event} : {event: EventProps}) {
    return (
        <View className='m-3 pb-3 gap-3 border-b border-gray-400'>
            <View className='flex-row '>
            <View className='flex-1 gap-1 pr-3'>
                <Text className='text-lg font-semibold uppercase text-amber-800'> 
                    {dayjs(event.datetime).format('ddd, D MMM')}, · {dayjs(event.datetime).format('h:mm A')}
                </Text>
                <Text numberOfLines={2} className='text-xl font-bold'>
                    {event.title}
                </Text>
                <Text className='text-gray-700'>
                    {event.location}
                </Text>
            </View>

            {/* Image Here */}
            <Image
                source={{uri: event.image}}
                className='w-2/5 aspect-video rounded-md'
            />
            </View>

            {/* Footer */}
            <View className='flex flex-row gap-3'>
                <Text className='text-gray-700 mr-auto'>16 going</Text>
                <Feather name="share" size={20} color="gray" />
                <Feather name="bookmark" size={20} color="gray" />
            </View>
        </View>
    )
}