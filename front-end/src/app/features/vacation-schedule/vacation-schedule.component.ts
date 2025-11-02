import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Day {
  date: number;
  isPast: boolean;
  selected: boolean;
}

interface Month {
  name: string;
  days: Day[];
}

@Component({
  selector: 'app-vacation-schedule.component',
  imports: [CommonModule],
  templateUrl: './vacation-schedule.component.html',
  styleUrl: './vacation-schedule.component.css'
})
export class VacationScheduleComponent implements OnInit {

  currentYear = new Date().getFullYear();
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  months: Month[] = []; // sada TS zna da days[] može da prima Day

  ngOnInit() {
    this.generateMonths();
  }

  generateMonths() {
    const monthNames = [
      'January','February','March','April','May','June','July','August','September','October','November','December'
    ];

    for (let i = 0; i < 12; i++) {
      const daysInMonth = new Date(this.currentYear, i + 1, 0).getDate();
      const month: Month = {
        name: monthNames[i],
        days: []
      };

      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(this.currentYear, i, d);
        month.days.push({
          date: d,
          isPast: dateObj < new Date(),
          selected: false
        });
      }

      this.months.push(month);
    }
  }

  selectDay(day: Day) {
    if (!day.isPast) {
      day.selected = !day.selected;
    }
  }
}
