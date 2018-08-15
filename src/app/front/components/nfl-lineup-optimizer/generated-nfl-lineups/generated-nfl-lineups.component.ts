import {Component} from "@angular/core";
import {LineupOptimizerService} from "../../../services/lineup-optimizer.service";
import {GeneratedLineup, LineupPlayer, UsedPlayer} from "../../../models/generated-lineup.model";
import {Router} from "@angular/router";
import {Game} from "../../../models/adv-filter-setting.model";
import {SelectItem} from "primeng/primeng";
import {DatePipe} from "@angular/common";
import * as moment from "moment";

@Component({
  selector: 'rp-generated-lineups',
  templateUrl: './generated-nfl-lineups.component.html',
  styleUrls: ['./generated-nfl-lineups.component.css']
})
export class GeneratedNFLLineupsComponent {

  lineups: GeneratedLineup[];
  usedPlayers: UsedPlayer[];
  positions: SelectItem[];
  selectedPositions: any[] = [];
  activeUsedPlayerTab: 'all' | 'filter' = 'all';
  filtardPlayers: UsedPlayer[];

  constructor(private optimizerService: LineupOptimizerService, private router: Router) {
    this.positions = [];
    //QB, RB, WR, TE, K, DST
    this.positions.push({label: 'QB', value: 'QB'});
    this.positions.push({label: 'RB', value: 'RB'});
    this.positions.push({label: 'WR', value: 'WR'});
    this.positions.push({label: 'TE', value: 'TE'});
    if (this.optimizerService.selectedOperator == 'FanDuel') {
      this.positions.push({label: 'K', value: 'K'});
      this.positions.push({label: 'D', value: 'D'});
    }
    if (this.optimizerService.selectedOperator == 'DraftKings') {
      this.positions.push({label: 'DST', value: 'DST'});
    }

  }

  ngOnInit() {
    if (this.optimizerService.generatedLineups) {
      this.lineups = this.optimizerService.generatedLineups.lineups;
      this.usedPlayers = this.optimizerService.generatedLineups.usedPlayers;
      this.filtardPlayers = this.usedPlayers;
    }
    else {
      this.router.navigate(['lineup-optimizer/nfl']);
    }
  }

  getBattingOrderByPlayerId(id: number): number {
    return this.optimizerService.getBattingOrderByPlayerId(id);
  }

  getOpponentNameByPlayerId(id: number): string {
    return this.optimizerService.getOpponentByPlayerId(id);
  }

  getHomeTeamByPlayerId(id: number) {
    return this.optimizerService.getHomeTeamByPlayerId(id);
  }

  getPlayerValueByPlayerId(id: number) {
    return this.optimizerService.getPlayerValueByPlayerId(id);
  }

  getHomeTeamByAwayTeamName(team: string): string {
    let games: Game[] = this.optimizerService.filterSettings.games;
    for (let i = 0; games && games.length > i; i++) {
      if (games[i].awayTeam == team) {
        return games[i].homeTeam;
      }
    }
    return '';
  }

  getAwayTeamByHomeTeamName(team: string): string {
    let games: Game[] = this.optimizerService.filterSettings.games;
    for (let i = 0; games && games.length > i; i++) {
      if (games[i].homeTeam == team) {
        return games[i].awayTeam;
      }
    }
    return '';
  }

  onUsedPlayerTabSelected(tab: any) {
    this.activeUsedPlayerTab = tab;
    if (this.activeUsedPlayerTab == 'all') {
      this.selectedPositions = [];
      this.filtardPlayers = this.usedPlayers;
    }
  }

  onPlayerPositionFilterChanged(event) {
    this.filtardPlayers = this.filterUsedPlayers();
    console.log("filtardPlayers => ", this.filtardPlayers);
  }

  filterUsedPlayers() {
    let filterData = [];
    for (let i = 0; this.usedPlayers && this.usedPlayers.length > i; i++) {
      let currPlayer = this.usedPlayers[i];
      for (let j = 0; this.selectedPositions && this.selectedPositions.length > j; j++) {
        if (currPlayer.position.toLowerCase() == this.selectedPositions[j].toLowerCase()) {
          filterData.push(currPlayer);
          break;
        }
      }
    }
    return filterData;
  }

  isAwayTeamPlayer(player: LineupPlayer): boolean {
    let games: Game[] = this.optimizerService.filterSettings.games;
    for (let i = 0; games && games.length > i; i++) {
      if (games[i].awayTeam == player.team) {
        return true;
      }
    }
    return false;
  }

  isHomeTeamPlayer(player: LineupPlayer): boolean {
    let games: Game[] = this.optimizerService.filterSettings.games;
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

  getUsedPlayers(): UsedPlayer[] {
    let players: UsedPlayer[];
    switch (this.activeUsedPlayerTab) {
      case 'all':
        players = this.usedPlayers;
        break;
      case 'filter':
        players = this.filterUsedPlayers();
        break;
      default:
        players = this.usedPlayers;
        break;
    }
    return players;
  }

}
