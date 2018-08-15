import {FilterCriteria} from "../models/filter-criteria.model";
import * as moment from 'moment';
/**
 * Created by Hiren on 03-05-2017.
 */

export class FilterSettingsConstants {
  public static HERO_ENTRIES:string = 'hero_entries';
  public static WEEKDAY_FILTER:string = 'weekday_filter';
  public static CONTEST_SIZES:string = 'contest_sizes';
  public static SITES:string = 'sites';
  public static SPORTS:string = 'sports';
  public static MAX_ENTRIES:string = 'max_entries';
  public static FEES:string = 'fees';
  public static SEASONS:string = 'seasons';
  public static SINCE_FILTER:string = 'since_filter';
  public static CATEGORIES:string = 'categories';
}

export class FilterKeyConstants {
  public static TITLE:string = 'title';
  public static SITE:string = 'site';
  public static SPORT:string = 'sport';
  public static SEASON:string = 'season';
  public static CONTEST_TYPE:string = 'category';
  public static TIME_PERIOD:string = 'since';
  public static WEEK_DAY:string = 'weekday';
  public static DATE_FROM:string = 'date_from';
  public static DATE_TO:string = 'date_to';
  public static DATE_EXACT:string = 'date_exact';
  public static FEE:string = 'fee';
  public static FREE_ROLL:string = 'free_roll';
  public static NO_OF_CONTEST_ENTRIES:string = 'hero_entries';
  public static MAX_CONTEST_ENTRIES:string = 'max_entries';
  public static RANGE_OF_TOTAL_ENTRIES:string = 'size_range';
  public static EXACT_NO_OF_ENTRIES:string = 'size_exact';
  public static OPPONENT_NAME:string = 'opponent_name';

  public static getFilterNameByKey(key:string):string {
    let name:string;
    switch (key) {
      case FilterKeyConstants.TITLE:
        name = 'Contest title search';
        break;
      case FilterKeyConstants.SITE:
        name = 'Site';
        break;
      case FilterKeyConstants.SPORT:
        name = 'Sport';
        break;
      case FilterKeyConstants.SEASON:
        name = 'Season';
        break;
      case FilterKeyConstants.CONTEST_TYPE:
        name = 'Contest Type';
        break;
      case FilterKeyConstants.TIME_PERIOD:
        name = 'Time Period';
        break;
      case FilterKeyConstants.WEEK_DAY:
        name = 'Weekday';
        break;
      case FilterKeyConstants.DATE_FROM:
        name = 'Date from';
        break;
      case FilterKeyConstants.DATE_TO:
        name = 'Date to';
        break;
      case FilterKeyConstants.DATE_EXACT:
        name = 'Exact day';
        break;
      case FilterKeyConstants.FEE:
        name = 'Entry fee';
        break;
      case FilterKeyConstants.FREE_ROLL:
        name = 'Freeroll filter';
        break;
      case FilterKeyConstants.NO_OF_CONTEST_ENTRIES:
        name = 'Number of contest entries';
        break;
      case FilterKeyConstants.MAX_CONTEST_ENTRIES:
        name = 'Max contest entries per player';
        break;
      case FilterKeyConstants.RANGE_OF_TOTAL_ENTRIES:
        name = 'Range of total entries';
        break;
      case FilterKeyConstants.EXACT_NO_OF_ENTRIES:
        name = 'Exact number of entries';
        break;
      case FilterKeyConstants.OPPONENT_NAME:
        name = 'Search by opponent name';
        break;
    }
    return name;
  }

