import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {AuthService} from "../../shared/services/auth.service";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs/Rx";

/**
 * Created by Hiren on 28-06-2017.
 */

@Injectable()
export class FrontService {
  constructor(private http: Http, private authService: AuthService) {

  }

  getToken(): string {
    return environment.token;
  }

  getHeaders(): Headers {
    const headers = new Headers();
    headers.append("content-type", "application/json");
    if (this.getToken()) {
      headers.append("Authorization", "Bearer " + this.getToken());
    }
    return headers;
  }

  retrieveNews(sportType: string, timePeriod: string = "30days"): Observable<any> {
    return this.http.get(environment.api_end_point + "fetchNews?sport=" + sportType + "&since=" + timePeriod, {headers: this.getHeaders()})
      .map((reponse: Response) => reponse.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json());
      });
  }

  retrieveHomepageNews(): Observable<any> {
    return this.http.get(environment.api_end_point + "fetchLatestNews?count=10", {headers: this.getHeaders()})
      .map((reponse: Response) => reponse.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json());
      });
  }

  retrieveInjuries(sportType: string): Observable<any> {
    return this.http.get(environment.api_end_point + "injuries?sport=" + sportType, {headers: this.getHeaders()})
      .map((reponse: Response) => reponse.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json());
      });
  }

  retrieveDailyLineups(sportType: string, timePeriod: string = "today"): Observable<any> {
    return this.http.get(environment.api_end_point + "fetchLineup?sport=" + sportType + "&since=" + timePeriod, {headers: this.getHeaders()})
      .map((reponse: Response) => reponse.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json());
      });
  }

  retrieveTwitterFeeds(): Observable<any> {
    return this.http.get(environment.api_end_point + "getTwitterFeeds", {headers: this.getHeaders()})
      .map((reponse: Response) => reponse.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json());
      });
  }

  retrieveFBFeeds(): Observable<any> {
    return this.http.get(environment.api_end_point + "getFBPost", {headers: this.getHeaders()})
      .map((reponse: Response) => reponse.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json());
      });
  }

  retrieveInstaFeeds(): Observable<any> {
    return this.http.get(environment.api_end_point + "getInstaPosts", {headers: this.getHeaders()})
      .map((reponse: Response) => reponse.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json());
      });
  }
  getDummyPlans(): any[]{
    return [
      {
        name: "All Access Monthly Rate",
        trial_period_days: null,
        plan_id: "RotoPros_All_Access_Analyst_Lineups_Yearly",
        plan_type: "Subscription",
        amount: 2999,
        currency: "usd",
        interval: "month",
        interval_count: 1
      }
    ];
  }
  getDummyPlans2():any[]{
    return[
      {
        name: "All Access Yearly Rate",
        trial_period_days: null,
        plan_id: "RotoPros_All_Access_Analyst_Lineups_Month",
        plan_type: "Subscription",
        amount: 24999,
        currency: "usd",
        interval: "year",
        interval_count: 1
      },
      {
        name: "All Access Monthly Rate",
        trial_period_days: null,
        plan_id: "RotoPros_All_Access_Analyst_Lineups_Yearly",
        plan_type: "Subscription",
        amount: 2999,
        currency: "usd",
        interval: "month",
        interval_count: 1
      }
    ];
  }
  getDummyPlans1():any[]{
    return[
      {
        name: "All Access Yearly Rate",
        trial_period_days: null,
        plan_id: "RotoPros_All_Access_Analyst_Lineups_Month",
        plan_type: "Subscription",
        amount: 24999,
        currency: "usd",
        interval: "year",
        interval_count: 1
      }
    ];
  }
  getSubscribePlans(): Observable<any> {
    return this.http.get(environment.api_end_point + "plans", {headers: this.getHeaders()})
      .do(response => console.log("plans => ", JSON.stringify(response.json())))
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json());
      });
  }

  subscribePlan(token, plan_id, coupon = ""): Observable<any> {
    console.log(coupon);
    return this.http.post(environment.api_end_point + "api/subscribe", {token, plan_id, coupon}, {headers: this.getHeaders()})
      .map((response: Response) => response.json());
  }

  validateCoupon(coupon, amount) {
    // validateCoupon(coupon): Observable<any> {
    console.log(coupon);
    return this.http.post(environment.api_end_point + "validateCoupon", {coupon, amount}, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json());
      });
  }


  validateCouponAdvance(coupon, amount) {
    console.log(coupon);
    return this.http.post(environment.api_end_point + "api/validateCouponAdvance", {coupon, amount}, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json());
      });
  }


  signUpStepTwo(token, plan_id, coupon = ""): Observable<any> {
    const headers = new Headers();
    headers.append("content-type", "application/json");
    headers.append("Authorization", "Bearer " + this.authService.partialUser.token);

    return this.http.post(environment.api_end_point + "api/signupTwo", {token, plan_id, coupon}, {headers: headers})
      .map((response: Response) => response.json());
  }

  unsubscribePlan(subscribe_id, at_period_end) {
    return this.http.put(environment.api_end_point + "api/unsubscribe/" + subscribe_id, {at_period_end: at_period_end}, {headers: this.getHeaders()})
      .map((response: Response) => response.json());
  }

  retrieveProvider() {
    return this.http.get(environment.api_end_point + "providers", {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json());
      });
  }

  retrieveVideos(status = false): Observable<any> {
    let link = "getVideos";
    if (status)
      link = "getVideos?live=true";

    return this.http.get(environment.api_end_point + link, {headers: this.getHeaders()})
      .map((reponse: Response) => reponse.json())
      .catch(error => {
        this.handelError(error.json());
        return Observable.throw(error.json());
      });
  }

  handelError(error: any) {
    if (error.statusCode == 401) {
      this.authService.logout();
    }
  }
}
