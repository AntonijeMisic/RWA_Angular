import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveType } from '../../../core/models/lookups.model';
import { LookupsService } from '../../../core/services/lookups/lookups.service';

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

  lookupService: LookupsService = inject(LookupsService);

  selectedLeaveTypeId: number | null = null;
  note: string = '';

  leaveTypes: LeaveType[] = this.lookupService.getLookups().leaveTypes;

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