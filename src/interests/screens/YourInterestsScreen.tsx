import React from 'react'
import { Button, FlatList, View } from 'react-native'
import { ExperienceTile } from '../components/ExperienceTile'
import { Experience, useExperience } from '../contexts/experience'

export function YourInterestsScreen(){
    const { selectSelectedExperiences, removeExperience } = useExperience()

    return (
        <View>
            <FlatList 
                data={selectSelectedExperiences()}
                renderItem={({ item })=><ExperienceTile 
                    experience={item} 
                    action={(experience: Experience )=><Button 
                            onPress={()=>{removeExperience(experience.id)}}
                            title='Remove'
                        />
                    }
                />}
                keyExtractor={(item)=>{ console.log(item); return item.id}}
                ItemSeparatorComponent={()=><View style={{
                    height: 2,
                    backgroundColor: 'grey',
                    opacity: 0.5,
                }}></View>}
            />
        </View>
    )
}
