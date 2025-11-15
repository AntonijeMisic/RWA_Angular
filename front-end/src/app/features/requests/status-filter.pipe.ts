import { Pipe, PipeTransform } from '@angular/core';
import { LeaveRequest } from '../../core/models/leaveRequest.model';

@Pipe({
  name: 'statusFilter',
})
export class StatusFilterPipe implements PipeTransform {
  transform(requests: LeaveRequest[], statusId: number | null): LeaveRequest[] {
    if (!requests) return [];
    if (!statusId) return requests;

    return requests.filter(
      (req) => req.requestStatus.requestStatusId === statusId
    );
  }
}