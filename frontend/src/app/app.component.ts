import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  tweets: any[];

  constructor(private _http: HttpClient) {
  }


  ngOnInit(): void {
    this._http.get('/api/tweet').subscribe((resp: any) => {
      this.tweets = resp.tweets;
    });
  }
}
