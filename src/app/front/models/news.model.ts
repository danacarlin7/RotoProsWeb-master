import {Player} from "./player.model";
import {Team} from "./team.model";
/**
 * Created by Hiren on 01-07-2017.
 */

export interface News{
  _id: string;
  news_date_time: Date;
  news_id: number;
  sport: string;
  news_date: string;
  news_priority: number;
  news_headline: string;
  news_notes: string;
  news_analysis: string;
  team: Team;
  player: Player;
  updated_at: Date;
  created_at: Date;
}
