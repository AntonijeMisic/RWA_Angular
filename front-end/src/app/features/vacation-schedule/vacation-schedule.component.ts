import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Day {
  date: number;
  isPast: boolean;
  selected: boolean;
  monthIndex: number;
  absenceType?: 'Vacation' | 'Sick' | 'Remote'; // imam lookup za tip odsustva
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  isRangeMiddle?: boolean;
}


interface Month {
  name: string;
  days: Day[];
}

@Component({
  selector: 'app-vacation-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vacation-schedule.component.html',
  styleUrls: ['./vacation-schedule.component.css']
})
export class VacationScheduleComponent implements OnInit {
  currentYear = new Date().getFullYear();
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  months: Month[] = [];

  // za range selekciju
  private firstSelectedDay: Day | null = null;

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
          selected: false,
          monthIndex: i
        });
      }

      this.months.push(month);
    }
  }

  selectDay(day: Day) {
    if (day.isPast) return;

    if (!this.firstSelectedDay) {
      // prvi klik - start range
      this.firstSelectedDay = day;
      day.selected = true;
      day.isRangeStart = true;
    } else {
      // kraj range
      const startMonth = this.firstSelectedDay.monthIndex;
      const endMonth = day.monthIndex;
      const startDate = this.firstSelectedDay.date;
      const endDate = day.date;

      this.clearAllSelections();

      for (let m = startMonth; m <= endMonth; m++) {
        this.months[m].days.forEach(d => {
          if (startMonth === endMonth) {
            if (d.date >= startDate && d.date <= endDate) d.selected = true;
          } else {
            if (m === startMonth && d.date >= startDate) d.selected = true;
            else if (m === endMonth && d.date <= endDate) d.selected = true;
            else if (m > startMonth && m < endMonth) d.selected = true;
          }

          // označavanje početka, sredine i kraja range-a
          if (d.selected) {
            d.isRangeStart = (m === startMonth && d.date === startDate);
            d.isRangeEnd = (m === endMonth && d.date === endDate);
            d.isRangeMiddle = !d.isRangeStart && !d.isRangeEnd;
          }
        });
      }

      // pokaži popup za izbor tipa odsustva
      this.showAbsenceTypePopup(day);

      this.firstSelectedDay = null;
    }
  }

  showAbsenceTypePopup(day: Day) {
    // Ovde možeš da prikažeš modal/tooltip
    // Za primer, koristi prompt (za demo)
    const type = prompt('Select absence type: Vacation, Sick, Remote', 'Vacation');
    if (type === 'Vacation' || type === 'Sick' || type === 'Remote') {
      this.applyAbsenceTypeToSelected(type);
    }
  }

  applyAbsenceTypeToSelected(type: 'Vacation' | 'Sick' | 'Remote') {
    this.months.forEach(m =>
      m.days.forEach(d => {
        if (d.selected) d.absenceType = type;
      })
    );
  }

  private clearAllSelections() {
    this.months.forEach(m =>
      m.days.forEach(d => {
        d.selected = false;
        d.isRangeStart = false;
        d.isRangeEnd = false;
        d.isRangeMiddle = false;
        d.absenceType = undefined;
      })
    );
  }
}