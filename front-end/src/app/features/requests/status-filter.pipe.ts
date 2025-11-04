import { Pipe, PipeTransform } from '@angular/core';
import { LeaveRequest } from '../../core/models/leaveRequest.model';

@Pipe({
  name: 'statusFilter'
})
export class StatusFilterPipe implements PipeTransform {
  transform(requests: LeaveRequest[], status: string): LeaveRequest[] {
    if (!requests) return [];
    if (!status) return requests;
    status = status.toLowerCase();
    return requests.filter(req => req.requestStatus.requestStatusName.toLowerCase() === status);
  }
}
