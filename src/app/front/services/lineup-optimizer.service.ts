import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {AuthService} from "../../shared/services/auth.service";
import {environment} from "../../../environments/environment";
import {Observable, BehaviorSubject, Subject} from "rxjs/Rx";
import {AdvFilterSettings} from "../models/adv-filter-setting.model";
import {OptimizerPlayer} from "../models/player.model";
import {FilterCriteria} from "../../user/models/filter-criteria.model";
import {LineupOppFilterCriteria} from "../models/filter-criteria.model";
import {LineupOppFilterConstants} from "../constants/lineup-opp.constants";
import {GeneratedLineupRecords} from "../models/generated-lineup.model";
import {Slate} from "../models/slate.model";
import {AdvFilterValue} from "../models/adv-filter-value.model";
import {ArrayUtils} from "../../shared/utilities/ArrayUtils";

/**
 * Created by Hiren on 05-07-2017.
 */

@Injectable()
export class LineupOptimizerService {

  public static MLB_MIN_SALARY_FOR_DRAFT_KING: number = 30000;
  public static MLB_MAX_SALARY_FOR_DRAFT_KING: number = 50000;
  public static MLB_MIN_SALARY_FOR_FANDUAL: number = 20000;
  public static MLB_MAX_SALARY_FOR_FANDUAL: number = 35000;
  public static NFL_MIN_SALARY_FOR_DRAFT_KING: number = 25000;
  public static NFL_MAX_SALARY_FOR_DRAFT_KING: number = 50000;
  public static NFL_MIN_SALARY_FOR_FANDUAL: number = 30000;
  public static NFL_MAX_SALARY_FOR_FANDUAL: number = 60000;
  public static NBA_MIN_SALARY_FOR_DRAFT_KING: number = 25000;
  public static NBA_MAX_SALARY_FOR_DRAFT_KING: number = 50000;
  public static NBA_MIN_SALARY_FOR_FANDUAL: number = 30000;
  public static NBA_MAX_SALARY_FOR_FANDUAL: number = 60000;

  searchStr: string = '';
  selectedOperator: string = 'FanDuel';
  selectedSport: string;
  selectedSlate: number = 0;
  selectedGame: number = 0;
  filterSettings: AdvFilterSettings;

  activeSlate: Slate;
  slates: Slate;

  players: OptimizerPlayer[];
  playersSubject: Subject<OptimizerPlayer[]> = new Subject<OptimizerPlayer[]>();
  players$: Observable<OptimizerPlayer[]> = this.playersSubject.asObservable();

  private _generatedLineups: GeneratedLineupRecords;

  get generatedLineups(): GeneratedLineupRecords {
    return this._generatedLineups;
  }

  set generatedLineups(value: GeneratedLineupRecords) {
    this._generatedLineups = value;
  }

  constructor(private http: Http, private authService: AuthService) {

  }

  getToken(): string {
    return environment.token;
  }

  getHeaders(): Headers {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    if (this.getToken()) {
      headers.append('Authorization', 'Bearer ' + this.getToken());
    }
    return headers;
  }

  getPlayers(operator: string, sport: string, slateId: number, time: string = null): Observable<OptimizerPlayer[]> {
    return new Observable<OptimizerPlayer[]>(
      observer => {
        /* if (this.players && this.players.length && this.selectedSport == sport) {
         observer.next(this.players);
         }
         else {*/
        this.retrievePlayers(operator, sport, slateId, time)
          .subscribe(
            response => {
              if (response.statusCode == 200) {
                this.players = response.data.map(currPlayer => {
                  if (currPlayer.BattingOrder == null) {
                    currPlayer.BattingOrder = 0;
                  }
                  if (currPlayer.Value == null) {
                    currPlayer.Value = 0;
                  }
                  return currPlayer;
                });
                this.players = ArrayUtils.sort(this.players, 'Salary', true);
                observer.next(this.players);
              }
            },
            error => {
              observer.error(error);
            },
            () => {
              observer.complete()
            }
          );
      }
    ).share();
  }

