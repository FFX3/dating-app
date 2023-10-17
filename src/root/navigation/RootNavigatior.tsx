import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EditProfileScreen } from '../../profile/screens/EditProfileScreen';
import { EditGalleryScreen } from '../../profile/screens/EditGalleryScreen';
import { OnboardingEditGalleryScreen } from '../../profile/screens/OnboardingGalleryEdit'
import { OnboardingScreen } from '../../profile/screens/OnboardingScreen';
import { useProfile } from '../../profile/contexts/profile';
import AvailabilityNavigator from '../../availabilities/navigation/AvailabilityNavigator';
import { MatcherScreen } from '../../matcher/screens/matcherScreen';

const Stack = createNativeStackNavigator()

export default function RootNavigator(){
    const { profile: { onboarded }, markOnboarded } = useProfile()

    function finishOnboarding(navigation){
        markOnboarded()
        navigation.reset({
            index: 0,
            routes: [{ name: 'Edit Profile' }]
        })
    }

    return (
        <Stack.Navigator 
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={ onboarded ? 'Matcher' : 'Onboarding' }
        >
            <Stack.Screen name="Edit Profile" component={EditProfileScreen}/>
            <Stack.Screen name="Edit Gallery" component={EditGalleryScreen}/>
            <Stack.Screen name="Onboarding" component={OnboardingScreen}/>
            <Stack.Screen name="Create Your Gallery" component={OnboardingEditGalleryScreen}/>
            <Stack.Screen name="Availabilites" component={AvailabilityNavigator}/>
            <Stack.Screen name="Matcher" component={MatcherScreen}/>
        </Stack.Navigator>
    )
}
