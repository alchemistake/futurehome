import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Tweet} from '../entity';

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

  constructor(private _api: ApiService) {
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
    this._api.retweet(id).subscribe();
  }

  favorite(id: string): void {
    this._api.favorite(id).subscribe();
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
