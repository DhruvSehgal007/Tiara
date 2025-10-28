import { Component, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; // ✅ Add this
import Swiper from 'swiper';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [IonicModule, CommonModule], // ✅ Add CommonModule here
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss']
})
export class TestPage implements AfterViewInit {
  hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  seconds = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  selectedHour: string = '13';
  selectedMinute: string = '30';
  selectedSecond: string = '45';

  ngAfterViewInit() {
    const defaults = {
      slidesPerView: 3,
      freeMode: true,
      freeModeSticky: true,
      direction: 'vertical',
      centeredSlides: true,
      slideToClickedSlide: true,
      loop: true,
    };

    const hourSwiper = new Swiper('.swiper-container.hours', {
      ...defaults,
      initialSlide: 13,
      on: {
        slideChangeTransitionEnd: () => {
          const el = document.querySelector('.swiper-container.hours .swiper-slide-active');
          if (el) this.selectedHour = el.textContent!.trim();
        }
      }
    });

    const minuteSwiper = new Swiper('.swiper-container.minutes', {
      ...defaults,
      initialSlide: 30,
      on: {
        slideChangeTransitionEnd: () => {
          const el = document.querySelector('.swiper-container.minutes .swiper-slide-active');
          if (el) this.selectedMinute = el.textContent!.trim();
        }
      }
    });

    const secondSwiper = new Swiper('.swiper-container.seconds', {
      ...defaults,
      initialSlide: 45,
      on: {
        slideChangeTransitionEnd: () => {
          const el = document.querySelector('.swiper-container.seconds .swiper-slide-active');
          if (el) this.selectedSecond = el.textContent!.trim();
        }
      }
    });
  }
}

