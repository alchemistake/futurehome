import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {EMPTY, of, throwError} from 'rxjs';
import {ListTweetsResponse} from '../entity';
import {ApiService} from '../services/api.service';

import {TweetsComponent} from './tweets.component';

describe('TweetsComponent', () => {
  let component: TweetsComponent;
  let fixture: ComponentFixture<TweetsComponent>;
  let apiService: ApiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgZorroAntdModule],
      declarations: [TweetsComponent],
      providers: [ApiService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TweetsComponent);
    component = fixture.componentInstance;
    apiService = TestBed.get(ApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all tweets on creation', () => {
    const testResponse: ListTweetsResponse = {tweets: []};
    const spy = spyOn(apiService, 'getAllTweets').and.returnValue(of(testResponse.tweets));

    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
      expect(component.tweets).toBe(testResponse.tweets);
    });
  });

  it('should get all tweets correctly', () => {
    const testResponse: ListTweetsResponse = {tweets: []};
    const spy = spyOn(apiService, 'getAllTweets').and.returnValue(of(testResponse.tweets));

    component.getAllTweets();

    expect(spy).toHaveBeenCalled();
    expect(component.tweets).toBe(testResponse.tweets);
  });

  it('should fetch tweets correctly', () => {
    const testResponse: ListTweetsResponse = {tweets: []};
    const spy = spyOn(apiService, 'fetchTweets').and.returnValue(of(testResponse.tweets));

    component.fetchTweets();

    expect(spy).toHaveBeenCalled();
    expect(component.tweets).toBe(testResponse.tweets);
    expect(component.isLoading).toBeFalsy();
  });

  it('should handle fetch tweets error', () => {
    let initialTweets = component.tweets;
    const spy = spyOn(apiService, 'fetchTweets').and.returnValue(throwError('error'));

    component.fetchTweets();

    expect(spy).toHaveBeenCalled();
    expect(component.tweets).toBe(initialTweets);
    expect(component.isLoading).toBeFalsy();
  });

  it('should retweet correctly', async () => {
    const spy = spyOn(apiService, 'retweet').and.returnValue(EMPTY);

    component.retweet('1234');
    expect(spy).toHaveBeenCalledWith('1234');
  });

  it('should favorite correctly', () => {
    const spy = spyOn(apiService, 'favorite').and.returnValue(EMPTY);

    component.favorite('1234');
    expect(spy).toHaveBeenCalledWith('1234');
  });
});
