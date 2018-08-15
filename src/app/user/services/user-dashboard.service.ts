import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {FilterCriteria} from "../models/filter-criteria.model";
import {FilterSettingsConstants, FilterKeyConstants} from '../constants/filter.constant';
import {Observable} from "rxjs/Rx";
import {FilterService} from "./filter.service";
import {environment} from "../../../environments/environment";
import * as moment from 'moment';
import {DashboardFilter} from "../models/dashboard-filter.model";
import {AuthService} from "../../shared/services/auth.service";
/**
 * Created by Hiren on 11-06-2017.
 */

@Injectable()
export class UserDashboardServices {
  constructor(private http:Http, private filterService:FilterService, private authService:AuthService) {

  }

  getToken():string {
    console.log(environment.token);
    return environment.token;
  }

  getHeaders():Headers {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    if (this.getToken()) {
      headers.append('Authorization', 'Bearer ' + this.getToken());
    }
    return headers;
  }

  retrieveOverviewData(filters:FilterCriteria[] = null):Observable<any> {
    let queryParams:string = 'report/date';
    if (filters && filters.length) {
      queryParams = queryParams + "?" + this.filterService.getQueryParamStringFromFilters(filters)
    }
    return this.http.get(environment.api_end_point + 'api/' + queryParams, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  retrieveCohortData(tabName:string, filters:FilterCriteria[] = null):Observable<any> {
    let queryParams:string = tabName;
    if (filters && filters.length) {
      queryParams = queryParams + "?" + this.filterService.getQueryParamStringFromFilters(filters)
    }
    return this.http.get(environment.api_end_point + 'api/report/' + queryParams, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  retrieveOpponentsData(filters:FilterCriteria[] = null):Observable<any> {
    let queryParams:string = '';
    if (filters && filters.length) {
      queryParams = queryParams + "?" + this.filterService.getQueryParamStringFromFilters(filters)
    }
    console.log("opponent data in service");
    return this.http.get(environment.api_end_point + 'api/opponents/profit' + queryParams, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  retrieveContestData(tabName:string, filters:FilterCriteria[] = null):Observable<any> {
    let queryParams:string = tabName;
    if (filters && filters.length) {
      queryParams = queryParams + "?" + this.filterService.getQueryParamStringFromFilters(filters)
    }
    return this.http.get(environment.api_end_point + 'api/' + queryParams, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  retrieveGraphData(tabName:string, filters:FilterCriteria[] = null):Observable<any> {
    let queryParams:string = tabName;
    if (filters && filters.length) {
      queryParams = queryParams + "?" + this.filterService.getQueryParamStringFromFilters(filters)
    }
    return this.http.get(environment.api_end_point + 'api/graph/' + queryParams, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  getBreakdownChartData(data):Observable<any> {
    let queryStr = '';
    if (data) {
      queryStr = this.prepareApiUrl(data);
    }
    return this.http.get(environment.api_end_point + "api/chart/activity" + queryStr, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  prepareApiUrl(data:DashboardFilter):string {
    let apiUrl = "";

    if (data.startDate) {
      apiUrl = apiUrl + 'date_from=' + data.startDate;
    }
    if (data.endDate) {
      apiUrl = apiUrl + '&date_to=' + data.endDate;
    }
    if (data.site) {
      apiUrl = apiUrl + '&site=' + data.site;
    }
    if (data.sport) {
      apiUrl = apiUrl + '&sport=' + data.sport;
    }
    if (data.category) {
      apiUrl = apiUrl + '&category=' + data.category;
    }
    if (data.time_period) {
      apiUrl = apiUrl + '&time_period=' + data.time_period;
    }
    return '?' + apiUrl;
  }

  getContestTopWinData(data):Observable<any> {
    let queryStr = '';
    if (data) {
      queryStr = this.prepareApiUrl(data);
    }
    return this.http.get(environment.api_end_point + "api/entry/top" + queryStr, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  getContestReport(data:DashboardFilter):Observable<any> {
    let queryStr = '';
    if (data) {
      queryStr = this.prepareApiUrl(data);
    }
    return this.http.get(environment.api_end_point + "api/report/keyStates" + queryStr, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()));
  }

  getProfitByDayOfWeek(data):Observable<any> {
    let queryStr = '';
    if (data) {
      queryStr = this.prepareApiUrl(data);
    }
    return this.http.get(environment.api_end_point + "api/chart/profit" + queryStr, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  subscribePlan(token, plan_id):Observable<any> {
    return this.http.post(environment.api_end_point + 'api/subscribe', {token, plan_id}, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  unsubscribePlan(subscribe_id, at_period_end):Observable<any> {
    return this.http.put(environment.api_end_point + 'api/unsubscribe/' + subscribe_id, {at_period_end: at_period_end}, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  checkUserName(username):Observable<any> {
    return this.http.post(environment.api_end_point + 'checkUsername', {user_name: username})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  getSavedCards():Observable<any> {
    return this.http.get(environment.api_end_point + 'api/member/cards', {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  updateDefaultPaymentCard(cardId:string):Observable<any> {
    return this.http.put(environment.api_end_point + 'api/member/cards', {
      default_source: cardId
    }, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  addPaymentCard(token:string):Observable<any> {
    return this.http.post(environment.api_end_point + 'api/member/cards', {
      source: token
    }, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  removePaymentCard(cardId:string):Observable<any> {
    return this.http.delete(environment.api_end_point + 'api/member/cards', {
      headers: this.getHeaders(), body: JSON.stringify({
        card_id: cardId
      })
    })
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json())
      });
  }

  handelError(error:any) {
    if (error.statusCode == 401) {
      this.authService.logout();
    }
  }

}
