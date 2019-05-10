import {Location} from "@angular/common";
import {async, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ChartsModule} from 'ng2-charts';
import {AppComponent} from './app.component';
import {appRoutes} from './app.routes';
import {DashboardComponent} from './dashboard/dashboard.component';
import {NavbarComponent} from './navbar/navbar.component';
import {TweetsComponent} from './tweets/tweets.component';


describe('AppComponent', () => {
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(appRoutes),
        NgZorroAntdModule,
        ChartsModule
      ],
      declarations: [
        AppComponent,
        NavbarComponent,
        DashboardComponent,
        TweetsComponent
      ],
    }).compileComponents();

    router = TestBed.get(Router);
    location = TestBed.get(Location);

    router.initialNavigation();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should navigate to dashboard first', () => {
    expect(location.path()).toBe("/dashboard");
  });
});
