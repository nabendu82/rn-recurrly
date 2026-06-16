import { Link, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const SubscriptionDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>()
    return (
        <View>
            <Text>Subscription Details : {id} </Text>
            <Link href="/" className='text-white bg-primary px-6 py-3 mt-4 rounded-full'>Back</Link>
        </View>
    )
}

export default SubscriptionDetails