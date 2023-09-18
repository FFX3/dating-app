import React, { useState } from 'react'
import { FlatList, View } from 'react-native'
import { ExperienceTile } from '../components/ExperienceTile'
import { FormGroup, FormControlLabel, Switch } from '@mui/material'

export function DiscoverExperiencesScreen({ navigation }){
    //not many filters for now, all interest are in moncton
    const [includeSelected, setIncludeSelected] = useState(false)
    
    const experiences = [
        { 
            id: 1,
            selected: true,
            name: 'keg',
        },
        { 
            id: 2,
            selected: false,
            name: 'tide & boar',
        },
        { 
            id: 3,
            selected: false,
            name: 'irish town park',
        },
    ]

    return (
        <View>
            <FormGroup>
                <FormControlLabel label='include selected' control={<Switch checked={includeSelected} onChange={((e)=>e.target.checked)}/>} />
            </FormGroup>
            <FlatList 
                data={experiences.filter((experience)=>{
                    if(includeSelected) return true;
                    return !experience.selected
                })}
                renderItem={(row)=><ExperienceTile experience={row.item} />}
                keyExtractor={(experience)=>experience.id.toString()}
            />
        </View>
    )
}
