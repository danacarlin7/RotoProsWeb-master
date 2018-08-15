/**
 * Created by Hiren on 09-07-2017.
 */


export interface AdvFilterSettings {
  _id?:any;
  salaryMin:number;
  salaryMax:number;
  projectionMin:number;
  projectionMax:number;
  valueMin:string;
  valueMax:string;
  games:Game[];
  maxPlayers:number;
}


export interface Game {
  homeTeamId:number;
  homeTeam:string;
  homeTeamLogo:string;
  awayTeamId:number;
  awayTeam:string;
  awayTeamLogo:string;
  gameId:number;
  homeTeamMinValue?:number;
  homeTeamMaxValue?:number;
  awayTeamMinValue?:number;
  awayTeamMaxValue?:number;
}
