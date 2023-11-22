import { useAvailabilities } from "../contexts/AvailabilityContext"
import { View } from "react-native"
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import type { DaysOfTheWeek } from '../../../../types/misc'

export function IntervalPickerWeekday({ day }: { day: DaysOfTheWeek }){
    const { availability, dispatchAvailability } = useAvailabilities()

    console.log('in interval picker', JSON.stringify(availability))
    const timeRanges = availability.weekly[day]

    return timeRanges.map(((range, index)=>{
        const [start, end] = range

        const setStart = (time: string) => {
            const newTimeRanges = [...timeRanges]
            newTimeRanges[index][0] = time

            dispatchAvailability({
                type: 'set_day',
                payload: {
                    day,
                    state: newTimeRanges
                }
            })
        }

        const setEnd = (time: string) => {
            const newTimeRanges = [...timeRanges]
            newTimeRanges[index][1] = time

            dispatchAvailability({
                type: 'set_day',
                payload: {
                    day,
                    state: newTimeRanges
                }
            })
        }

        return <TimeIntervalPicker key={index} {...{ start, setStart, end, setEnd }}/>
    }))
}

export function TimeIntervalPicker({ start, setStart, end, setEnd }: {
    start: string, 
    setStart: (time: string)=>void, 
    end: string, 
    setEnd: (time: string)=>void, 
}) {
    if(!start || !setStart || !end || !setEnd){ return }

    const onChangeStart = (_event: DateTimePickerEvent, selectedDate?: Date) => {
        setStart(`${selectedDate.getHours()}:${selectedDate.getMinutes()}`);
    };

    const onChangeEnd = (_event: DateTimePickerEvent, selectedDate?: Date) => {
        setStart(`${selectedDate.getHours()}:${selectedDate.getMinutes()}`);
    };

    //TODO extract this into a module
    const [startHours, startMinutes] = start.split(':')
    const startDateObject = new Date()
    startDateObject.setHours(parseInt(startHours))
    startDateObject.setMinutes(parseInt(startMinutes))

    const [endHours, endMinutes] = start.split(':')
    const endDateObject = new Date()
    endDateObject.setHours(parseInt(endHours))
    endDateObject.setMinutes(parseInt(endMinutes))

    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
        }}>
            <DateTimePicker
                testID="dateTimePicker"
                value={startDateObject}
                mode={'time'}
                maximumDate={endDateObject}
                is24Hour={true}
                onChange={onChangeStart}
            />
            <DateTimePicker
                testID="dateTimePicker"
                value={endDateObject}
                mode={'time'}
                minimumDate={startDateObject}
                is24Hour={true}
                onChange={onChangeEnd}
            />
        </View>
    )
}

export function IntervalPicker({ start, setStart, end, setEnd }: {
    start: Date, 
    setStart: (time: Date)=>void, 
    end: Date, 
    setEnd: (time: Date)=>void, 
}) {
    if(!start || !setStart || !end || !setEnd){ return }

    const onChangeStart = (_event: DateTimePickerEvent, selectedDate?: Date) => {
        setStart(selectedDate);
    };

    const onChangeEnd = (_event: DateTimePickerEvent, selectedDate?: Date) => {
        setStart(selectedDate);
    };

    return (
        <View style={{
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 10,
        }}>
            <DateTimePicker
                testID="dateTimePicker"
                value={start}
                mode={'date'}
                maximumDate={end}
                is24Hour={true}
                onChange={onChangeStart}
            />
            <DateTimePicker
                testID="dateTimePicker"
                value={end}
                mode={'date'}
                minimumDate={start}
                is24Hour={true}
                onChange={onChangeEnd}
            />
        </View>
    )
}
