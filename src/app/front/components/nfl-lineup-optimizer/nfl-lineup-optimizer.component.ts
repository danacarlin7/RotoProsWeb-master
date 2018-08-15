import {Component, ViewChild} from "@angular/core";
import {Slate} from "../../models/slate.model";
import {LineupOptimizerService} from "../../services/lineup-optimizer.service";
import {OptimizerPlayer} from "../../models/player.model";
import {AdvFilterSettings, Game} from "../../models/adv-filter-setting.model";
import {LineupOppFilterCriteria} from "../../models/filter-criteria.model";
import {NFLAdvFilterComponent} from "./nfl-filters/nfl-filters.component";
import {LineupOppFilterConstants} from "../../constants/lineup-opp.constants";
import {LineupPlayerFilter} from "../../ng-pipes/lineup-opp-filter.pipe";
import {Router} from "@angular/router";
import {GeneratedLineupRecords} from "../../models/generated-lineup.model";
import {AdvFilterValue} from "../../models/adv-filter-value.model";
import {AdvFilterComponent} from "../lineup-optimizer/adv-filter/adv-filter.component";
import {AuthService} from "../../../shared/services/auth.service";
import {Team} from "../../models/team.model";
import {SelectItem} from "primeng/primeng";
import {FacebookPixelEventConstants} from "../../constants/facebook-pixel-event.constants";

/**
 * Created by Hiren on 02-07-2017.
 */

declare var jQuery: any;
declare var fbq: any;

@Component({
  selector: 'rp--nfl-optimizer',
  templateUrl: './nfl-lineup-optimizer.component.html',
  styleUrls: ['./nfl-lineup-optimizer.component.css']
})
export class NFLLineupOptimizerComponent {
  searchStr: string = '';
  selectedOperator: string = 'FanDuel';
  selectedSport: string = 'NFL';
  selectedSlate: number = 0;
  selectedGame: number = 0;
  slates: Slate[];
  allPlayers: OptimizerPlayer[];
  players: OptimizerPlayer[];
  advFilterSettings: AdvFilterSettings;
  isLoading: boolean;
  games: Game[];
  stackingData: { team: string, teamId: number }[];
  lockedPlayers: number[] = [];
  todayDate = new Date();
  isError: boolean;
  isDataError: boolean;
  errorMsg: string;
  errorData: string;
  advFilterValue: AdvFilterValue;
  isSavedFiltersApplied: boolean;
  teams: SelectItem[] = [];
  selectedTeams: string[] = [];
  positionFilterValue: any[] = [];
  positions: SelectItem[];
  @ViewChild('advFilterPopup') advFilterPopup: NFLAdvFilterComponent;

  constructor(private optimizerService: LineupOptimizerService, private router: Router, private authService: AuthService) {
    this.selectedOperator = this.optimizerService.selectedOperator;
    this.optimizerService.selectedSport = this.selectedSport;
    this.selectedSlate = this.optimizerService.selectedSlate;
    this.selectedGame = this.optimizerService.selectedGame;
    this.searchStr = this.optimizerService.searchStr;
    this.initPositionFilter();
  }

  initiateData() {
    this.getSlates();
    this.playersListUpdated();
  }

  initPositionFilter() {
    this.positions = [];
    //QB, RB, WR, TE, K, DST
    this.positions.push({label: 'QB', value: 'QB'});
    this.positions.push({label: 'RB', value: 'RB'});
    this.positions.push({label: 'WR', value: 'WR'});
    this.positions.push({label: 'TE', value: 'TE'});
    if (this.selectedOperator == 'FanDuel') {
      this.positions.push({label: 'K', value: 'K'});
      this.positions.push({label: 'D', value: 'D'});
    }
    if (this.selectedOperator == 'DraftKings') {
      this.positions.push({label: 'DST', value: 'DST'});
    }
  }

  operatorChanged(name: string) {
    if (this.selectedOperator != name) {
      this.selectedOperator = name;
      this.optimizerService.selectedOperator = name;
      this.optimizerService.players = [];
      this.initiateData();
    }
  }

  isSlateChanged: boolean;

  onSlateChanged(event: any) {
    console.log("selected slate => ", event.target.value);
    this.selectedSlate = event.target.value;
    this.optimizerService.selectedSlate = event.target.value;
    this.selectedGame = this.optimizerService.selectedGame = 0;
    this.getPlayers(this.selectedOperator, this.selectedSport, this.selectedSlate);
    this.isSlateChanged = true;
  }

  onPlayerPositionFilterChanged(event) {
    this.applyFilters();
  }

