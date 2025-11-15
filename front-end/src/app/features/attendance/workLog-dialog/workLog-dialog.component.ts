import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkType } from '../../../core/models/lookups.model';

@Component({
  selector: 'app-work-log-dialog',
  templateUrl: './workLog-dialog.component.html',
  styleUrls: ['./workLog-dialog.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class WorkLogDialogComponent {
  @Output() confirmSelection = new EventEmitter<number>();
  @Output() cancelSelection = new EventEmitter<void>();

  selectedWorkTypeId: number | null = null;

  workTypes: WorkType[] = [ //mozemo da ih ucitamo iz lookupservice-a
    { workTypeId: 1, workTypeName: 'Office' },
    { workTypeId: 2, workTypeName: 'Remote' }
  ];

  confirm() {
    if (this.selectedWorkTypeId != null) {
      this.confirmSelection.emit(this.selectedWorkTypeId);
    }
  }

  cancel() {
    this.cancelSelection.emit();
  }
}