import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { EditGalleryScreen } from '../screens/EditGalleryScreen';
import { OnboardingEditGalleryScreen } from '../screens/OnboardingGalleryEdit'
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { useProfile } from '../contexts/profile';

const Stack = createNativeStackNavigator()

export default function ProfileNavigator(){
    const { profile: { onboarded } } = useProfile()

    return (
        <Stack.Navigator initialRouteName={ onboarded ? 'Edit Profile' : 'Onboarding' }>
            <Stack.Screen name="Edit Profile" component={EditProfileScreen}/>
            <Stack.Screen name="Edit Gallery" component={EditGalleryScreen}/>
            <Stack.Screen name="Onboarding" component={OnboardingScreen}/>
            <Stack.Screen name="Create Your Gallery" component={OnboardingEditGalleryScreen}/>
        </Stack.Navigator>
    )
}
