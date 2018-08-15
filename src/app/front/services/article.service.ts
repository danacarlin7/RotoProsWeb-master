import {Injectable, EventEmitter, Output} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/Rx';
import {Router} from '@angular/router';

@Injectable()
export class ArticleService {

  provider:string = "https://wordpress.rotopros.com/wp-json/wp/v2/";
  customProvider:string = "https://wordpress.rotopros.com/dfspostmeta/get/";

  constructor(private http:Http, private router:Router) {
  }

  getHeaders():Headers {
    let headers = new Headers();
    headers.append('content-type', 'application/json');

    return headers;
  }

  fetchCategories(): Observable<Array<any>> {
  	var endpoint = this.provider + 'categories?hide_empty=true';
  	return this.http.get(endpoint)
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()))
  }

  fetchPosts(args:Object): Observable<Array<any>> {
    var query = [] ;
    for(var key in args)
      query.push(`${key}=${args[key]}`);
    var queryStr = query.join('&');
    var endpoint = this.provider + 'posts?' + queryStr;
    return this.http.get(endpoint)
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()))
  }

  fetchPost(id: number): Observable<any> {
    var endpoint = this.provider + 'posts/' + id;
    return this.http.get(endpoint)
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()))
  }

  fetchCategory(id: number): Observable<any> {
    var endpoint = this.provider + 'categories/' + id;
    return this.http.get(endpoint)
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()))
  }

  fetchFreeCategory(): Observable<any> {
    var endpoint = this.provider + 'categories?slug=free-article';
    return this.http.get(endpoint)
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()))
  }

  fetchMedia(args:Object): Observable<Array<any>> {
    var query = [] ;
    for(var key in args)
      query.push(`${key}=${args[key]}`);
    var queryStr = query.join('&');
    var endpoint = this.provider + 'media?' + queryStr;
    return this.http.get(endpoint)
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()))
  }

  fetchRelated(): Observable<any> {
    var endpoint = this.customProvider;
    return this.http.get(endpoint)
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()))
  }
}
