import {Component, OnInit} from '@angular/core';
import {ApiService} from "../services/api.service";
import {DashboardData, Language, Location} from "../entity";
import {ChartDataSets, ChartOptions} from "chart.js";
import {Label} from "ng2-charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data: DashboardData;

  // Bar Chart Configuration
  barChartLabels: Label[] = [];
  barChartData: ChartDataSets[] = [{data: []}];
  barChartOptions: ChartOptions = {
    responsive: true,
    title: {display: true, position: 'top', text: 'Number of Tweets From Locations'},
    legend: {position: 'bottom'},
    scales: {xAxes: [{}], yAxes: [{ticks: {min: 0}}]},
  };

  // Pie Chart Configuration
  pieChartOptions: ChartOptions = {
    responsive: true,
    title: {display: true, position: 'top', text: 'Language of Tweets'},
    legend: {position: 'bottom'},
  };
  pieChartLabels: Label[] = [];
  pieChartData: number[] = [];

  constructor(private _api: ApiService) {
  }

  ngOnInit() {
    this._api.getDashboardData().subscribe(resp => {
      this.data = resp;
      this._generateBarChartData(resp.locations);
      this._generatePieChartData(resp.languages);
    });
  }

  private _generateBarChartData(locations: Location[]): void {
    this.barChartLabels = locations.filter(location => location.place__count !== 0).map(location => location.place);
    this.barChartData = [{
      data: locations.filter(location => location.place__count !== 0).map(location => location.place__count),
      label: 'Number of tweets'
    }];
  }

  private _generatePieChartData(languages: Language[]): void {
    this.pieChartLabels = languages.map(language => language.lang.toUpperCase());
    this.pieChartData = languages.map(language => language.lang__count);
  }

}
