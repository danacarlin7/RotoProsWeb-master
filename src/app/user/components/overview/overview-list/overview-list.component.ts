import {Component, Input} from "@angular/core";
import {OverviewData} from "../../../models/overview-data.model";
import {forEach} from "@angular/router/src/utils/collection";
import {DecimalPipe} from "@angular/common";
/**
 * Created by Hiren on 05-05-2017.
 */

@Component({
  selector: 'rp-overview-list',
  templateUrl: './overview-list.component.html',
  styleUrls: ['./overview-list.component.css']
})
export class OverviewlistComponent {

  overviewData:Array<any>;
  overviewConstants = [
    {label: 'Contests entered', key: 'contests'},
    {label: 'Entries entered', key: 'entries'},
    {label: 'Total won', key: 'wins'},
    {label: 'Entry fees', key: 'fees'},
    {label: 'Net profit/loss', key: 'net'},
    {label: 'ITM', key: 'itm'},
    {label: 'ROI', key: 'roi'},
    {label: 'Average score', key: 'average_score'},
    {label: 'Average win score', key: 'average_win_score'}
  ];

  numberPipe = new DecimalPipe('en-US');

  @Input() set records(value:OverviewData[]) {
    if (!value)
      return;
    this.overviewData = [];
    this.overviewConstants.forEach(row => {
      let data = {};
      data['title'] = row.label;
      value.forEach(record => {
        data[record.group] = record[row.key];
      });
      this.overviewData.push(data);
    })
  }

  getDataStyle(data:any, key:string):Object {
    let styleObj;
    switch (data.title) {
      case 'Total won':
      case 'Entry fees':
      case 'Net profit/loss':
      case 'ITM':
      case 'ROI':
        styleObj = data[key] < 0 ? {'color': 'red'} : {};
        break;
      default:
        styleObj = {};
        break;
    }
    return styleObj;
  }

  getDisplayValue(data:any, key:string):string {
    let displayValue:string = '';
    switch (data.title) {
      case 'Total won':
      case 'Entry fees':
      case 'Net profit/loss':
        if (data[key] < 0) {
          displayValue = (data[key] && !isNaN(data[key])) ? '($' + this.numberPipe.transform(data[key] * -1) + ')' : '-';
        }
        else {
          displayValue = (data[key] && !isNaN(data[key])) ? '$' + this.numberPipe.transform(data[key]) : '-';
        }
        break;
      case 'ITM':
      case 'ROI':
        displayValue = (data[key] && !isNaN(data[key])) ? this.numberPipe.transform(data[key]) + '%' : '-';
        break;
      default:
        displayValue = (data[key] != null && !isNaN(data[key])) ? this.numberPipe.transform(data[key]) : '-';
        break;
    }
    return displayValue;
  }

  constructor() {

  }

}
