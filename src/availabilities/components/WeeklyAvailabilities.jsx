import { IntervalPickerWeekday } from "./IntervalPicker"
import { View, Text } from "react-native"

export function WeeklyAvailibilities(){
    const rowHeight = 60

    return (
        <View style={{
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 60,
            }}>
                <View style={{
                    flexDirection: 'column',
                }}>
                    <View style={{ height: rowHeight }}><Text>Monday</Text></View>
                    <View style={{ height: rowHeight }}><Text>Tuesday</Text></View>
                    <View style={{ height: rowHeight }}><Text>Wednesday</Text></View>
                    <View style={{ height: rowHeight }}><Text>Thursday</Text></View>
                    <View style={{ height: rowHeight }}><Text>Friday</Text></View>
                    <View style={{ height: rowHeight }}><Text>Saturday</Text></View>
                    <View style={{ height: rowHeight }}><Text>Sunday</Text></View>
                </View>
                <View style={{
                    flexDirection: 'column',
                }}>
                    <View style={{ height: rowHeight }}><IntervalPickerWeekday day='monday' /></View>
                    <View style={{ height: rowHeight }}><IntervalPickerWeekday day='tuesday' /></View>
                    <View style={{ height: rowHeight }}><IntervalPickerWeekday day='wednesday' /></View>
                    <View style={{ height: rowHeight }}><IntervalPickerWeekday day='thursday' /></View>
                    <View style={{ height: rowHeight }}><IntervalPickerWeekday day='friday' /></View>
                    <View style={{ height: rowHeight }}><IntervalPickerWeekday day='saturday' /></View>
                    <View style={{ height: rowHeight }}><IntervalPickerWeekday day='sunday' /></View>
                </View>
            </View>
        </View>
    )
}
