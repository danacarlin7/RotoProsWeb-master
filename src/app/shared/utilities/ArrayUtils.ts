/**
 * Created by Hiren on 21-01-2017.
 */
export class ArrayUtils {
  static sort(arr:Array<any>, sortField:string, descending:boolean = false):Array<any> {
    if (!arr)
      return [];
    return arr.sort((a, b) => {
      if (a[sortField] > b[sortField])
        return descending ? -1 : 1;
      else if (a[sortField] < b[sortField])
        return descending ? 1 : -1;
      else
        return 0;
    })
  }

  static reverseSlice(arr:Array<any>,skip,limit):Array<any>{
    let arrLength:number = arr.length;
    let dataArr = [].concat(arr);
    dataArr.reverse();
    if ((arrLength - skip) > limit) {
      dataArr = dataArr.slice(skip,skip+limit);
    }
    else if (skip < arrLength) {
      dataArr = dataArr.slice(skip);
    }
    else {
      dataArr = [];
    }
    return dataArr.reverse();
  }
}
