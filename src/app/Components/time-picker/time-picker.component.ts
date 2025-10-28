// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// @Component({
//   selector: 'app-time-picker',
//   templateUrl: './time-picker.component.html',
//   styleUrls: ['./time-picker.component.scss'],
//   imports: [CommonModule],
// })
// export class TimePickerComponent {
//   hours = Array.from({ length: 12 }, (_, i) => i + 1);
//   minutes = Array.from({ length: 60 }, (_, i) => i);

 
//   @Input() selectedHour = 1;
//   @Input() selectedMinute = 0;

 
//   @Output() timeChange = new EventEmitter<string>();
 
//   selectHour(hour: number) {
//     this.selectedHour = hour;
//     this.emitTime();
//   }
 
//   selectMinute(minute: number) {
//     this.selectedMinute = minute;
//     this.emitTime();
//   }
 

 
//   private emitTime() {
//     const time = `${this.selectedHour}h ${this.selectedMinute}m`;
//     this.timeChange.emit(time);
//   }
// }


import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TimePickerComponent {
  hours = Array.from({ length: 12 }, (_, i) => i + 1);
  minutes = Array.from({ length: 60 }, (_, i) => i);
  seconds = Array.from({ length: 36 }, (_, i) => (i + 1) * 5); // [5, 10, ..., 180]

  @Input() selectedHour = 1;
  @Input() selectedMinute = 0;
  @Input() selectedSecond = 5;

  @Output() timeChange = new EventEmitter<string>();

  selectHour(hour: number) {
    this.selectedHour = hour;
    this.emitTime();
  }

  selectMinute(minute: number) {
    this.selectedMinute = minute;
    this.emitTime();
  }

  selectSecond(second: number) {
    this.selectedSecond = second;
    this.emitTime();
  }

  private emitTime() {
    const time = `${this.selectedHour}h ${this.selectedMinute}m ${this.selectedSecond}s`;
    this.timeChange.emit(time);
  }
}
