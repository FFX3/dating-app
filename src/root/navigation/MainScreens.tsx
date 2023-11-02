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
import { Button, Pressable, SafeAreaView, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { DiscoverExperiencesScreen } from '../../interests/screens/DiscoverExperiencesScreen';
import { YourInterestsScreen } from '../../interests/screens/YourInterestsScreen';
import { ViewExperienceDetailsScreen } from '../../interests/screens/ViewExperienceDetailsScreen';
import { Profile } from '../../onboarding/screens/Profile';
import { Availability } from '../../onboarding/screens/Availabilities';

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
                    headerRight: ()=><Button
                        onPress={()=>{
                            navigation.navigate('Messager', {
                                screen: 'ContactProfile',
                                params: { profile: route.params.profile }
                            })
                        }}
                        title='Profile'
                    />
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

const ExperienceTab = createMaterialTopTabNavigator()
const ExperienceStack = createNativeStackNavigator()

function ExperienceMainSection() {
    return <ExperienceTab.Navigator>
                <ExperienceTab.Screen name='Discover' component={DiscoverExperiencesScreen} />
                <ExperienceTab.Screen name='Your Interests' component={YourInterestsScreen} />
            </ExperienceTab.Navigator>
}

function ExperienceSection() {
    return <SafeAreaView style={{
            height: '100%'
        }}
        >
        <ExperienceStack.Navigator 
            screenOptions={{
                headerShown: false,
            }}
        >
            <ExperienceStack.Screen name='Main' component={ExperienceMainSection} />
            <ExperienceStack.Group screenOptions={{ presentation: 'modal' }}>
                <ExperienceStack.Screen name="Details" component={ViewExperienceDetailsScreen}/>
            </ExperienceStack.Group>
        </ExperienceStack.Navigator>
    </SafeAreaView>
}


const Tab = createBottomTabNavigator()
const OnboardingStack = createNativeStackNavigator()

export default function MainNavigator(){
    const { profile, markOnboarded } = useProfile()

    return (
        <SafeAreaProvider>
            { !!profile?.onboaded ?
                <Tab.Navigator 
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    <Tab.Screen name="Matcher" component={MatcherSection}/>
                    <Tab.Screen name='Account' component={AccountSection} />
                    <Tab.Screen name="Messager" component={MessagerSection}/>
                    <Tab.Screen name="Experiences" component={ExperienceSection}/>
                </Tab.Navigator>
            :
                <OnboardingStack.Navigator>
                   <OnboardingStack.Screen name='Profile' component={Profile} />
                   <OnboardingStack.Screen name='Availabilities' component={Availability} options={({ navigation })=>{
                       return {
                           headerRight: ()=><Button title='Next' onPress={()=>navigation.navigate('Experiences')} />
                       }
                    }}/>
                   <OnboardingStack.Screen name='Experiences' component={ExperienceSection} options={({ navigation })=>{
                       return {
                           headerRight: ()=><Button title='Next' onPress={()=>navigation.navigate('Gallery')} />
                       }
                    }}/>
                   <OnboardingStack.Screen name='Gallery' component={EditGalleryScreen} options={()=>{
                       return {
                           headerRight: ()=><Button title='Done' onPress={markOnboarded} />
                       }
                    }}/>
                </OnboardingStack.Navigator>
            }
        </SafeAreaProvider>
    )
}
