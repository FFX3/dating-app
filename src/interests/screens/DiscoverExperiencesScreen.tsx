import React from 'react'
import { Button, FlatList, View } from 'react-native'
import { ExperienceTile } from '../components/ExperienceTile'
import { Experience, useExperience } from '../contexts/experience'

export function DiscoverExperiencesScreen(){
    const { selectUnselectedExperiences, addExperience } = useExperience()

    return (
        <View>
            <FlatList 
                data={selectUnselectedExperiences()}
                renderItem={({ item })=><ExperienceTile 
                    experience={item} 
                    action={(experience: Experience )=><Button 
                            onPress={()=>{addExperience(experience.id)}}
                            title='Add'
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