  retrieveSlates(operator: string, sport: string, time: string = null): Observable<any> {
    let url = 'optimizer/slates?operator=' + operator + '&sport=' + sport;
    if (time) {
      url += "&" + time;
    }
    return this.http.get(environment.api_end_point + url, {headers: this.getHeaders()})
      .map((reponse: Response) => reponse.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  retrievePlayers(operator: string, sport: string, slateId: number, time: string = null): Observable<any> {
    let url = environment.api_end_point + 'optimizer/playersBySlate?sport=' + sport + '&operator=' + operator;
    if (slateId != 0) {
      url += '&slate_id=' + slateId;
    }
    if (time) {
      url += "&" + time;
    }
    return this.http.get(url, {headers: this.getHeaders()})
      .map((reponse: Response) => reponse.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  generateLineups(data: any, operator: string, sport: string, time: string = null): Observable<any> {
    let url = 'optimizer/lineups?sport=' + sport + '&operator=' + operator;
    if (time) {
      url += "&" + time;
    }
    return this.http.post(environment.api_end_point + url, JSON.stringify(data), {headers: this.getHeaders()})
      .map((reponse: Response) => reponse.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  retrieveAdvFilterSettings(operator: string, sport: string, slateId: number, time: string = null): Observable<any> {
    let url = environment.api_end_point + 'optimizer/filter?sport=' + sport + '&operator=' + operator;
    // let url = environment.api_end_point + 'api/optimizer/newSettings?sport=' + sport + '&operator=' + operator;
    if (slateId != 0) {
      url += '&slate_id=' + slateId;
    }
    if (time) {
      url += "&" + time;
    }
    return this.http.get(url, {headers: this.getHeaders()})
      .map((reponse: Response) => reponse.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }


  retrieveStackingData(sport: string, slateId: number, time: string = null): Observable<any> {
    let url = environment.api_end_point + 'optimizer/stacking?sport=' + sport;
    if (slateId != 0) {
      url += '&slate_id=' + slateId;
    }
    if (time) {
      url += "&" + time;
    }
    return this.http.get(url, {headers: this.getHeaders()})
      .map((reponse: Response) => reponse.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  updateAdvFilterValue(filterValue: AdvFilterValue): Observable<any> {
    /* return new Observable(
     observer => {
     if (filterValue) {
     localStorage.setItem('advFilterValue', JSON.stringify(filterValue));
     }
     observer.next(true);
     observer.complete();
     }
     )*/
    return this.http.post(environment.api_end_point + 'api/optimizer/settings', filterValue ? filterValue : [], {headers: this.getHeaders()})
      .map((reponse: Response) => reponse.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  retrieveSavedAdvFilterValue(): Observable<any> {
    /*return new Observable(
     observer => {
     let valueStr:string = localStorage.getItem('advFilterValue');
     let valueObj = null;
     try {
     valueObj = JSON.parse(valueStr);
     } catch (e) {
     console.log("advFilter value parse error");
     }
     observer.next(valueObj);
     observer.complete();
     }
     )*/
    return this.http.get(environment.api_end_point + 'api/optimizer/settings', {headers: this.getHeaders()})
      .map((reponse: Response) => reponse.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  removeAdvFilterValue() {
    localStorage.removeItem('advFilterValue');
  }

  handelError(error: any) {
    if (error.statusCode == 401) {
      this.authService.logout();
    }
  }

  getBattingOrderByPlayerId(id: number): number {
    let order: number = 0;
    this.players.forEach(player => {
      if (player.PlayerID == id) {
        order = player.BattingOrder;
        return;
      }
    });
    return order;
  }

  getOpponentByPlayerId(id: number): string {
    let opponent: string = "";
    this.players.forEach(player => {
      if (player.PlayerID == id) {
        opponent = player.Opponent;
        return;
      }
    });
    return opponent;
  }

  getHomeTeamByPlayerId(id: number): string {
    let team: string = "";
    this.players.forEach(player => {
      if (player.PlayerID == id) {
        team = player.Team;
        return;
      }
    });
    return team;
  }

  getPlayerValueByPlayerId(id: number): number {
    let value: number = 0;
    this.players.forEach(player => {
      if (player.PlayerID == id) {
        value = player.Value;
        return;
      }
    });
    return value;
  }

  applyFilters(filters: LineupOppFilterCriteria[]) {
    console.log("Filters => ", filters);
    let filteredPlayers = this.filterPlayers(filters);
    this.playersSubject.next(filteredPlayers);
  }

  filterPlayers(filters: LineupOppFilterCriteria[] = []): OptimizerPlayer[] {
    let players = this.players;
    console.log("No Filter Applied => ", players);
    filters.forEach(
      (currFilter: LineupOppFilterCriteria) => {
        switch (currFilter.filterKey) {
          case LineupOppFilterConstants.SLATE_ID:
            break;
          case LineupOppFilterConstants.PLAYER_SALARY:
            players = players.filter(
              (currPlayer: OptimizerPlayer) => {
                if (currPlayer.Salary >= currFilter.minValue && currPlayer.Salary <= currFilter.maxValue) {
                  return true;
                }
              }
            );
            console.log("Filter Player Salary => ", players);
            break;
          case LineupOppFilterConstants.PLAYER_VALUE:
            players = players.filter(
              (currPlayer: OptimizerPlayer) => {
                if (currPlayer.Value >= currFilter.minValue && currPlayer.Value <= currFilter.maxValue) {
                  return true;
                }
              }
            );
            console.log("Filter Player Value => ", players);
            break;
          case LineupOppFilterConstants.PROJECTION:
            players = players.filter(
              (currPlayer: OptimizerPlayer) => {
                if (currPlayer.Points >= currFilter.minValue && currPlayer.Points <= currFilter.maxValue) {
                  return true;
                }
              }
            );
            console.log("Filter Player Projection => ", players);
            break;
          case LineupOppFilterConstants.PLAYER_BATTING_ORDER:
            players = players.filter(
              (currPlayer: OptimizerPlayer) => {
                if (currPlayer.BattingOrder >= currFilter.minValue && currPlayer.BattingOrder <= currFilter.maxValue) {
                  return true;
                }
              }
            );
            console.log("Filter Player Batting Order => ", players);
            break;
          case LineupOppFilterConstants.PLAYER_POSITION:
            players = players.filter(
              (currPlayer: OptimizerPlayer) => {
                let isPlayerHasMatchedPosition: boolean = false;
                for (let i = 0; i < currFilter.filterValue.length; i++) {
                  let currValue = currFilter.filterValue[i];
                  if ((currPlayer.Position + '').toLowerCase() == currValue.toLowerCase()) {
                    isPlayerHasMatchedPosition = true;
                    break;
                  }
                }
                return isPlayerHasMatchedPosition;
              }
            );
            console.log("Filter Player Position => ", players);
            break;
          case LineupOppFilterConstants.GAME_TYPE:
            players = players.filter(
              (currPlayer: OptimizerPlayer) => {
                let isPlayerInSlate: boolean = false;
                for (let i = 0; i < currFilter.filterValue.length; i++) {
                  let currValue = currFilter.filterValue[i];
                  if (currPlayer.GameID == currValue) {
                    isPlayerInSlate = true;
                    break;
                  }
                }
                return isPlayerInSlate;
              }
            );
            console.log("Filter Player Game Type => ", players);
            break;
          default:
            break;
        }
      }
    );
    return players;
  }

}
