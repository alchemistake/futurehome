import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {from, Observable} from "rxjs";
import {DashboardData, ListTweetsResponse, Tweet} from "../entity";
import {NzMessageService} from "ng-zorro-antd";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http: HttpClient,
              private _message: NzMessageService) {
  }

  public getAllTweets(): Observable<Tweet[]> {
    return this._http.get<ListTweetsResponse>('/api/tweets/').pipe(
      map((resp: any) => resp.tweets),
      catchError(err => {
        this._message.error(err.error);
        return from([]);
      })
    );
  }

  public fetchTweets(): Observable<Tweet[]> {
    return this._http.get<ListTweetsResponse>('/api/fetch/').pipe(map((resp: any) => resp.tweets),
      catchError(err => {
        this._message.error(err.error);
        return from([]);
      }));
  }

  public getDashboardData(): Observable<DashboardData> {
    return this._http.get<DashboardData>('/api/dashboard/');
  }

  public retweet(id: string): Observable<any> {
    return this._http.post('/api/retweet/', {id}).pipe(
      catchError(err => {
        this._message.error(err.error);
        return from(null);
      })
    );
  }

  public favorite(id: string): Observable<any> {
    return this._http.post('/api/favorite/', {id}).pipe(
      catchError(err => {
        this._message.error(err.error);
        return from(null);
      })
    );
  }

}
