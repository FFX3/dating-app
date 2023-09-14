import { useAvailabilities } from "../contexts/AvailabilityContext"
import { View } from "react-native"
import DateTimePicker from '@react-native-community/datetimepicker';

export function IntervalPickerWeekday({ day }){
    const context = useAvailabilities()

    const start = context['start' + day.charAt(0).toUpperCase() + day.slice(1)]
    const setStart = context['setStart' + day.charAt(0).toUpperCase() + day.slice(1)]
    const end = context['end' + day.charAt(0).toUpperCase() + day.slice(1)]
    const setEnd = context['setEnd' + day.charAt(0).toUpperCase() + day.slice(1)]

    return <IntervalPicker {...{ start, setStart, end, setEnd }}/>
}

export function IntervalPicker({ start, setStart, end, setEnd, mode='time' }) {
    if(!start || !setStart || !end || !setEnd){ return }

    const onChangeStart = (event, selectedDate) => {
        const currentDate = selectedDate;
        setStart(currentDate);
    };

    const onChangeEnd = (event, selectedDate) => {
        const currentDate = selectedDate;
        setEnd(currentDate);
    };

    return (
        <View style={{
            flexDirection: mode=='time' ? 'row' : 'column',
            justifyContent: 'center',
            gap: 10,
        }}>
            <DateTimePicker
                testID="dateTimePicker"
                value={start}
                mode={mode}
                maximumDate={end}
                is24Hour={true}
                onChange={onChangeStart}
            />
            <DateTimePicker
                testID="dateTimePicker"
                value={end}
                mode={mode}
                minimumDate={start}
                is24Hour={true}
                onChange={onChangeEnd}
            />
        </View>
    )
}
