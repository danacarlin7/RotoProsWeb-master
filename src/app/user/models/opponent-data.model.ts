/**
 * Created by Hiren on 12-05-2017.
 */

export interface OpponentData{
  _id: string;
  entries: number;
  fee: number;
  net: number;
  total_win_count: number;
  site: string;
  date: Date;
  short_date: string;
  title: string;
  opponent: string;
  win_percentage: number;
}