  public static getFilterDisplayValue(filter:FilterCriteria,filterSettings:any):string {
    let displayValue:string;
    switch (filter.key) {
      case FilterKeyConstants.TITLE:
        displayValue = filter.value;
        break;
      case FilterKeyConstants.SITE:
        let site:Array<any> = filterSettings[FilterSettingsConstants.SITES];
        site.forEach(currData => {
          if (currData[0] == filter.value) {
            displayValue = currData[1];
          }
        });
        break;
      case FilterKeyConstants.SPORT:
        let sports:Array<any> = filterSettings[FilterSettingsConstants.SPORTS];
        sports.forEach(currData => {
          if (currData[0] == filter.value) {
            displayValue = currData[1];
          }
        });
        break;
      case FilterKeyConstants.SEASON:
        let data:Array<any> = filterSettings[FilterSettingsConstants.SEASONS];
        data.forEach(currData => {
          if (currData[0] == filter.value) {
            displayValue = currData[1];
          }
        });
        break;
      case FilterKeyConstants.CONTEST_TYPE:
        let contestType:Array<any> = filterSettings[FilterSettingsConstants.CATEGORIES];
        contestType.forEach(currData => {
          if (currData[0] == filter.value) {
            displayValue = currData[1];
          }
        });
        break;
      case FilterKeyConstants.TIME_PERIOD:
        let timeData:Array<any> = filterSettings[FilterSettingsConstants.SINCE_FILTER];
        timeData.forEach(currData => {
          if (currData[0] == filter.value) {
            displayValue = currData[1];
          }
        });
        break;
      case FilterKeyConstants.WEEK_DAY:
        let weekData:Array<any> = filterSettings[FilterSettingsConstants.WEEKDAY_FILTER];
        weekData.forEach(currData => {
          if (currData[0] == filter.value) {
            displayValue = currData[1];
          }
        });
        break;
      case FilterKeyConstants.DATE_FROM:
      case FilterKeyConstants.DATE_TO:
      case FilterKeyConstants.DATE_EXACT:
        displayValue = moment(filter.value).format('DD/MM/YYYY');
        break;
      case FilterKeyConstants.FEE:
        let feeData:Array<any> = filterSettings[FilterSettingsConstants.FEES];
        if (!filter.value.min) {
          let minValue = 'up to';
          let maxValue = "";
          feeData.forEach(currData => {
            if (currData[0] == filter.value.max) {
              maxValue = currData[1];
            }
          });
          displayValue = minValue + " " + maxValue;
        }
        else if (!filter.value.max) {
          let minValue = '';
          feeData.forEach(currData => {
            if (currData[0] == filter.value.min) {
              minValue = currData[1];
            }
          });
          let maxValue = 'or higher';
          displayValue = minValue + " " + maxValue;
        } else {
          let minValue = '';
          feeData.forEach(currData => {
            if (currData[0] == filter.value.min) {
              minValue = currData[1];
            }
          });
          let maxValue = '';
          feeData.forEach(currData => {
            if (currData[0] == filter.value.max) {
              maxValue = currData[1];
            }
          });
          displayValue = minValue + " to " + maxValue;
        }
        break;
      case FilterKeyConstants.FREE_ROLL:
        if (filter.value == '0') {
          displayValue = 'Freerolls only';
        }
        else if (filter.value == '1') {
          displayValue = 'Exclude freerolls';
        }
        break;
      case FilterKeyConstants.NO_OF_CONTEST_ENTRIES:
        let heroData:Array<any> = filterSettings[FilterSettingsConstants.HERO_ENTRIES];
        if (!filter.value.min_contest) {
          let minValue = 'up to';
          let maxValue:string = '';
          heroData.forEach(currData => {
            if (currData[0] == filter.value.max_contest) {
              maxValue = currData[1];
            }
          });
          displayValue = minValue + " " + maxValue;
        }
        else if (!filter.value.max_contest) {
          let minValue:string = '';
          heroData.forEach(currData => {
            if (currData[0] == filter.value.min_contest) {
              minValue = currData[1];
            }
          });
          let maxValue = 'or higher';
          displayValue = minValue + " " + maxValue;
        } else {
          let minValue:string = '';
          heroData.forEach(currData => {
            if (currData[0] == filter.value.min_contest) {
              minValue = currData[1];
            }
          });
          let maxValue:string = '';
          heroData.forEach(currData => {
            if (currData[0] == filter.value.max_contest) {
              maxValue = currData[1];
            }
          });
          displayValue = minValue + " to " + maxValue;
        }
        break;
      case FilterKeyConstants.MAX_CONTEST_ENTRIES:
        let maxData:Array<any> = filterSettings[FilterSettingsConstants.MAX_ENTRIES];
        maxData.forEach(currData => {
          if (currData[0] == filter.value) {
            displayValue = currData[1];
          }
        });
        break;
      case FilterKeyConstants.RANGE_OF_TOTAL_ENTRIES:
        let rangeData:Array<any> = filterSettings[FilterSettingsConstants.CONTEST_SIZES];
        rangeData.forEach(currData => {
          if (currData[0] == filter.value) {
            displayValue = currData[1];
          }
        });
        break;
      case FilterKeyConstants.EXACT_NO_OF_ENTRIES:
        displayValue = filter.value;
        break;
      case FilterKeyConstants.OPPONENT_NAME:
        displayValue = filter.value;
        break;
    }
    return displayValue;
  }
}


