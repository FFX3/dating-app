import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { EditGalleryScreen } from '../screens/EditGalleryScreen';

const Stack = createNativeStackNavigator()

export default function ProfileNavigator(){
    return (
        <Stack.Navigator initialRouteName='Edit Profile'>
            <Stack.Screen name="Edit Profile" component={EditProfileScreen}/>
            <Stack.Screen name="Edit Gallery" component={EditGalleryScreen}/>
        </Stack.Navigator>
    )
}
