import { useAvailabilities } from "../contexts/AvailabilityContext"
import { Button } from "react-native"

export function SaveButton(){
    const { save } = useAvailabilities()
    return <Button title='Save' onPress={ save }/>
}

