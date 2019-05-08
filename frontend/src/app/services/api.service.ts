import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {DashboardData, FetchTweetsResponse, Tweet} from "../entity";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http: HttpClient) {
  }

  public fetchTweets(): Observable<Tweet[]> {
    return this._http.get<FetchTweetsResponse>('/api/tweet/').pipe(map((resp: any) => resp.tweets));
  }

  public getDashboardData(): Observable<DashboardData> {
    return this._http.get<DashboardData>('/api/dashboard/');
  }

  public retweet(id: string): Observable<any> {
    return this._http.post('/api/retweet/', {id});
  }

  public favorite(id: string): Observable<any> {
    return this._http.post('/api/favorite/', {id});
  }

}
