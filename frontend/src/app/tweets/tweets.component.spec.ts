import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgZorroAntdModule, NzMessageService} from 'ng-zorro-antd';
import {EMPTY, of, throwError} from 'rxjs';
import {ListTweetsResponse, Tweet} from '../entity';
import {ApiService} from '../services/api.service';

import {TweetsComponent} from './tweets.component';
import {FormsModule} from '@angular/forms';

describe('TweetsComponent', () => {
  let component: TweetsComponent;
  let fixture: ComponentFixture<TweetsComponent>;
  let apiService: ApiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, NgZorroAntdModule],
      declarations: [TweetsComponent],
      providers: [ApiService, NzMessageService]
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
      expect(component.allTweets).toBe(testResponse.tweets);
    });
  });

  it('should get all tweets correctly', () => {
    const testResponse: ListTweetsResponse = {tweets: []};
    const spy = spyOn(apiService, 'getAllTweets').and.returnValue(of(testResponse.tweets));

    component.getAllTweets();

    expect(spy).toHaveBeenCalled();
    expect(component.allTweets).toBe(testResponse.tweets);
  });

  it('should fetch tweets correctly', () => {
    const testResponse: ListTweetsResponse = {tweets: []};
    const spy = spyOn(apiService, 'fetchTweets').and.returnValue(of(testResponse.tweets));

    component.fetchTweets();

    expect(spy).toHaveBeenCalled();
    expect(component.allTweets).toEqual(testResponse.tweets);
    expect(component.isLoading).toBeFalsy();
  });

  it('should handle fetch tweets error', () => {
    const initialTweets = component.allTweets;
    const spy = spyOn(apiService, 'fetchTweets').and.returnValue(throwError('error'));

    component.fetchTweets();

    expect(spy).toHaveBeenCalled();
    expect(component.allTweets).toBe(initialTweets);
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

  it('should search values correctly', () => {
    const testTweets = [{text: 'test test', user: 'user'}, {text: 'something else', user: 'other user'}] as Tweet[];
    component.searchValue = 'test';
    component.allTweets = testTweets;
    component.search();

    expect(component.filteredTweets).toEqual([testTweets[0]]);
    expect(component.searchValue).toEqual('');
  });

  it('should reset', () => {
    component.allTweets = [{text: 'test test', user: 'user'}, {text: 'something else', user: 'other user'}] as Tweet[];
    component.searchValue = 'test';

    component.search();

    expect(component.filteredTweets).not.toEqual(component.allTweets);

    component.reset();

    expect(component.filteredTweets).toBe(component.allTweets);
    expect(component.searchValue).toEqual('');
  });
});
