/**
 * Created by Hiren on 01-07-2017.
 */

export interface LineupRecord{
  game_time:string;
  game_date:Date;
  sort_date: Date;
  first_team:TeamInfo;
  second_team:TeamInfo;
}

export interface TeamInfo{
  name:string;
  logo_url:string;
  lineup_players:any[];
  pitcher:any;
}

export interface Lineup {
  _id:string;
  game_date:Date;
  sort_date:Date;
  game_time:string;
  game_id:string;
  sport:string;
  team_id:string;
  team_stats_global_id:number;
  team_sports_data_id:string;
  team_code:string;
  team_status:string;
  team_is_home:number;
  team_name:string;
  team_nickname:string;
  team_players:any[];
  team_lineups:any[];
  updated_at:Date;
  created_at:Date;
  __v:number;
  team_wikipedia_logo_url:string;
  team_wikipedia_word_mark_url:string;
  team_city:string;
  starting_pitcher: any;
}

// export interface TeamLineup {
//   lineup_data:LineupData[];
//   lineup_no:number;
//   _id:string;
// }

export interface LineupData {
  _id:string;
  player_fantasy_data_id?:any;
  player_position:string;
  player_last_name:string;
  player_first_name:string;
  player_sports_data_id:string;
  player_stats_global_id:number;
  player_id:number;
}
