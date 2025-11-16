import { Pipe, PipeTransform } from '@angular/core';
import { LeaveRequest } from '../../core/models/leaveRequest.model';

@Pipe({
  name: 'statusFilter',
})
export class StatusFilterPipe implements PipeTransform {
  /**
   * Filters an array of LeaveRequest objects based on a specific status Id.
   * If the `statusId` is provided, only requests whose `requestStatus.requestStatusId`
   * matches the given statusId are returned. If no statusId is provided, the original
   * array is returned unfiltered.
   */
  transform(requests: LeaveRequest[], statusId: number | null): LeaveRequest[] {
    if (!requests) return [];
    if (!statusId) return requests;

    return requests.filter(
      (req) => req.requestStatus.requestStatusId === statusId
    );
  }
}
