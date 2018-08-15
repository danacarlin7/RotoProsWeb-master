import {Component, Input, Output, EventEmitter} from "@angular/core";
import {FilterKeyConstants} from "../../../constants/filter.constant";
/**
 * Created by Hiren on 11-06-2017.
 */

@Component({
  selector: 'rp-applied-filters',
  templateUrl: './applied-filter.component.html',
  styleUrls: ['./applied-filter.component.css']
})
export class AppliedFiltersComponent {
  @Input() filters:{key:string,value:any}[];
  @Input() filterSettings:any;
  @Output() removeFilterEvent:EventEmitter<{key:string,value:any}> = new EventEmitter<{key:string,value:any}>();
  @Output() remoceAllFiltersEvent:EventEmitter<{key:string,value:any}[]> = new EventEmitter<{key:string,value:any}[]>();

  constructor() {
  }

  removeFilter(filter:{key:string,value:any}) {
    this.removeFilterEvent.emit(filter);
  }

  clearAllFilters() {
    this.remoceAllFiltersEvent.emit(this.filters);
  }

  getKeyName(filterKey:string):string {
    return FilterKeyConstants.getFilterNameByKey(filterKey);
  }

  getFilterDisplayValue(filter):string {
    return FilterKeyConstants.getFilterDisplayValue(filter,this.filterSettings);
  }

}
