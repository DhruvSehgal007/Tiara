import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import Swiper from 'swiper';
import { FrequencyModeService, FrequencyMode } from '../frequency-mode.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-mode',
  templateUrl: './mode.page.html',
  styleUrls: ['./mode.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ModePage implements OnInit, AfterViewInit {
  modes: { id: string, data: FrequencyMode }[] = [];
  currentEditIndex: number = 0;

  // Modal form states
  isModalOpen = false;
  selectedDays: string[] = [];

  selectedStartHour = '06';
  selectedStartMinute = '00';
  selectedEndHour = '22';
  selectedEndMinute = '00';
  selectedRunTime = '10';
  selectedStopTime = '60';

  hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  seconds = Array.from({ length: 24 }, (_, i) => ((i + 1) * 5).toString());

  weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  constructor(private frequencyService: FrequencyModeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadModes();
  }

  ngAfterViewInit() {}

  loadModes() {
    this.modes = [];
    for (let i = 1; i <= 5; i++) {
      const id = `mode${i}`;
      const data = this.frequencyService.getMode(id);
      this.modes.push({ id, data });
    }
  }

  formatTime(h: number, m: number): string {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  openModal(index: number) {
    this.currentEditIndex = index;
    const mode = this.modes[index].data;

    this.selectedStartHour = mode.startHour.toString().padStart(2, '0');
    this.selectedStartMinute = mode.startMinute.toString().padStart(2, '0');
    this.selectedEndHour = mode.endHour.toString().padStart(2, '0');
    this.selectedEndMinute = mode.endMinute.toString().padStart(2, '0');
    this.selectedRunTime = mode.runTime.toString();
    this.selectedStopTime = mode.stopTime.toString();
    this.selectedDays = [...mode.selectedDays];

    this.isModalOpen = true;
    setTimeout(() => this.initializeSwipers(), 300);
  }

  closeModal() {
    this.isModalOpen = false;
  }

  toggleDay(day: string) {
    const i = this.selectedDays.indexOf(day);
    i >= 0 ? this.selectedDays.splice(i, 1) : this.selectedDays.push(day);
  }


//   toggleMode(index: number) {
//   this.modes.forEach((m, i) => {
//     m.data.enabled = (i === index);  // enable only clicked mode
//     this.frequencyService.saveMode(m.id, m.data);
//   });
//   this.loadModes(); // refresh UI
// }
toggleMode(index: number) {
  this.modes.forEach((m, i) => {
    if (i === index) {
      m.data.enabled = true;

      // If days/frequency/time are empty, set defaults if needed
      if (!m.data.selectedDays || m.data.selectedDays.length === 0) {
        m.data.selectedDays = ['MON', 'TUE', 'WED', 'THU', 'FRI']; // default
      }

      // Save current data (even without modal)
      this.frequencyService.updateMode(
        m.id,
        m.data.runTime,
        m.data.stopTime,
        m.data.selectedDays,
        m.data.startHour,
        m.data.startMinute,
        m.data.endHour,
        m.data.endMinute,
      );
    } else {
      m.data.enabled = false;
    }

    // Save each mode state
    this.frequencyService.saveMode(m.id, m.data);
  });

  this.loadModes(); // refresh UI
}





  saveChanges() {
  const modeId = this.modes[this.currentEditIndex].id;

  // Log selected values before saving
  console.log('✅ Selected Days:', this.selectedDays);
  console.log(
    'Start Time:',
    `${this.selectedStartHour}h ${this.selectedStartMinute}m`
  );
  console.log(
    'End Time:',
    `${this.selectedEndHour}h ${this.selectedEndMinute}m`
  );
  console.log(
    'Frequency Run Time:',
    `${this.selectedRunTime}s`
  );
  console.log(
    'Frequency Stop Time:',
    `${this.selectedStopTime}s`
  );

  // Save mode
  this.frequencyService.updateMode(
    modeId,
    parseInt(this.selectedRunTime),
    parseInt(this.selectedStopTime),
    this.selectedDays,
    parseInt(this.selectedStartHour),
    parseInt(this.selectedStartMinute),
    parseInt(this.selectedEndHour),
    parseInt(this.selectedEndMinute)
  );

  alert(`✅ Mode ${this.currentEditIndex + 1} saved`);
  this.closeModal();
  this.loadModes(); // reload updated modes
}


  initializeSwipers() {
    const defaults = {
      direction: 'vertical',
      slidesPerView: 3,
      freeMode: true,
      centeredSlides: true,
      slideToClickedSlide: true,
      loop: true,
    };

    new Swiper('.start-hour', {
      ...defaults,
      initialSlide: parseInt(this.selectedStartHour),
      on: {
        slideChangeTransitionEnd: () => {
          const el = document.querySelector('.start-hour .swiper-slide-active');
          if (el) this.selectedStartHour = el.textContent!.trim();
        }
      }
    });

    new Swiper('.start-minute', {
      ...defaults,
      initialSlide: parseInt(this.selectedStartMinute),
      on: {
        slideChangeTransitionEnd: () => {
          const el = document.querySelector('.start-minute .swiper-slide-active');
          if (el) this.selectedStartMinute = el.textContent!.trim();
        }
      }
    });

    new Swiper('.end-hour', {
      ...defaults,
      initialSlide: parseInt(this.selectedEndHour),
      on: {
        slideChangeTransitionEnd: () => {
          const el = document.querySelector('.end-hour .swiper-slide-active');
          if (el) this.selectedEndHour = el.textContent!.trim();
        }
      }
    });

    new Swiper('.end-minute', {
      ...defaults,
      initialSlide: parseInt(this.selectedEndMinute),
      on: {
        slideChangeTransitionEnd: () => {
          const el = document.querySelector('.end-minute .swiper-slide-active');
          if (el) this.selectedEndMinute = el.textContent!.trim();
        }
      }
    });

    new Swiper('.run-seconds', {
      ...defaults,
      initialSlide: this.seconds.indexOf(this.selectedRunTime),
      on: {
        slideChangeTransitionEnd: () => {
          const el = document.querySelector('.run-seconds .swiper-slide-active');
          if (el) this.selectedRunTime = el.textContent!.trim();
        }
      }
    });

    new Swiper('.stop-seconds', {
      ...defaults,
      initialSlide: this.seconds.indexOf(this.selectedStopTime),
      on: {
        slideChangeTransitionEnd: () => {
          const el = document.querySelector('.stop-seconds .swiper-slide-active');
          if (el) this.selectedStopTime = el.textContent!.trim();
        }
      }
    });
  }


            ondevice() {
this.router.navigate(['device'])
}
}
