import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  /**
   * Filters an array of items based on a search text.
   * Each item is expected to have a `user` object with `firstName` and `lastName` properties.
   * The filter is case-insensitive and returns only items where either the first name
   * or the last name contains the search text.
   */
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(
      (item) =>
        item.user.firstName.toLowerCase().includes(searchText) ||
        item.user.lastName.toLowerCase().includes(searchText)
    );
  }
}
