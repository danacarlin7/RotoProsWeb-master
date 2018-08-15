import {Injury} from "./injury.model";

/**
 * Created by Hiren on 01-07-2017.
 */

export interface Player {
  player_id: number;
  player_stats_global_id: number;
  player_sports_data_id: string;
  player_first_name: string;
  player_last_name: string;
  player_fantasy_data_id: number;
  player_position: string;
  player_link: string;
  injury_status: boolean;
  injury: Injury;
  player_image: string;
}


export interface OptimizerPlayer {
  _id: string;
  PlayerID: number;
  Name: string;
  FirstName: string;
  LastName: string;
  Position: string;
  PositionCategory: string;
  TeamID: number;
  Team: string;
  BattingOrder?: number;
  BattingOrderConfirmed: boolean;
  OpponentID: number;
  Opponent: string;
  Salary: number;
  vsPitcher: string;
  Runs?: any;
  OverUnder?: any;
  Line?: any;
  Points: number;
  Value?: any;
  InjuryStatus?: any;
  InjuryBodyPart?: any;
  InjuryNotes?: any;
  BatHand: string;
  ThrowHand: string;
  GameID: number;
  isExcluded: boolean;
  exposureValue: number;
  isLocked: boolean;
  SlateIds: number[];
  GameKey: string;
  GameDate: Date;
  Week: number;
  TotalPoints: number;
  TeamPoints: number;
  OppPoints: number;
  Temperature?: any;
  Humidity?: any;
  WindSpeed?: any;
  OpponentRank: number;
  OpponentPositionRank: number;
  Minutes: number;
  NBAPoints: number;
  Assists: number;
  Steals: number;
  BlockedShots: number;
  Turnovers: number
  Rebounds:any;
}
