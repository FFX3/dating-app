import React, { useState } from 'react'
import { View } from 'react-native';
import { useProfile } from '../contexts/profile';
import EditableProfileImageGallery from '../components/EditableProfileImageGallery';
import { Button } from 'react-native';
import { Snackbar } from 'react-native-paper';

export function OnboardingEditGalleryScreen({ navigation }) {
    const { profile: { gallery, }, markOnboarded  } = useProfile()
    const images = gallery.map((uri, id)=>{
        return { image: { uri }, id, }
    })

    const [helpText, setHelpText] = useState<boolean | string>(false)
    

    function exit(){
        if(gallery.length == 0) {
            setHelpText('Add at least one image to your profile')
            return
        }
        navigation.navigate('Availabilites')
    }

    return (
    <>
        <View style={{ gap: 20, alignItems: 'center' }}>
            <EditableProfileImageGallery />
            <Button 
                title='Complete Profile'
                onPress={exit}
            />
        </View>
            <Snackbar
                visible={ !!helpText }
                onDismiss={ ()=>setHelpText(false) }
            >
            { helpText }
            </Snackbar>
    </>
    )
}
