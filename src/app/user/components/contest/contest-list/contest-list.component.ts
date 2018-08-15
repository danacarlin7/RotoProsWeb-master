import {Component, Input} from "@angular/core";
import * as moment from "moment";
import {ContestData} from "../../../models/contest";
import {FilterService} from "../../../services/filter.service";
/**
 * Created by Hiren on 29-04-2017.
 */

@Component({
  selector: 'rf-contest-list',
  templateUrl: './contest-list.component.html',
  styleUrls: ['./contest-list.component.css']
})
export class ContestListComponent {
  tabName:string;

  @Input() records:ContestData[];

  constructor(public filterService:FilterService) {
    this.tabName = this.filterService.activeCohortTab;
  }

  getTitleField():string {
    let name = '';
    if (this.records && this.records.length && this.records[0].hasOwnProperty(this.filterService.activeCohortTab)) {
      name = this.filterService.activeCohortTab;
    }
    else {
      name = 'group';
    }
    return name
  }

  getContestDate(value):string {
    return moment(value).format('YYYY-MM-DD');
  }

  dateSortFunction(event) {
    let comparer = function (a, b):number {
      let formatedA = moment(a.date, "DD.MM.YYYY").format('YYYY-MM-DD');
      let formatedB = moment(b.date, "DD.MM.YYYY").format('YYYY-MM-DD');
      let result:number = -1;

      if (moment(formatedB).isBefore(formatedA, 'day')) result = 1;
      return result * event.order;
    };
    console.log("sort");
    this.records.sort(comparer);
  }
}
