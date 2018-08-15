import {Injury} from './injury.model';
/**
 * Created by mrugank on 13/07/17.
 */

export interface Injuries {
  _id: string;
  injury_id: number;
  sport: string;
  stats_global_id?: any;
  sports_data_id: string;
  first_name: string;
  last_name: string;
  position: string;
  injury_status: boolean;
  injury: Injury;
  updated_at: Date;
  created_at: Date;
  player_image: string;
  injury_news_date: Date;
  injury_priority: number;
  injury_headline: string;
  injury_notes: string;
  injury_analysis: string;
}
