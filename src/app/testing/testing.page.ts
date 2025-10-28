import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonContent, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { TimePickerComponent } from '../Components/time-picker/time-picker.component';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.page.html',
  styleUrls: ['./testing.page.scss'],
  imports: [CommonModule,TimePickerComponent],
  standalone: true,
})
export class TestingPage implements AfterViewInit {
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

times = [
  { hour: 4, minute: 45, second: 5 },
  { hour: 6, minute: 10, second: 10 },
  { hour: 3, minute: 30, second: 15 },
  { hour: 1, minute: 0, second: 20 }
];

onTimeChange(index: number, newTime: string) {
  console.log(`Picker ${index + 1} changed to ${newTime}`);
  // Optional: parse time if needed
}

  


  }




