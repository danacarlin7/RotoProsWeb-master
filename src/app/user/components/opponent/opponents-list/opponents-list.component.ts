import {Component, Input} from "@angular/core";
import {OpponentData} from "../../../models/opponent-data.model";
import {FilterService} from "../../../services/filter.service";

@Component({
  selector: 'rp-opponents-list',
  templateUrl: './opponents-list.component.html',
  styleUrls: ['./opponents-list.component.css']
})
export class OpponentListComponent {

  @Input() records:OpponentData[];

  constructor(public filterService:FilterService) {

  }

  getDataStyle(data:any, key:string):Object {
    let styleObj;
    switch (data.title) {
      case 'Total won':
      case 'Entry fees':
      case 'Net profit/loss':
      case 'ITM':
      case 'net':
        styleObj = data[key] < 0 ? {'color': 'red'} : {};
        break;
      default:
        styleObj = {};
        break;
    }
    return styleObj;
  }

}
