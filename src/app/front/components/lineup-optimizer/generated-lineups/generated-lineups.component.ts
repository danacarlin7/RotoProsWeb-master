import {Component} from "@angular/core";
import {LineupOptimizerService} from "../../../services/lineup-optimizer.service";
import {GeneratedLineup, LineupPlayer, UsedPlayer} from "../../../models/generated-lineup.model";
import {Router} from "@angular/router";
import {Game} from "../../../models/adv-filter-setting.model";
import * as moment from "moment";
/**
 * Created by Hiren on 16-07-2017.
 */

@Component({
  selector: 'rp-generated-lineups',
  templateUrl: './generated-lineups.component.html',
  styleUrls: ['./generated-lineups.component.css']
})
export class GeneratedLineupsComponent {

  lineups:GeneratedLineup[];
  usedPlayers:UsedPlayer[];

  activeUsedPlayerTab:'all'|'p'|'h' = 'all';

  constructor(private optimizerService:LineupOptimizerService, private router:Router) {

  }

  ngOnInit() {
    if (this.optimizerService.generatedLineups) {
      this.lineups = this.optimizerService.generatedLineups.lineups;
      this.usedPlayers = this.optimizerService.generatedLineups.usedPlayers;
    }
    else {
      this.router.navigate(['lineup-optimizer']);
    }
  }

  getBattingOrderByPlayerId(id:number):number {
    return this.optimizerService.getBattingOrderByPlayerId(id);
  }

  getOpponentNameByPlayerId(id:number):string {
    return this.optimizerService.getOpponentByPlayerId(id);
  }

  getHomeTeamByPlayerId(id:number) {
    return this.optimizerService.getHomeTeamByPlayerId(id);
  }

  getHomeTeamByAwayTeamName(team:string):string {
    let games:Game[] = this.optimizerService.filterSettings.games;
    for (let i = 0; games && games.length > i; i++) {
      if (games[i].awayTeam == team) {
        return games[i].homeTeam;
      }
    }
    return '';
  }

  getAwayTeamByHomeTeamName(team:string):string {
    let games:Game[] = this.optimizerService.filterSettings.games;
    for (let i = 0; games && games.length > i; i++) {
      if (games[i].homeTeam == team) {
        return games[i].awayTeam;
      }
    }
    return '';
  }

  isAwayTeamPlayer(player:LineupPlayer):boolean {
    let games:Game[] = this.optimizerService.filterSettings.games;
    for (let i = 0; games && games.length > i; i++) {
      if (games[i].awayTeam == player.team) {
        return true;
      }
    }
    return false;
  }

  isHomeTeamPlayer(player:LineupPlayer):boolean {
    let games:Game[] = this.optimizerService.filterSettings.games;
    for (let i = 0; games && games.length > i; i++) {
      if (games[i].homeTeam == player.team) {
        return true;
      }
    }
    return false;
  }

  getSlateName(): string {
    let slateName = '';
    let activeSlate = this.optimizerService.activeSlate;
    if(activeSlate){
      slateName += activeSlate.Slate + " - ";
      slateName += moment(activeSlate.StartTime).format('LLLL');
    }
    return slateName;
  }

  getOperatorName(): string {
    return this.optimizerService.selectedOperator;
  }

  getUsedPlayers():UsedPlayer[] {
    let players:UsedPlayer[];
    switch (this.activeUsedPlayerTab) {
      case 'all':
        players = this.usedPlayers;
        break;
      case 'p':
        players = this.usedPlayers.filter(
          currPlayer => {
            return (currPlayer.position.toLowerCase() == 'p')
          }
        );
        break;
      case 'h':
        players = this.usedPlayers.filter(
          currPlayer => {
            return (currPlayer.position.toLowerCase() != 'p')
          }
        );
        break;
      default:
        players = this.usedPlayers;
        break;
    }
    return players;
  }

}
