import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkType } from '../../../core/models/lookups.model';
import { LookupsService } from '../../../core/services/lookups/lookups.service';

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

  lookupService: LookupsService = inject(LookupsService);

  selectedWorkTypeId: number | null = null;

  workTypes: WorkType[] = this.lookupService.getLookups().workTypes;

  confirm() {
    if (this.selectedWorkTypeId != null) {
      this.confirmSelection.emit(this.selectedWorkTypeId);
    }
  }

  cancel() {
    this.cancelSelection.emit();
  }
}