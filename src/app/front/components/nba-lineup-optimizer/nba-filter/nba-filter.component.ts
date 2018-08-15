
import {Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from "@angular/core";
import {AdvFilterValue} from "../../../models/adv-filter-value.model";
import {LineupOppFilterCriteria} from "../../../models/filter-criteria.model";
import {SelectItem} from "primeng/primeng";
import {AdvFilterSettings, Game} from "../../../models/adv-filter-setting.model";
import {LineupOptimizerService} from "../../../services/lineup-optimizer.service";
import {AuthService} from "../../../../shared/services/auth.service";
import {LineupOppFilterConstants} from "../../../constants/lineup-opp.constants";

@Component({
  selector:'rp-nba-filter',
  templateUrl:'./nba-filter.component.html',
  styleUrls:['./nba-filter.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NBAFilterComponent{

  isSettingsUpdated:boolean;

  @Input()
  selectedOperator:string;

  variabilitySlider:any;
  noOfUniquePlayersSlider:any;
  salarySlider:any;
  noOfLineupSlider:any;
  maxExposureSlider:any;
  projectionFilterSlider:any;
  salaryFilterSlider:any;
  valueFilterSlider:any;
  battingFilterSlider:any;


  variabilityValue:number;
  noOfUniquePlayersValue:number;
  noOfLineupValue:number;
  maxExposureValue:number = 100;
  salarySettingValue:any[] = [];
  noDefVsOpp:boolean;
//no_def_vs_opp_players
  projectionFilterValue:any[];
  salaryFilterValue:any[];
  valueFilterValue:any[];
  battingOrderFilterValue:any[];
  //positionFilterValue:any[];

  @ViewChild('settingPopup') settingPopup:ElementRef;

  @Input()
  advFilterValue:AdvFilterValue;

  filters:LineupOppFilterCriteria[];

  gamesObj:any = {};

  @Output()
  saveAdvFilterValueEvent:EventEmitter<AdvFilterValue> = new EventEmitter<AdvFilterValue>();

  @Output()
  removeAdvFilterValueEvent:EventEmitter<null> = new EventEmitter<null>();

  @Output()
  viewRenderedEvent:EventEmitter<any> = new EventEmitter<any>();

  @Output()
  filterCriteriaChanged:EventEmitter<LineupOppFilterCriteria[]> = new EventEmitter<LineupOppFilterCriteria[]>();

  private _advFilterSettings:AdvFilterSettings;

  get advFilterSettings():AdvFilterSettings {
    return this._advFilterSettings;
  }

  @Input()
  set advFilterSettings(value:AdvFilterSettings) {
    this._advFilterSettings = value;
    this.updateSliders();
    if (this._advFilterSettings) {
      this.resetGames();
    }
    if (this.advFilterValue) {
      console.log("in setter advFilterValue => ", this.advFilterValue);
      setTimeout(()=> {
        this.setSliderValues();
        this.setGameValues();
        this.setStackingValues();
        this.emitFilterChangeEvent();
        //this.positionFilterValue = this.advFilterValue.positionFilter;
      }, 20);
    }

  }

  //positions:SelectItem[];
  isLogIn:boolean;

  lineupOptimizerServiceConst = LineupOptimizerService;

  constructor(private authService:AuthService) {
    this.isLogIn = this.authService.isLoggedIn();
  }

  ngAfterViewInit() {
    this.variabilitySlider = jQuery("#Variability");
    this.variabilitySlider.bootstrapSlider({
      min: 0,
      max: 100,
      value: 0
    });
    this.variabilityValue = 0;
    this.variabilitySlider.on("slide", (slideEvt) => {
      this.variabilityValue = slideEvt.value;
      this.isSettingsUpdated = true;
      console.log("variabilityValue => ", this.variabilityValue);
    });
    this.variabilitySlider.on("slideStop", (slideEvt) => {
      this.isSettingsUpdated = true;
      this.variabilityValue = slideEvt.value;
    });
    this.noOfLineupSlider = jQuery("#nlp");
    this.noOfLineupSlider.bootstrapSlider({
      min: 1,
      max: 200,
      value: 10
    });
    this.noOfLineupValue = 10;
    this.noOfLineupSlider.on("slide", (slideEvt) => {
      this.noOfLineupValue = slideEvt.value;
      this.isSettingsUpdated = true;
    });
    this.noOfLineupSlider.on("slideStop", (slideEvt) => {
      this.isSettingsUpdated = true;
      this.noOfLineupValue = slideEvt.value;
    });
    this.noOfUniquePlayersSlider = jQuery("#nup");
    this.noOfUniquePlayersSlider.bootstrapSlider({
      min: 1,
      max: 5,
      value: 1
    });
    this.noOfUniquePlayersValue = 1;
    this.noOfUniquePlayersSlider.on("slide", (slideEvt) => {
      this.noOfUniquePlayersValue = slideEvt.value;
      this.isSettingsUpdated = true;
    });
    this.noOfUniquePlayersSlider.on("slideStop", (slideEvt) => {
      this.isSettingsUpdated = true;
      this.noOfUniquePlayersValue = slideEvt.value;
    });
    this.maxExposureSlider = jQuery("#me");
    this.maxExposureSlider.bootstrapSlider({
      min: 10,
      max: 100,
      value: 100
    });
    this.maxExposureValue = 100;
    this.maxExposureSlider.on("slide", (slideEvt) => {
      this.maxExposureValue = slideEvt.value;
      this.isSettingsUpdated = true;
    });
    this.maxExposureSlider.on("slideStop", (slideEvt) => {
      this.isSettingsUpdated = true;
      this.maxExposureValue = slideEvt.value;
    });
    this.salarySlider = jQuery("#mms");
    this.salarySlider.bootstrapSlider({
      range: true,
      max: 6,
      min: 0
    });
    this.salarySettingValue = [0, 6];
    this.salarySlider.on("slide", (slideEvt) => {
      let b = slideEvt.value;
      this.salarySettingValue = b;
      this.isSettingsUpdated = true;
    });
    this.salarySlider.on("slideStop", (slideEvt) => {
      this.isSettingsUpdated = true;
      this.salarySettingValue = slideEvt.value;
    });
    this.projectionFilterSlider = jQuery("#ProjectionFilter");
    this.projectionFilterSlider.bootstrapSlider({
      min: 1,
      max: 34.50,
      step: 0.5,
      value: [1, 20.50]
    });
    this.projectionFilterSlider.on("slide", function (slideEvt) {
      var b = slideEvt.value.toString();
      var a = b.split(",");
      this.projectionFilterValue = slideEvt.value;
      this.isSettingsUpdated = true;
    });
    this.projectionFilterSlider.on("slideStop", (slideEvt) => {
      this.projectionFilterValue = slideEvt.value;
      this.emitFilterChangeEvent();
    });
    this.salaryFilterSlider = jQuery("#SalaryFilter");
    this.salaryFilterSlider.bootstrapSlider({
      min: 100,
      max: 1000,
      step: 100,
      value: [100, 500]
    });
    this.salaryFilterSlider.on("slide", function (slideEvt) {
      var b = slideEvt.value.toString();
      var a = b.split(",");
      this.salaryFilterValue = slideEvt.value;
      this.isSettingsUpdated = true;
    });
    this.salaryFilterSlider.on("slideStop", (slideEvt) => {
      this.salaryFilterValue = slideEvt.value;
      this.emitFilterChangeEvent();
    });
    this.valueFilterSlider = jQuery("#ValueFilter");
    this.valueFilterSlider.bootstrapSlider({
      min: 0,
      max: 4,
      step: 0.05,
      value: [0, 2.3]
    });
    this.valueFilterSlider.on("slide", function (slideEvt) {
      var b = slideEvt.value.toString();
      var a = b.split(",");
      this.valueFilterValue = slideEvt.value;
    });
    this.valueFilterSlider.on("slideStop", (slideEvt) => {
      this.valueFilterValue = slideEvt.value;
      this.emitFilterChangeEvent();
      this.isSettingsUpdated = true;
    });
    this.battingFilterSlider = jQuery("#BattingOrder");
    this.battingFilterSlider.bootstrapSlider({
      min: 0,
      max: 9,
      step: 1,
      value: [0, 9]
    });
    this.battingFilterSlider.on("slide", function (slideEvt) {
      var b = slideEvt.value.toString();
      var a = b.split(",");
      this.battingOrderFilterValue = slideEvt.value;
      this.isSettingsUpdated = true;
    });
    this.battingFilterSlider.on("slideStop", (slideEvt) => {
      this.battingOrderFilterValue = slideEvt.value;
      this.emitFilterChangeEvent();
    });
    this.viewRenderedEvent.emit(true);
  }

  updateSliders() {
    if (this.variabilitySlider) {
      this.variabilityValue = 0;
      this.variabilitySlider.bootstrapSlider('setValue', this.variabilityValue);
    }
    if (this.noOfLineupSlider) {
      this.noOfLineupValue = 10;
      this.noOfLineupSlider.bootstrapSlider('setValue', this.noOfLineupValue);
    }
    if (this.noOfUniquePlayersSlider) {
      this.noOfUniquePlayersValue = 1;
      this.noOfUniquePlayersSlider.bootstrapSlider('setValue', this.noOfUniquePlayersValue);
    }
    if (this.maxExposureSlider) {
      this.maxExposureValue = 100;
      this.maxExposureSlider.bootstrapSlider('setValue', this.maxExposureValue);
    }
    if (this.salarySlider) {
      let salarySliderValue = this.salarySlider.data('bootstrapSlider').getValue();
      let maxSalary:number;
      let minSalary:number;
      switch (this.selectedOperator) {
        case 'FanDuel':
          minSalary = this.lineupOptimizerServiceConst.NBA_MIN_SALARY_FOR_FANDUAL;
          maxSalary = this.lineupOptimizerServiceConst.NBA_MAX_SALARY_FOR_FANDUAL;
          break;
        case 'DraftKings':
          minSalary = this.lineupOptimizerServiceConst.NBA_MIN_SALARY_FOR_DRAFT_KING;
          maxSalary = this.lineupOptimizerServiceConst.NBA_MAX_SALARY_FOR_DRAFT_KING;
          break;
      }
      this.salarySlider.bootstrapSlider({
        range: true,
        max: maxSalary,
        min: minSalary,
        step: 100
      });
      this.salarySettingValue = [minSalary, maxSalary];
      this.salarySlider.bootstrapSlider('setValue', [minSalary, maxSalary]);
    }
    if (this.salaryFilterSlider) {
      let salarySliderValue = this.salaryFilterSlider.data('bootstrapSlider').getValue();
      this.salaryFilterSlider.bootstrapSlider({
        range: true,
        max: this._advFilterSettings.salaryMax,
        min: this._advFilterSettings.salaryMin,
        step: 100
      });
      this.salaryFilterSlider.bootstrapSlider('setValue', [this._advFilterSettings.salaryMin, this._advFilterSettings.salaryMax]);
      this.salaryFilterValue = [this._advFilterSettings.salaryMin, this._advFilterSettings.salaryMax];
    }
    if (this.projectionFilterSlider) {
      let projectionFilterValue = this.projectionFilterSlider.data('bootstrapSlider').getValue();
      this.projectionFilterSlider.bootstrapSlider({
        range: true,
        min: this._advFilterSettings.projectionMin,
        max: this._advFilterSettings.projectionMax,
        step: 0.5
      });
      this.projectionFilterSlider.bootstrapSlider('setValue', [this._advFilterSettings.projectionMin, this._advFilterSettings.projectionMax]);
      this.projectionFilterValue = [this._advFilterSettings.projectionMin, this._advFilterSettings.projectionMax];
    }
    if (this.valueFilterSlider) {
      let valueFilterSliderValue = this.valueFilterSlider.data('bootstrapSlider').getValue();
      this.valueFilterSlider.bootstrapSlider({
        range: true,
        max: this._advFilterSettings.valueMax,
        min: this._advFilterSettings.valueMin,
        step: 0.05
      });
      this.valueFilterSlider.bootstrapSlider('setValue', [this._advFilterSettings.valueMin, this._advFilterSettings.valueMax]);
      this.valueFilterValue = [this._advFilterSettings.valueMin, this._advFilterSettings.valueMax];
    }
    this.battingOrderFilterValue = [0, 9];
  }

  setSliderValues() {
    if (this.salarySlider && this.advFilterValue.mixMaxSalary && this.advFilterValue.mixMaxSalary.length) {
      this.salarySettingValue = this.advFilterValue.mixMaxSalary;
      console.log("this.advFilterValue.mixMaxSalary", this.advFilterValue.mixMaxSalary);
      console.log("this.salarySettingValue => ", this.salarySettingValue);
      this.salarySlider.bootstrapSlider('setValue', this.salarySettingValue);
    }
    if (this.noOfUniquePlayersSlider && this.advFilterValue.numberOfUniquePlayers) {
      this.noOfUniquePlayersValue = this.advFilterValue.numberOfUniquePlayers;
      this.noOfUniquePlayersSlider.bootstrapSlider('setValue', this.noOfUniquePlayersValue);
    }
    if (this.variabilitySlider && this.advFilterValue.variability) {
      this.variabilityValue = this.advFilterValue.variability;
      console.log("this.advFilterValue.variability => ", this.advFilterValue.variability);
      this.variabilitySlider.bootstrapSlider('setValue', this.variabilityValue);
    }
    if (this.noOfLineupSlider && this.advFilterValue.numberOfLineups) {
      this.noOfLineupValue = this.advFilterValue.numberOfLineups;
      this.noOfLineupSlider.bootstrapSlider('setValue', this.noOfLineupValue);
    }
    if (this.maxExposureSlider && this.advFilterValue.maxExposure) {
      this.maxExposureValue = this.advFilterValue.maxExposure;
      this.maxExposureSlider.bootstrapSlider('setValue', this.maxExposureValue);
    }
    this.noDefVsOpp = this.advFilterValue.noBatterVsPitchers;
    if (this.salaryFilterSlider && this.advFilterValue.salaryFilter && this.advFilterValue.salaryFilter.length) {
      this.salaryFilterValue = this.advFilterValue.salaryFilter;
      this.salaryFilterSlider.bootstrapSlider('setValue', this.salaryFilterValue);
    }
    if (this.projectionFilterSlider && this.advFilterValue.projectionFilter && this.advFilterValue.projectionFilter.length) {
      this.projectionFilterValue = this.advFilterValue.projectionFilter;
      this.projectionFilterSlider.bootstrapSlider('setValue', this.projectionFilterValue);
    }
    if (this.valueFilterSlider && this.advFilterValue.valueFilter && this.advFilterValue.valueFilter.length) {
      this.valueFilterValue = this.advFilterValue.valueFilter;
      this.valueFilterSlider.bootstrapSlider('setValue', this.valueFilterValue);
    }
    if (this.battingFilterSlider && this.advFilterValue.battingOrderFilter && this.advFilterValue.battingOrderFilter.length) {
      this.battingOrderFilterValue = this.advFilterValue.battingOrderFilter;
      this.battingFilterSlider.bootstrapSlider('setValue', this.battingOrderFilterValue);
    }
  }

  setGameValues() {
    if (this.advFilterValue.playerPerTeams) {
      this.advFilterValue.playerPerTeams.forEach(
        currValue => {
          this._advFilterSettings.games.forEach(
            game => {
              if (game.homeTeam == currValue.teamName) {
                game.homeTeamMinValue = currValue.minPlayers;
                game.homeTeamMaxValue = currValue.maxPlayers;
                return;
              }
              if (game.awayTeam == currValue.teamName) {
                game.awayTeamMinValue = currValue.minPlayers;
                game.awayTeamMaxValue = currValue.maxPlayers;
                return;
              }
            })
        })
    }
  }

  setStackingValues() {
    /*    if (this.advFilterValue.stackingTeams) {
     this.advFilterValue.stackingTeams.forEach(
     (currValue, i) => {
     if (i == 0) {
     this.stackingTeam_QB_WR = currValue;
     } else if (i == 1) {
     this.stackingTeam_QB_WR_TB = currValue;
     } else if (i == 2) {
     this.stackingTeam_QB_TB = currValue;
     }
     }
     )
     }*/
  }

  emitFilterChangeEvent() {
    this.isSettingsUpdated = true;
    this.filterCriteriaChanged.emit(this.getFilters());
  }

  getFilters():LineupOppFilterCriteria[] {
    this.prepareFilters();
    return this.filters;
  }

  prepareFilters() {
    this.filters = [];
    if (this.projectionFilterValue[0] != this._advFilterSettings.projectionMin || this.projectionFilterValue[0] != this._advFilterSettings.projectionMax) {
      this.filters.push({
        filterKey: LineupOppFilterConstants.PROJECTION,
        minValue: this.projectionFilterValue[0],
        maxValue: this.projectionFilterValue[1],
        filterValue: this.projectionFilterValue
      });
    }

    if (this.salaryFilterValue[0] != this._advFilterSettings.salaryMin || this.salaryFilterValue[0] != this._advFilterSettings.salaryMax) {
      this.filters.push({
        filterKey: LineupOppFilterConstants.PLAYER_SALARY,
        minValue: this.salaryFilterValue[0],
        maxValue: this.salaryFilterValue[1],
        filterValue: this.salaryFilterValue
      });
    }

    if (this.battingOrderFilterValue[0] != 0 || this.battingOrderFilterValue[0] != 9) {
      this.filters.push({
        filterKey: LineupOppFilterConstants.PLAYER_BATTING_ORDER,
        minValue: this.battingOrderFilterValue[0],
        maxValue: this.battingOrderFilterValue[1],
        filterValue: this.battingOrderFilterValue
      });
    }
    if (this.valueFilterValue[0] != this._advFilterSettings.valueMin || this.valueFilterValue[0] != this._advFilterSettings.valueMax) {
      this.filters.push({
        filterKey: LineupOppFilterConstants.PLAYER_VALUE,
        minValue: this.valueFilterValue[0],
        maxValue: this.valueFilterValue[1],
        filterValue: this.valueFilterValue
      });
    }
  }

  onGameClick(game:Game) {
    console.log("Game => ", game);
  }

  getMaxGameValue():number {
    let value:number;
    switch (this.selectedOperator) {
      case 'FanDuel':
        value = 4;
        break;
      case 'DraftKings':
        value = 8;
        break;
    }
    return value;
  }

  onGlobalMaxValueChanged(event) {
    if (this.getMaxGameValue() < +event.target.value) {
      event.target.value = this.getMaxGameValue();
    }
    this._advFilterSettings.games.forEach(
      game => {
        game.homeTeamMaxValue = game.awayTeamMaxValue = +event.target.value;
      }
    )
  }

  validateHomeTeamMinValue(event, game) {
    let value = event.target.value;
    if (value > game.homeTeamMaxValue) {
      event.target.value = 0;
      game.homeTeamMinValue = 0;
    }
  }

  validateAwayTeamMinValue(event, game) {
    let value = event.target.value;
    if (value > game.awayTeamMaxValue) {
      event.target.value = 0;
      game.awayTeamMinValue = 0;
    }
  }

  saveAdvFilters() {
    let filterValue:AdvFilterValue = <AdvFilterValue>{
      variability: this.variabilityValue,
      numberOfUniquePlayers: this.noOfUniquePlayersValue,
      mixMaxSalary: this.salarySettingValue,
      numberOfLineups: this.noOfLineupValue,
      maxExposure: this.maxExposureValue,
      noBatterVsPitchers: this.noDefVsOpp,
      projectionFilter: this.projectionFilterValue,
      salaryFilter: this.salaryFilterValue,
      valueFilter: this.valueFilterValue,
      battingOrderFilter: this.battingOrderFilterValue,
      playerPerTeams: this.getMinMaxPlayerFromTeam()
    };
    this.saveAdvFilterValueEvent.emit(filterValue);
  }

  getMinMaxPlayerFromTeam():{teamName:string,minPlayers:number,maxPlayers:number}[] {
    let teams:{teamName:string,minPlayers:number,maxPlayers:number}[] = [];
    let defaultMinValue = 0;
    let defaultMaxValue = 0;
    if (this.selectedOperator == 'FanDuel') {
      defaultMinValue = 0;
      defaultMaxValue = 4;
    }
    if (this.selectedOperator == 'DraftKings') {
      defaultMinValue = 0;
      defaultMaxValue = 8;
    }
    this.advFilterSettings.games.forEach(
      currGame => {
        if (currGame.homeTeamMinValue != defaultMinValue || currGame.homeTeamMaxValue != defaultMaxValue) {
          teams.push({
            teamName: currGame.homeTeam,
            minPlayers: +currGame.homeTeamMinValue,
            maxPlayers: +currGame.homeTeamMaxValue
          });
        }
        if (currGame.awayTeamMinValue != defaultMinValue || currGame.awayTeamMaxValue != defaultMaxValue) {
          teams.push({
            teamName: currGame.awayTeam,
            minPlayers: +currGame.awayTeamMinValue,
            maxPlayers: +currGame.awayTeamMaxValue
          })
        }
      }
    );
    return teams;
  }

  onBtnSaveAdvFilterValueClicked() {
    if (this.isSettingsUpdated) {
      this.saveAdvFilters();
      this.isSettingsUpdated = false;
    }
  }

  onBtnRestoreDefaultClicked() {
    this.updateSliders();
    this.resetGames();
    this.noDefVsOpp = false;
    this.emitFilterChangeEvent();
    this.isSettingsUpdated = true;
    this.removeAdvFilterValueEvent.emit(null);
  }

  resetGames() {
    this._advFilterSettings.games.forEach(
      game => {
        game.homeTeamMinValue = 0;
        game.awayTeamMinValue = 0;
        game.awayTeamMaxValue = this.getMaxGameValue();
        game.homeTeamMaxValue = this.getMaxGameValue();
      }
    )
  }

}
