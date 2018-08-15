/**
 * Created by Hiren on 08-08-2017.
 */
import {Pipe, PipeTransform} from "@angular/core";
@Pipe({
  name: 'stackingDataFilter',
  pure: false
})
export class StackingDataFilter implements PipeTransform {
  transform(items:any[], team1, team2) {
    if (!items)
      return [];
    return items.filter(
      currItem => {
        let flag:boolean = false;
        if (team1.name != currItem.team && team2.name != currItem.team) {
          flag = true;
        }
        return flag;
      });
  }
}
