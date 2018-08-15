import {Component, Input} from "@angular/core";
import {UserContestData} from "../../../models/user-contest-data.model";
/**
 * Created by Hiren on 26-04-2017.
 */


@Component({
  selector: 'rp-dashboard-statics',
  templateUrl: './dashboard-statics.component.html',
  styleUrls: ['./dashboard-statics.component.css']
})
export class DashboardStaticsComponent {

  @Input() contestData:UserContestData;

  constructor() {

  }

}
