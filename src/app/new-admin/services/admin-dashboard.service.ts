import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { AuthService } from "../../shared/services/auth.service";
import { environment } from "../../../environments/environment";
import { Subject } from "rxjs/Subject";
import * as moment from "moment";

import { Coupon } from "../models/coupon.model";
// import {Analyst} from "../models/provider.model";

@Injectable()
export class AdminDashboardService {
  endpoint: string = environment.api_end_point;
  allMembers = {};
  allMembersUpdated = new Subject<boolean>();

  // selectedProvider:Analyst;

  constructor(private http: Http, private authService: AuthService) {
    this.getMembers().subscribe(
      members => {
        members.data.forEach((member) => {

          if (member.last_active) {
            member.last_active = moment(member.last_active).format("MMM D YYYY");
          } else {
            member.last_active = null;
          }
          member.full_name = `${member.first_name} ${member.last_name}`;
          member.created_at = moment(member.created_at).format("MMM D YYYY");

          this.allMembers[member._id] = member;
        });
        this.allMembersUpdated.next(true);
      }
    );
  }


  getToken():string {
    return environment.token;
  }

  getHeaders():Headers {
    let headers = new Headers();
    headers.append("content-type", "application/json");
    if (this.getToken()) {
      headers.append("Authorization", "Bearer " + this.getToken());
    }
    return headers;
  }

  retrieveDashboardDetails():Observable<any> {
    return this.http.get(this.endpoint + "api/getDashboard", {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  retrieveLatestMembers():Observable<any> {
    return this.http.get(this.endpoint + "api/getLatestMembers", {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  getMembers() {
    return this.http.get(environment.api_end_point + "api/getMembers", {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  getChargesByMember(id: string) {
    console.log(id);
    return this.http.get(environment.api_end_point + `api/getChargesByMember/${id}`, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  getProviders() {
    return this.http.get(environment.api_end_point + "api/getProviders", {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handleError(error.json());
        return Observable.throw(error.json())
      });
  }


  deleteMember(id) {
    return this.http.delete(environment.api_end_point + "api/member/" + id, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handleError(error.json());
        return Observable.throw(error.json())
      });
  }

  deleteProvider(id) {
    return this.http.delete(environment.api_end_point + "api/provider/" + id, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handleError(error.json());
        return Observable.throw(error.json())
      });
  }

  editMember(member) {
    return this.http.post(environment.api_end_point + "api/editMember", member, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handleError(error.json());
        return Observable.throw(error.json())
      });
  }

  // editProvider(member:Analyst):Observable<any> {
  //   return this.http.post(environment.api_end_point + "api/provider/" + member._id, member, {headers: this.getHeaders()})
  //     .map(response => response.json())
  //     .catch(error => {
  //       this.handleError(error.json());
  //       return Observable.throw(error.json())
  //     });
  // }

  saveMember(member) {
    return this.http.post(environment.api_end_point + "api/member", JSON.stringify(member), {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handleError(error.json());
        return Observable.throw(error.json())
      });
  }

  saveProvider(member) {
    return this.http.post(environment.api_end_point + "api/provider", JSON.stringify(member), {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handleError(error.json());
        return Observable.throw(error.json())
      });
  }


  verifyEmail(email) {
    return this.http.post(environment.api_end_point + "getToken", {email: email})
      .map(res => res.json())
      .catch(error => Observable.throw(error.json()));
  }

  changePassword(data) {
    return this.http.post(environment.api_end_point + "verifyToken", {
      token: data.token,
      password: data.password,
      is_tool: true
    })
      .map((response:Response) => {
        return response.json()
      })
      .catch(error => Observable.throw(error.json()));
  }

  changeMemberStatus(id) {
    return this.http.put(environment.api_end_point + "api/member/" + id, "", {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handleError(error.json());
        return Observable.throw(error.json())
      });
  }

  verifyMemberByApi(id) {
    return this.http.put(environment.api_end_point + "api/verifyMember/" + id, "", {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handleError(error.json());
        return Observable.throw(error.json())
      });
  }

  changeAnalystStatus(id){
    return this.http.post(environment.api_end_point + "api/analyst/" + id, "", {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handleError(error.json());
        return Observable.throw(error.json())
      });
  }

  changeProviderStatus(id) {
    return this.http.put(environment.api_end_point + "api/provider/" + id, "", {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handleError(error.json());
        return Observable.throw(error.json())
      });
  }

  unsubscribePlan(subscribe_id, at_period_end, unsub_target_id): Observable<any> {
    return this.http.put(environment.api_end_point + 'api/unsubscribe/' + subscribe_id, { at_period_end, unsub_target_id }, {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  convertArrayOfObjectsToCSV(args) {
    let result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
      return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
      ctr = 0;
      keys.forEach(function(key) {
          if (ctr > 0) result += columnDelimiter;

          result += item[key];
          ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  downloadCSV(exportData, filename) {
    let data, link;
    let csv = this.convertArrayOfObjectsToCSV({
        data: exportData
    });
    if (csv == null) return;

    filename = filename || "data.csv";

    if (!csv.match(/^data:text\/csv/i)) {
        csv = "data:text/csv;charset=utf-8," + csv;
    }
    data = encodeURI(csv);

    link = document.createElement("a");
    link.setAttribute("href", data);
    link.setAttribute("download", filename);
    link.click();
  }

  createCoupon(coupon: Coupon) {
    return this.http.post(environment.api_end_point + "api/coupons", JSON.stringify(coupon), {headers: this.getHeaders()})
      .map(response => response.json())
      .catch(error => {
        this.handleError(error.json());
        return Observable.throw(error.json())
      });
  }

  handleError(error:any) {
    if (error.statusCode == 401) {
      this.authService.logout();
    }
  }

}
