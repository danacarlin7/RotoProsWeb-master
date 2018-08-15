import {Component, Input, Output, EventEmitter} from "@angular/core";
import {FilterKeyConstants, FilterSettingsConstants} from "../../constants/filter.constant";
import * as moment from 'moment';
import {FormGroup, FormControl} from "@angular/forms";
import {FilterCriteria} from "../../models/filter-criteria.model";

/**
 * Created by Hiren on 11-06-2017.
 */

declare var jQuery:any;
@Component({
  selector: 'rp-filters',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  filterKeyConstants = FilterKeyConstants;
  maxDate = moment().toDate();
  filterForm:FormGroup;
  private _filterSettings:any;
  @Input() set filterSettings(value:any) {
    this._filterSettings = value;
    if (this._filterSettings) {
      this.prepareFilterData();
    }
  }

  sitesData:{label:string,value:any}[];
  sportData:{label:string,value:any}[];
  seasonData:{label:string,value:any}[];
  contestData:{label:string,value:any}[];
  timePeriodData:{label:string,value:any}[];
  weekdayData:{label:string,value:any}[];
  entryFeeData:{label:string,value:any}[];
  contestEntriesData:{label:string,value:any}[];
  maxContestEntriesData:{label:string,value:any}[];
  rangeOfEntriesData:{label:string,value:any}[];

  @Output() addFilterEvent:EventEmitter<FilterCriteria> = new EventEmitter<FilterCriteria>();

  constructor() {
    this.filterForm = new FormGroup({});
    this.filterForm.addControl(FilterKeyConstants.TITLE, new FormControl());
    this.filterForm.addControl(FilterKeyConstants.SITE, new FormControl('-'));
    this.filterForm.addControl(FilterKeyConstants.SPORT, new FormControl('-'));
    this.filterForm.addControl(FilterKeyConstants.SEASON, new FormControl('-'));
    this.filterForm.addControl(FilterKeyConstants.CONTEST_TYPE, new FormControl('-'));
    this.filterForm.addControl(FilterKeyConstants.TIME_PERIOD, new FormControl('-'));
    this.filterForm.addControl(FilterKeyConstants.WEEK_DAY, new FormControl('-'));
    this.filterForm.addControl(FilterKeyConstants.DATE_FROM, new FormControl());
    this.filterForm.addControl(FilterKeyConstants.DATE_TO, new FormControl());
    this.filterForm.addControl(FilterKeyConstants.DATE_EXACT, new FormControl());
    let feeGroup:FormGroup = new FormGroup({});
    feeGroup.addControl('min', new FormControl('-'));
    feeGroup.addControl('max', new FormControl('-'));
    this.filterForm.addControl(FilterKeyConstants.FEE, feeGroup);
    this.filterForm.addControl(FilterKeyConstants.FREE_ROLL, new FormControl('-'));
    let contestEntriesGroup:FormGroup = new FormGroup({});
    contestEntriesGroup.addControl('min_contest', new FormControl('-'));
    contestEntriesGroup.addControl('max_contest', new FormControl('-'));
    this.filterForm.addControl(FilterKeyConstants.NO_OF_CONTEST_ENTRIES, contestEntriesGroup);
    this.filterForm.addControl(FilterKeyConstants.MAX_CONTEST_ENTRIES, new FormControl('-'));
    this.filterForm.addControl(FilterKeyConstants.RANGE_OF_TOTAL_ENTRIES, new FormControl('-'));
    this.filterForm.addControl(FilterKeyConstants.EXACT_NO_OF_ENTRIES, new FormControl());
    this.filterForm.addControl(FilterKeyConstants.OPPONENT_NAME, new FormControl());
  }

  ngAfterViewInit():void {
    jQuery('.datepicker').datepicker({
      changeMonth: true,
      changeYear: true,
      beforeShow: function (textbox, instance) {
        instance.dpDiv.css({
          marginLeft: textbox.offsetWidth + (-228) + 'px'
        });
      }
    });
  }

  addFilter(filterKey:string) {
    let value = this.filterForm.value[filterKey];
    switch (filterKey) {
      case FilterKeyConstants.FEE:
        if (value && (value.min != '-' || value.max != '-')) {
          if (value.min == '-') {
            value.min = "";
          }
          if (value.max == '-') {
            value.max = "";
          }
          this.addFilterEvent.emit(<FilterCriteria>{key: filterKey, value: value});
        }
        break;
      case FilterKeyConstants.NO_OF_CONTEST_ENTRIES:
        if (value && (value.min_contest != '-' || value.max_contest != '-')) {
          if (value.min_contest == '-') {
            value.min_contest = "";
          }
          if (value.max_contest == '-') {
            value.max_contest = "";
          }
          this.addFilterEvent.emit(<FilterCriteria>{key: filterKey, value: value});
        }
        break;
      default:
        if (value && value != '-') {
          this.addFilterEvent.emit(<FilterCriteria>{key: filterKey, value: value});
        }
        break;
    }
    console.log(filterKey + " => " + value);
  }

  prepareFilterData() {
    this.prepareSiteData(this._filterSettings[FilterSettingsConstants.SITES]);
    this.prepareSportData(this._filterSettings[FilterSettingsConstants.SPORTS]);
    this.prepareSeasonData(this._filterSettings[FilterSettingsConstants.SEASONS]);
    this.prepareContestData(this._filterSettings[FilterSettingsConstants.CATEGORIES]);
    this.prepareTimePeriodData(this._filterSettings[FilterSettingsConstants.SINCE_FILTER]);
    this.prepareWeekdayData(this._filterSettings[FilterSettingsConstants.WEEKDAY_FILTER]);
    this.prepareEntryFeeDataData(this._filterSettings[FilterSettingsConstants.FEES]);
    this.prepareContestEntriesData(this._filterSettings[FilterSettingsConstants.HERO_ENTRIES]);
    this.prepareMaxContestEntriesData(this._filterSettings[FilterSettingsConstants.MAX_ENTRIES]);
    this.prepareRangeOfEntriesData(this._filterSettings[FilterSettingsConstants.CONTEST_SIZES]);
  }

  prepareSiteData(siteData:Array<any>) {
    this.sitesData = [];
    if (!siteData) {
      siteData = [];
    }
    siteData.forEach(season => {
      this.sitesData.push({label: season[1], value: season[0]});
    })
  }

  prepareSportData(sportData:Array<any>) {
    this.sportData = [];
    if (!sportData) {
      sportData = [];
    }
    sportData.forEach(season => {
      this.sportData.push({label: season[1], value: season[0]});
    })
  }

  prepareSeasonData(seasonData:Array<any>) {
    this.seasonData = [];
    if (!seasonData) {
      seasonData = [];
    }
    seasonData.forEach(season => {
      this.seasonData.push({label: season[1], value: season[0]});
    })
  }

  prepareContestData(contestData:Array<any>) {
    this.contestData = [];
    if (!contestData) {
      contestData = [];
    }
    contestData.forEach(season => {
      this.contestData.push({label: season[1], value: season[0]});
    })
  }

  prepareTimePeriodData(timePeriod:Array<any>) {
    this.timePeriodData = [];
    if (!timePeriod) {
      timePeriod = [];
    }
    timePeriod.forEach(season => {
      this.timePeriodData.push({label: season[1], value: season[0]});
    })
  }

  prepareWeekdayData(timePeriod:Array<any>) {
    this.weekdayData = [];
    if (!timePeriod) {
      timePeriod = [];
    }
    timePeriod.forEach(season => {
      this.weekdayData.push({label: season[1], value: season[0]});
    })
  }

  prepareEntryFeeDataData(feeData:Array<any>) {
    this.entryFeeData = [];
    if (!feeData) {
      feeData = [];
    }
    feeData.forEach(season => {
      this.entryFeeData.push({label: season[1], value: season[0]});
    })
  }

  prepareContestEntriesData(contestData:Array<any>) {
    this.contestEntriesData = [];
    if (!contestData) {
      contestData = [];
    }
    contestData.forEach(currData => {
      this.contestEntriesData.push({label: currData[1], value: currData[0]});
    })
  }

  prepareMaxContestEntriesData(contestData:Array<any>) {
    this.maxContestEntriesData = [];
    if (!contestData) {
      contestData = [];
    }
    contestData.forEach(currData => {
      this.maxContestEntriesData.push({label: currData[1], value: currData[0]});
    })
  }

  prepareRangeOfEntriesData(contestData:Array<any>) {
    this.rangeOfEntriesData = [];
    if (!contestData) {
      contestData = [];
    }
    contestData.forEach(currData => {
      this.rangeOfEntriesData.push({label: currData[1], value: currData[0]});
    })
  }

}
