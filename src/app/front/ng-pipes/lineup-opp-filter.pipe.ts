import {Pipe, PipeTransform} from "@angular/core";
/**
 * Created by Hiren on 11-07-2017.
 */

@Pipe({
  name: 'lineupOppFilter',
  pure:false
})
export class LineupPlayerFilter implements PipeTransform {
  transform(items:any[], fields:string[], value:string) {
    if (!items)
      return [];
    if (!value)
      value = "";
    return items.filter(
      currItem => {
        let flag:boolean;
        fields.forEach(field => {
          if (currItem.hasOwnProperty(field)) {
            if (currItem[field] && (currItem[field].toLowerCase().indexOf(value.toLowerCase()) > -1)) {
              flag = true;
              return;
            }
          }
          if (field == 'fullName') {
            let fullName = currItem['FirstName'] + ' ' + currItem['LastName'];
            if ((fullName.toLowerCase().indexOf(value.toLowerCase()) > -1)) {
              flag = true;
              return;
            }
          }
        });
        return flag && !currItem['isExcluded'];
      });
  }
}
