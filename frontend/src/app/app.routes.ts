import {Routes} from "@angular/router";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TweetsComponent} from "./tweets/tweets.component";

export const appRoutes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'tweets', component: TweetsComponent},
];
