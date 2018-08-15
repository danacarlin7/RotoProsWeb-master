/**
 * Created by Hiren on 25-04-2017.
 */

export interface ContestHistory {
  _id:string;
  created_at:Date;
  imported:number;
  size:string;
  path:string;
  generated_name:string;
  original_name:string;
  website:string;
}

export interface ContestTopWin {
  _id:string;
  entry_fee:number;
  net:number;
  website:string;
  score:number;
}

export interface ContestData {
  _id:string;
  entries:number;
  site:string;
  sport:string;
  date:Date;
  short_date:string;
  title:string;
  total_entries:string;
  fee:string;
  net:number;
  prize_pool:string;
}
