import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveType } from '../../../core/models/lookups.model';

@Component({
  selector: 'app-leave-request-dialog',
  templateUrl: './leave-request-dialog.component.html',
  styleUrls: ['./leave-request-dialog.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LeaveRequestDialogComponent {
  @Output() confirmSelection = new EventEmitter<{
    leaveTypeId: number;
    note?: string;
  }>();
  @Output() cancelSelection = new EventEmitter<void>();

  selectedLeaveTypeId: number | null = null;
  note: string = '';

  leaveTypes: LeaveType[] = [
    { leaveTypeId: 1, leaveTypeName: 'Vacation' },
    { leaveTypeId: 2, leaveTypeName: 'Sick' },
  ];

  confirm() {
    if (this.selectedLeaveTypeId != null) {
      this.confirmSelection.emit({
        leaveTypeId: this.selectedLeaveTypeId,
        note: this.note ? this.note : undefined,
      });
    }
  }

  cancel() {
    this.cancelSelection.emit();
  }
}