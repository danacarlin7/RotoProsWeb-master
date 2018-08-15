/**
 * Created by Hiren on 16-07-2017.
 */

export interface GeneratedLineupRecords {
  lineups:GeneratedLineup[];
  usedPlayers:UsedPlayer[];
}

export interface GeneratedLineup {
  players:LineupPlayer[];
  totalFantasyPoints:number;
  totalSalary:number;
}

export interface LineupPlayer {
  salary:number;
  fppg:number;
  team:string;
  position:string;
  fullName:string;
  id:number;
  opponent:string;
  battingOrderConfirmed:boolean;
}

export interface UsedPlayer {
  battingOrderConfirmed:boolean;
  numOfLineups:number;
  team:string;
  position:string;
  fullName:string;
  id:number;
  exposure:string;
  teamLogo:string;
}
