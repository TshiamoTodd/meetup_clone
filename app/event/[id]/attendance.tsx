import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { supabase } from '~/utils/supabase'

const EventAttendance = () => {
    const {id} = useLocalSearchParams()
    const [attendees, setAttendees] = useState<any[] | null>([])

    const fetchNumberOfAtendees = async () => {
        try {
            const {data} = await supabase.from('attendance')
            .select('*, profiles(*)')
            .eq('event_id', id)

            setAttendees(data)
            console.log(data)
        } catch (error) {
            
        }
    }

    useEffect(() => {
        fetchNumberOfAtendees()
    }, [id])
    return (
        <>
            <Stack.Screen options={{title: 'Attendance', headerTintColor: 'black'}} />
            <FlatList
                data={attendees}
                renderItem={({ item }) => (
                    <View className='p-3'>
                        <Text className='font-bold'>{item.profiles.full_name || 'User'}</Text>
                    </View>
                )}
            />
        </>
    )
}

export default EventAttendance