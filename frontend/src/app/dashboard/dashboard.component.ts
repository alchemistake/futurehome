import {Component, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";
import {DashboardData} from "../entity";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data: DashboardData;

  constructor(private _api: ApiService) { }

  ngOnInit() {
    this._api.getDashboardData().subscribe(resp => {
      this.data = resp;
    });
  }

}
