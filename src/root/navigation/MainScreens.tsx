import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { EditProfileScreen } from '../../profile/screens/EditProfileScreen';
import { EditGalleryScreen } from '../../profile/screens/EditGalleryScreen';
import { useProfile } from '../../profile/contexts/profile';
import AvailabilityNavigator from '../../availabilities/navigation/AvailabilityNavigator';
import { MatcherScreen } from '../../matcher/screens/matcherScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ViewProfileScreen } from '../../profile/screens/ViewProfileScreen';
import { ContactsScreen } from '../../messager/screens/ContactsSceen';
import { ThreadScreen } from '../../messager/screens/ThreadScreen';
import { Pressable, Text } from 'react-native';

const AccountStack = createNativeStackNavigator()

function AccountSection(){
    return <AccountStack.Navigator>
        <AccountStack.Screen name="Edit Profile" component={EditProfileScreen}/>
        <AccountStack.Screen name="Edit Gallery" component={EditGalleryScreen}/>
        <AccountStack.Screen name="Availabilites" component={AvailabilityNavigator}/>
        <MatcherStack.Group screenOptions={{ 
            headerShown: false,
            presentation: 'modal',
        }}>
            <MatcherStack.Screen name="Preview" component={ViewProfileScreen}/>
        </MatcherStack.Group>
    </AccountStack.Navigator>
}

const MatcherStack = createNativeStackNavigator()

function MatcherSection(){
    return <MatcherStack.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <MatcherStack.Screen name="Queue" component={MatcherScreen}/>
        <MatcherStack.Group screenOptions={{ presentation: 'modal' }}>
            <MatcherStack.Screen name="Profile" component={ViewProfileScreen}/>
        </MatcherStack.Group>
    </MatcherStack.Navigator>
}

const MessagerStack = createNativeStackNavigator()

function MessagerSection() {
    return <MessagerStack.Navigator>
       <MessagerStack.Screen name='Contacts' component={ContactsScreen} /> 
       <MessagerStack.Screen 
            options={
                ({ route, navigation }) => ({ 
                    title: route.params.profile.name ,
                    headerRight: ()=><Pressable
                        onPress={()=>{
                            navigation.navigate('Messager', {
                                screen: 'ContactProfile',
                                params: { profile: route.params.profile }
                            })
                        }}
                    >
                        <Text>Profile</Text>
                    </Pressable>
                })
            }
            name='Thread' 
            component={ThreadScreen} 
        /> 
        <MatcherStack.Group screenOptions={{ 
            presentation: 'modal',
            headerShown: false
        }}>
            <MatcherStack.Screen name="ContactProfile" component={ViewProfileScreen}/>
        </MatcherStack.Group>
    </MessagerStack.Navigator>
}


const Tab = createBottomTabNavigator()

export default function MainNavigator(){
    const { profile: { onboarded }, markOnboarded } = useProfile()

    function finishOnboarding(navigation){
        markOnboarded()
        navigation.reset({
            index: 0,
            routes: [{ name: 'Edit Profile' }]
        })
    }

    return (
        <SafeAreaProvider>
            <Tab.Navigator 
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName={ onboarded ? 'Matcher' : 'Onboarding' }
            >
                <Tab.Screen name='Account' component={AccountSection} />
                <Tab.Screen name="Matcher" component={MatcherSection}/>
                <Tab.Screen name="Messager" component={MessagerSection}/>
            </Tab.Navigator>
        </SafeAreaProvider>
    )
}
