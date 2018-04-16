import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'inRoomSince'
})
export class InRoomSincePipe implements PipeTransform {

    constructor(private datePipe: DatePipe) {}

    transform(value: any, args?: any): any {
        let date = new Date(value);
        let today = new Date();
        if(new Date(value).setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
            return this.getStandardTime(date);

        } else {
            return `${this.datePipe.transform(date, 'mm/dd/yyyy')} ${this.getStandardTime(date)}`;
        }
    }

    getStandardTime(date: any) {
        let time;
        time = this.datePipe.transform(date, 'HH:mm').split(':'); // convert to array
        // fetch
        var hours = Number(time[0]);
        var minutes = Number(time[1]);
        // var seconds = Number(time[2]);

        // calculate
        var timeValue;
        if (hours > 0 && hours <= 12) {
            timeValue = '' + hours;
        } else if (hours > 12) {
            timeValue = '' + (hours - 12);
        } else if (hours == 0) {
            timeValue = '12';
        }

        timeValue += (minutes < 10) ? ':0' + minutes : ':' + minutes;  // get minutes
        // timeValue += (seconds < 10) ? ":0" + seconds : ":" + seconds;  // get seconds
        timeValue += (hours >= 12) ? ' P.M.' : ' A.M.';  // get AM/PM

        return timeValue;
    }

}
