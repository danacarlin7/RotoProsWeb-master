import {CohortTabConstants, ContestTabConstants, GraphTabConstants} from "../constants/menu.constants";
import {FilterCriteria} from "../models/filter-criteria.model";
import {EventEmitter, Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {AuthService} from "../../shared/services/auth.service";
import {Observable} from "rxjs/Rx";
import {FilterKeyConstants} from "../constants/filter.constant";
import * as moment from 'moment';
import {environment} from "../../../environments/environment";

/**
 * Created by Hiren on 11-06-2017.
 */
@Injectable()
export class FilterService {
  endpoint:string = "https://api.dfsportgod.com/";
  activeCohortTab:string = CohortTabConstants.SITE;
  activeContestTab:string = ContestTabConstants.CONTESTS;
  activeGraphTab:string = GraphTabConstants.PROFIT;
  filterSettings:any;
  filters:FilterCriteria[];

  filtersChangedEvent:EventEmitter<FilterCriteria[]> = new EventEmitter<FilterCriteria[]>();

  constructor(private http:Http, private authService:AuthService) {

  }

  getToken():string {
    return environment.token;
  }

  getHeaders():Headers {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    if (this.getToken()) {
      headers.append('Authorization', 'Bearer ' + this.getToken());
    }
    return headers;
  }

  getFilterSettings():Observable<any> {
    return new Observable(observer => {
      if (this.filterSettings) {
        observer.next(this.filterSettings);
      }
      else {
        this.http.get(environment.api_end_point + 'api/settings', {headers: this.getHeaders()})
          .map(response => response.json())
          .subscribe(
            response => {
              this.filterSettings = response.data;
              console.log(this.filterSettings);
              observer.next(this.filterSettings);
            }
          )
      }
    });
  }

  addFilter(filter:FilterCriteria) {
    this.filters = this.addValueToFilterArray(filter, this.filters);
    this.filtersChangedEvent.emit(this.filters);
  }

  removeFilter(filter:FilterCriteria) {
    this.filters = this.removeValueFromFilterArray(filter, this.filters);
    this.filtersChangedEvent.emit(this.filters);
  }

  clearFilter() {
    this.filters = null;
    this.filtersChangedEvent.emit(this.filters);
  }

  handelError(error:any) {
    if (error.statusCode == 401) {

    }
  }

  removeValueFromFilterArray(deleteFilter:FilterCriteria, filterArray:FilterCriteria[]):FilterCriteria[] {
    let searchedFilter:FilterCriteria[] = filterArray.filter(currFilter => {
      if (currFilter.key == deleteFilter.key) {
        return currFilter;
      }
    });
    if (searchedFilter) {
      filterArray.splice(filterArray.indexOf(searchedFilter[0]), 1);
    }
    return filterArray;
  }

  addValueToFilterArray(newFilter:FilterCriteria, filterArray:FilterCriteria[]):FilterCriteria[] {
    if (!filterArray) {
      filterArray = [];
    }
    if (newFilter.key == FilterKeyConstants.FEE) {
      let searchedFilter:FilterCriteria[] = filterArray.filter(currFilter => {
        if (currFilter.key == FilterKeyConstants.FREE_ROLL) {
          return currFilter;
        }
      });
      if (searchedFilter) {
        filterArray.splice(filterArray.indexOf(searchedFilter[0]), 1);
      }
    }
    else if (newFilter.key == FilterKeyConstants.FREE_ROLL) {
      let searchedFilter:FilterCriteria[] = filterArray.filter(currFilter => {
        if (currFilter.key == FilterKeyConstants.FEE) {
          return currFilter;
        }
      });
      if (searchedFilter) {
        filterArray.splice(filterArray.indexOf(searchedFilter[0]), 1);
      }
    }
    let searchedFilter:FilterCriteria[] = filterArray.filter(currFilter => {
      if (currFilter.key == newFilter.key) {
        return currFilter;
      }
    });
    if (searchedFilter && searchedFilter.length) {
      filterArray.splice(filterArray.indexOf(searchedFilter[0]), 1, newFilter);
    }
    else {
      filterArray.push(newFilter);
    }
    return filterArray;
  }

  getQueryParamStringFromFilters(filters:FilterCriteria[]):string {
    let queryStr = '';
    filters.forEach((currFilter, index) => {
      if (index == 0) {
        queryStr = queryStr + this.getFilterKey(currFilter) + "=" + this.getFilterValue(currFilter);
      } else {
        queryStr = queryStr + "&" + this.getFilterKey(currFilter) + "=" + this.getFilterValue(currFilter);
      }

    });
    console.log("queryStr => ", queryStr);
    return queryStr;
  }

  getFilterKey(filter:FilterCriteria):string {
    let key:string;
    switch (filter.key) {
      case FilterKeyConstants.FREE_ROLL:
        key = FilterKeyConstants.FEE;
        break;
      default:
        key = filter.key;
        break;
    }
    return key;
  }

  getFilterValue(filter:FilterCriteria):string {
    let value:string;
    switch (filter.key) {
      case FilterKeyConstants.DATE_FROM:
      case FilterKeyConstants.DATE_TO:
      case FilterKeyConstants.DATE_EXACT:
        value = moment(filter.value).format('YYYY-MM-DD');
        break;
      case FilterKeyConstants.FEE:
        let minValue = filter.value.min ? filter.value.min : '';
        let maxValue = filter.value.max ? filter.value.max : '';
        value = minValue + "-" + maxValue;
        break;
      case FilterKeyConstants.NO_OF_CONTEST_ENTRIES:
        let minContestValue = filter.value.min_contest ? filter.value.min_contest : '';
        let maxContestValue = filter.value.max_contest ? filter.value.max_contest : '';
        value = minContestValue + "-" + maxContestValue;
        break;
      default:
        value = filter.value;
        break;
    }
    return value;
  }
}