  getSlates() {
    this.isLoading = true;
    this.optimizerService.retrieveSlates(this.selectedOperator, this.selectedSport)
      .subscribe(
        response => {
          this.isLoading = false;
          if (response.statusCode == 200) {
            this.slates = response.data;
            this.slates = this.slates.filter(slate => slate.Slate != "Arcade Mode");
            console.log("slates => ", this.slates);
            if (this.slates && this.slates.length) {
              this.selectedSlate = this.slates[0].SlateID;
              this.optimizerService.selectedSlate = this.selectedSlate;
              this.selectedGame = this.optimizerService.selectedGame = 0;
              this.isSlateChanged = true;
              this.getPlayers(this.selectedOperator, this.selectedSport, this.selectedSlate);
            } else {
              this.isLoading = false;
              this.isError = true;
              this.errorMsg = "No Slates found !!";
              this.errorData = '';
              this.isDataError = true;
            }
          } else {
            this.isLoading = false;
          }
        },
        error => {
          this.isLoading = false;
          this.isError = true;
          this.errorMsg = "Oops! something went wrong while retrieving slates.";
          this.errorData = error.message;
          this.isDataError = true;
          console.log("http error => ", error);
        }
      )
  }

  playersListUpdated() {
    this.optimizerService.players$.subscribe(
      players => {
        this.isLoading = false;
        this.allPlayers = players as OptimizerPlayer[];
        this.players = this.allPlayers.map(player => player);
        console.log("No of players => ", this.players.length);
      }
    )
  }

  getPlayers(operator: string, sport: string, slateId: number) {
    this.isLoading = true;
    this.optimizerService.getPlayers(operator, sport, slateId)
      .subscribe(
        response => {
          this.isLoading = false;
          this.allPlayers = response as OptimizerPlayer[];
          this.players = this.allPlayers.map(player => player);
          console.log("No of players => ", this.players.length);
          this.getStackingData(this.selectedSport, this.selectedSlate);
        },
        error => {
          this.isLoading = false;
          this.isError = true;
          this.errorMsg = "Oops! something went wrong while retrieving players.";
          this.errorData = error.message;
          this.isDataError = true;
          console.log("http error => ", error);
        }
      )
  }

