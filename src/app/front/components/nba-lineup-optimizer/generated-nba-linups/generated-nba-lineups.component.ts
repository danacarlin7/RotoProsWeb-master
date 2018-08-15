
import {Component} from "@angular/core";
import {GeneratedLineup, LineupPlayer, UsedPlayer} from "../../../models/generated-lineup.model";
import {SelectItem} from "primeng/primeng";
import {LineupOptimizerService} from "../../../services/lineup-optimizer.service";
import {Router} from "@angular/router";
import {Game} from "../../../models/adv-filter-setting.model";
import * as moment from "moment";

@Component({
  selector:'rp-generated-nba-lineups',
  templateUrl:'./generated-nba-lineups.component.html',
  styleUrls:['./generated-nba-lineups.component.css']
})
export class GeneratedNBALineupsComponent{

  lineups: GeneratedLineup[];
  usedPlayers: UsedPlayer[];
  positions: SelectItem[];
  selectedPositions: any[] = [];
  activeUsedPlayerTab: 'all' | 'filter' = 'all';
  filtardPlayers: UsedPlayer[];

  constructor(private optimizerService: LineupOptimizerService, private router: Router) {
    this.positions = [];
    this.positions.push({label: 'PG', value: 'PG'});
    this.positions.push({label: 'SG', value: 'SG'});
    this.positions.push({label: 'SF', value: 'SF'});
    this.positions.push({label: 'PF', value: 'PF'});
    this.positions.push({label: 'C', value: 'C'});
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
