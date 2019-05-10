import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ChartsModule} from 'ng2-charts';
import {of} from 'rxjs';
import {DashboardData} from '../entity';
import {ApiService} from '../services/api.service';

import {DashboardComponent} from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let apiService: ApiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgZorroAntdModule, ChartsModule],
      declarations: [DashboardComponent],
      providers: [ApiService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    apiService = TestBed.get(ApiService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get dashboard data on creation', () => {
    const testResponse: DashboardData = {locations: [], languages: [], mostPopularTweets: []};
    const spy = spyOn(apiService, 'getDashboardData').and.returnValue(of(testResponse));

    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
      expect(component.data).toBe(testResponse);
    });
  });
});