  getFilterSettings(operator: string, sport: string, slateId: number) {
    this.isLoading = true;
    this.optimizerService.retrieveAdvFilterSettings(operator, sport, slateId)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.isLoading = false;
            if (!(response.data instanceof Array)) {
              if (this.authService.isLoggedIn() && this.authService.isSubscriber()) {
                this.optimizerService.retrieveSavedAdvFilterValue()
                  .subscribe(
                    savedFilterResponse => {
                      if (savedFilterResponse.statusCode == 200) {
                        this.advFilterValue = savedFilterResponse.data;
                        if (this.advFilterValue) {
                          this.isSavedFiltersApplied = true;
                          this.positionFilterValue = this.advFilterValue.positionFilter;
                        }
                      }
                      this.advFilterSettings = response.data;
                      this.prepareTeamList();
                      console.log("in retrieve method advFilterValue => ", this.advFilterValue);
                      console.log("in retrieve method advFilterSettings => ", this.advFilterSettings);
                      this.games = this.advFilterSettings.games;
                      if (this.isSlateChanged) {
                        setTimeout(() => {
                          this.applyFilters();
                          this.isSlateChanged = false;
                        }, 50);
                      }
                    },
                    error => {
                      this.isLoading = false;
                      this.isError = true;
                      this.isDataError = true;
                      this.errorMsg = "Oops! something went wrong while retrieving filter settings.";
                      this.errorData = error.message;
                    }
                  );
              } else {
                this.advFilterSettings = response.data;
                console.log("in retrieve method advFilterSettings => ", this.advFilterSettings);
                this.games = this.advFilterSettings.games;
                this.prepareTeamList();
                if (this.isSlateChanged) {
                  setTimeout(() => {
                    this.applyFilters();
                    this.isSlateChanged = false;
                  }, 50);
                }
              }
            }
          } else {
            this.isLoading = false;
          }
        },
        error => {
          this.isLoading = false;
          this.isError = true;
          this.isDataError = true;
          this.errorMsg = "Oops! something went wrong while retrieving filter settings.";
          this.errorData = error.message;
          console.log("http error => ", error);
        }
      )
  }

  getStackingData(sport: string, slateId: number) {
    this.optimizerService.retrieveStackingData(sport, slateId)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.stackingData = response.data;
            console.log("Stacking data => ", this.stackingData);
            this.getFilterSettings(this.selectedOperator, this.selectedSport, this.selectedSlate);
            this.stackingData = this.stackingData.sort((n1, n2) => {
              if (n1.team > n2.team) {
                return 1;
              }
              if (n1.team < n2.team) {
                return -1;
              }
              return 0;
            })
          }
        },
        error => {
          this.isLoading = false;
          this.isError = true;
          this.errorMsg = "Oops! something went wrong while retrieving staking info.";
          this.errorData = error.message;
          this.isDataError = true;
          console.log("http error => ", error);
        }
      )
  }

  selectedGameChanged(event: any) {
    this.selectedGame = event.target.value;
    this.optimizerService.selectedGame = event.target.value;
    this.applyFilters();
  }

  applyFilters() {
    console.log("applyFilters method called");
    let filters: LineupOppFilterCriteria[] = [];
    filters.push(<LineupOppFilterCriteria>{
      filterKey: LineupOppFilterConstants.GAME_TYPE,
      filterValue: this.selectedGame == 0 ? this.games.map(game => game.gameId) : [this.selectedGame],
      maxValue: 0,
      minValue: 0
    });
    filters = filters.concat(this.getFilters());
    this.optimizerService.applyFilters(filters);
  }

  onBtnGenerateLineupClick() {
    this.isLoading = true;
    this.isError = false;
    this.errorMsg = '';
    let activeSlate = this.slates.filter(slate => {
      if (slate.SlateID == this.selectedSlate) {
        return true;
      }
    });
    if (activeSlate && activeSlate.length) {
      this.optimizerService.activeSlate = activeSlate[0];
    }

    this.optimizerService.filterSettings = this.advFilterSettings;

    this.optimizerService.generateLineups(this.prepareLineupData(), this.selectedOperator, this.selectedSport)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.isLoading = false;
            console.log("GenerateLineup response => ", response);
            this.optimizerService.generatedLineups = response.data as GeneratedLineupRecords;
            fbq('trackCustom', FacebookPixelEventConstants.LINEUP_GENERATED_EVENT, {sport_type: 'NFL'});
            this.router.navigate(['nfl-lineups']);
          }
        },
        error => {
          this.isLoading = false;
          this.isError = true;
          this.errorMsg = "Oops! something went wrong while generating lineups.";
          this.errorData = error.message;
          console.log("GenerateLineup response error=> ", error);
        }
      )
  }

  prepareTeamList() {
    let tempTeams = [];
    this.advFilterSettings.games.forEach(
      currGame => {
        tempTeams.push({label: currGame.homeTeam, value: currGame.homeTeam});
        tempTeams.push({label: currGame.awayTeam, value: currGame.awayTeam});
      }
    );
    this.teams = tempTeams.sort((n1, n2) => {
      if (n1.value > n2.value) {
        return 1;
      }
      if (n1.value < n2.value) {
        return -1;
      }
      return 0;
    });
  }

  getFilters(): LineupOppFilterCriteria[] {
    let filters = this.advFilterPopup.getFilters();
    if (this.positionFilterValue && this.positionFilterValue.length) {
      filters.push({
        filterKey: LineupOppFilterConstants.PLAYER_POSITION,
        minValue: '',
        maxValue: '',
        filterValue: this.positionFilterValue
      });
    }
    return filters;
  }

  prepareLineupData() {
    let lineupData = {
      sport: this.selectedSport,
      site: this.selectedOperator,
      players: this.optimizerService.filterPlayers(this.getFilters())
        .filter(currPlayer => !currPlayer.isExcluded)
        .map(currPlayer => {
          return {_id: currPlayer._id, maxExposure: currPlayer.exposureValue, force: currPlayer.isLocked}
        })
    };

    if (this.advFilterPopup.variabilityValue) {
      lineupData['variation'] = this.advFilterPopup.variabilityValue;
    }

    if (this.advFilterPopup.maxExposureValue != 100) {
      lineupData['maxExposure'] = this.advFilterPopup.maxExposureValue;
    }

    if (this.advFilterPopup.noOfUniquePlayersValue != 1) {
      lineupData['numberOfUniquePlayers'] = this.advFilterPopup.noOfUniquePlayersValue;
    }

    if (this.advFilterPopup.noOfLineupValue != 10) {
      lineupData['numberOfLineups'] = this.advFilterPopup.noOfLineupValue;
    }

    if (this.selectedOperator == 'FanDuel' && this.advFilterPopup.salarySettingValue[0] != LineupOptimizerService.NFL_MIN_SALARY_FOR_FANDUAL) {
      lineupData['minTotalSalary'] = this.advFilterPopup.salarySettingValue[0];
    }

    if (this.selectedOperator == 'FanDuel' && this.advFilterPopup.salarySettingValue[1] != LineupOptimizerService.NFL_MAX_SALARY_FOR_FANDUAL) {
      lineupData['maxTotalSalary'] = this.advFilterPopup.salarySettingValue[1];
    }

    if (this.selectedOperator == 'DraftKings' && this.advFilterPopup.salarySettingValue[0] != LineupOptimizerService.NFL_MIN_SALARY_FOR_DRAFT_KING) {
      lineupData['minTotalSalary'] = this.advFilterPopup.salarySettingValue[0];
    }

    if (this.selectedOperator == 'DraftKings' && this.advFilterPopup.salarySettingValue[1] != LineupOptimizerService.NFL_MAX_SALARY_FOR_DRAFT_KING) {
      lineupData['maxTotalSalary'] = this.advFilterPopup.salarySettingValue[1];
    }

    lineupData['no_def_vs_opp_players'] = this.advFilterPopup.noDefVsOpp;
    lineupData['minMaxPlayersFromTeam'] = this.prepareMinMaxPlayerFromTeam();
    lineupData['stacking'] = this.advFilterPopup.getStakingData();
    console.info("lineupData => ", lineupData);
    return lineupData;
  }

  prepareMinMaxPlayerFromTeam(): any[] {
    return this.advFilterPopup.getMinMaxPlayerFromTeam();
  }

  btnExcludePlayerClicked(player: OptimizerPlayer) {
    player.isExcluded = true;
    this.unlockPlayer(player);
    this.filterPlayers();
  }

  onAdvFilterCriteriaChangedEvent(filters: LineupOppFilterCriteria[]) {
    this.applyFilters();
  }

  onSearchStrChanged(event) {
    this.searchStr = event.target.value;
    this.filterPlayers();
  }

  filterPlayers() {
    this.filterPlayersByName(this.searchStr);
    this.filterPlayerByTeams(this.selectedTeams);
  }

  filterPlayersByName(searchStr: string = "") {
    let filters = new LineupPlayerFilter();
    this.players = filters.transform(this.allPlayers, ['FirstName', 'LastName', 'fullName'], searchStr);
  }

  filterPlayerByTeams(teams: string[]) {
    let filterData = [];
    if (teams && teams.length && teams.length != this.teams.length) {
      for (let i = 0; i < teams.length; i++) {
        let currTeam = teams[i];
        for (let j = 0; j < this.players.length; j++) {
          if (currTeam == this.players[j].Team) {
            filterData.push(this.players[j]);
          }
        }
      }
      this.players = filterData;
    }
  }

  togglePlayerLock(player: OptimizerPlayer) {
    if (player.isLocked) {
      this.unlockPlayer(player);

    }
    else {
      if (this.lockedPlayers && this.lockedPlayers.length < 6) {
        this.lockPlayer(player);
      }
    }
  }

  lockPlayer(player: OptimizerPlayer) {
    player.isLocked = true;
    if (this.lockedPlayers && this.lockedPlayers.indexOf(player.PlayerID) == -1) {
      this.lockedPlayers.push(player.PlayerID);
    }
  }

  unlockPlayer(player: OptimizerPlayer) {
    player.isLocked = false;
    if (this.lockedPlayers && this.lockedPlayers.indexOf(player.PlayerID) >= 0) {
      this.lockedPlayers.splice(this.lockedPlayers.indexOf(player.PlayerID), 1);
    }
  }

  onExposureTxtboxBlurEvent(event, player: OptimizerPlayer) {
    let value = event.target.value;
    if (value > 100) {
      event.target.value = 100;
      player.exposureValue = 100;
    }
  }

  onAdvFilterSettingsViewReady() {
    /*this.advFilterValue = {
     variability: 20,
     numberOfUniquePlayers: 4,
     mixMaxSalary: [25000, 30000],
     numberOfLineups: 10,
     maxExposure: 80,
     noBatterVsPitchers: true,
     projectionFilter: [5, 10],
     salaryFilter: [2000, 2200],
     valueFilter: [2, 4],
     battingOrderFilter: [3, 7],
     playerPerTeams: [{teamName: 'ARI', minPlayers: 2, maxPlayers: 3}, {
     teamName: 'ATL',
     minPlayers: 1,
     maxPlayers: 3
     }, {teamName: 'BAL', minPlayers: 0, maxPlayers: 2}],
     stackingTeams: [{name: 'ARI', players: 3}, {name: 'ATL', players: 1}, {name: 'BAL', players: 2}]
     };*/
    this.initiateData();
  }

  onSaveAdvFilterValueEvent(filterValue: AdvFilterValue) {
    if(filterValue){
      filterValue['positionFilter'] = this.positionFilterValue;
    }
    this.optimizerService.updateAdvFilterValue(filterValue)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            console.log("Filter value saved");
            this.advFilterValue = filterValue;
          }
        }
      )
  }

  onRemoveAdvFilterValueEvent() {
    this.positionFilterValue = [];
    this.onSaveAdvFilterValueEvent(null);
  }

  onAdvFilterPopupClick() {
    this.isSavedFiltersApplied = false;
    if (this.authService.isSubscriber()) {
      jQuery(this.advFilterPopup.settingPopup.nativeElement).modal();
    }
    else {
      this.authService.showSubscriptionAlert();
    }
  }

  onTeamFilterValueChange(event) {
    this.filterPlayers();
  }

}
