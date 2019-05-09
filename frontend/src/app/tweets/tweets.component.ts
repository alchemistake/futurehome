import {Component, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";
import {Tweet} from "../entity";

export interface Data {
  id: number;
  name: string;
  age: number;
  address: string;
  disabled: boolean;
}

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.scss']
})
export class TweetsComponent implements OnInit {
  tweets: Tweet[] = [];
  mapOfExpandData: { [key: string]: boolean } = {};
  isLoading = false;

  constructor(private _api: ApiService) {
  }

  ngOnInit(): void {
    this.getAllTweets();
  }

  getAllTweets(): void {
    this._api.getAllTweets().subscribe(tweets => {
      this.tweets = tweets;
    });
  }

  fetchTweets(): void {
    this.isLoading = true;

    this._api.fetchTweets().subscribe(tweets => {
        this.tweets = tweets;
        this.isLoading = false;
      }, err => this.isLoading = false,
      () => this.isLoading = false
    );
  }

  retweet(id: string): void {
    this._api.retweet(id).subscribe()
  }

  favorite(id: string): void {
    this._api.favorite(id).subscribe()
  }

}
