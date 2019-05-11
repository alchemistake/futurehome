import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Tweet} from '../entity';
import {HttpClient} from "@angular/common/http";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.scss']
})
export class TweetsComponent implements OnInit {
  allTweets: Tweet[] = [];
  filteredTweets: Tweet[] = [];

  mapOfExpandData: { [key: string]: boolean } = {};
  searchValue = '';
  isLoading = false;

  constructor(private _api: ApiService,
              private _message: NzMessageService) {
  }

  ngOnInit(): void {
    this.getAllTweets();
  }

  getAllTweets(): void {
    this._api.getAllTweets().subscribe(tweets => {
      this.allTweets = tweets;
      this.filteredTweets = this.allTweets;
    });
  }

  fetchTweets(): void {
    this.isLoading = true;

    this._api.fetchTweets().subscribe(tweets => {
        this.allTweets = tweets;
        this.filteredTweets = this.allTweets;
        this.isLoading = false;
      }, () => this.isLoading = false,
      () => this.isLoading = false
    );
  }

  retweet(id: string): void {
    this._api.retweet(id).subscribe(() => {
      this._message.success('Retweet successful');
    });
  }

  favorite(id: string): void {
    this._api.favorite(id).subscribe(() => {
      this._message.success('Favorite successful');
    });
  }

  search() {
    const searchStr = this.searchValue.toLowerCase();

    this.filteredTweets = this.allTweets.filter(t => {
      return t.text.toLowerCase().includes(searchStr) || t.user.toLowerCase().includes(searchStr);
    });

    this.searchValue = '';
  }

  reset() {
    this.filteredTweets = this.allTweets;
    this.searchValue = '';
  }

}
