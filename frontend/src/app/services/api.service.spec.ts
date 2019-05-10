import {TestBed} from '@angular/core/testing';
import {DashboardData, ListTweetsResponse} from '../entity';

import {ApiService} from './api.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {NzMessageService} from "ng-zorro-antd";

class MockMessageService {
  error(errMsg: string): string {
    return errMsg;
  }
}

describe('ApiService', () => {
  let service: ApiService;
  let messageService: MockMessageService;
  let testingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService, {provide: NzMessageService, useClass: MockMessageService}]
    });

    service = TestBed.get(ApiService);
    messageService = TestBed.get(NzMessageService);
    testingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    testingController.verify();
  });

  it('should send getAllTweets request correctly', () => {
    service.getAllTweets().subscribe();

    const req = testingController.expectOne('/api/tweets/');
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toBeNull();
  });

  it('should return getAllTweets response correctly', () => {
    const testResponse: ListTweetsResponse = {tweets: []};

    service.getAllTweets().subscribe((resp) => {
      expect(resp).toBe(testResponse.tweets);
    });

    const req = testingController.expectOne('/api/tweets/');
    req.flush(testResponse);
  });

  it('should handle errors for getAllTweets', () => {
    const spy = spyOn(messageService, 'error');
    service.getAllTweets().subscribe();

    const req = testingController.expectOne('/api/tweets/');
    req.flush('Some error', { status: 500, statusText: 'Server Error' });

    expect(spy).toHaveBeenCalledWith('Some error');
  });

  it('should send fetchTweets request correctly', () => {
    service.fetchTweets().subscribe();

    const req = testingController.expectOne('/api/fetch/');
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toBeNull();
  });

  it('should return fetchTweets response correctly', () => {
    const testResponse: ListTweetsResponse = {tweets: []};

    service.fetchTweets().subscribe((resp) => {
      expect(resp).toBe(testResponse.tweets);
    });

    const req = testingController.expectOne('/api/fetch/');
    req.flush(testResponse);
  });

  it('should handle errors for fetchTweets', () => {
    const spy = spyOn(messageService, 'error');
    service.fetchTweets().subscribe();

    const req = testingController.expectOne('/api/fetch/');
    req.flush('Some error', { status: 500, statusText: 'Server Error' });

    expect(spy).toHaveBeenCalledWith('Some error');
  });

  it('should send getDashboardData request correctly', () => {
    service.getDashboardData().subscribe();

    const req = testingController.expectOne('/api/dashboard/');
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toBeNull();
  });

  it('should return getDashboardData response correctly', () => {
    const testResponse: DashboardData = {languages: [], locations: [], mostPopularTweets: []};

    service.getDashboardData().subscribe((resp) => {
      expect(resp).toBe(testResponse);
    });

    const req = testingController.expectOne('/api/dashboard/');
    req.flush(testResponse);
  });

  it('should send retweet request correctly', () => {
    const id = '1234';
    service.retweet(id).subscribe();

    const req = testingController.expectOne('/api/retweet/');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({id});
  });

  it('should handle errors for retweet', () => {
    const spy = spyOn(messageService, 'error');
    service.retweet('1234').subscribe();

    const req = testingController.expectOne('/api/retweet/');
    req.flush('Some error', { status: 500, statusText: 'Server Error' });

    expect(spy).toHaveBeenCalledWith('Some error');
  });

  it('should send favorite request correctly', () => {
    const id = '1234';
    service.favorite(id).subscribe();

    const req = testingController.expectOne('/api/favorite/');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({id});
  });

  it('should handle errors for favorite', () => {
    const spy = spyOn(messageService, 'error');
    service.favorite('1234').subscribe();

    const req = testingController.expectOne('/api/favorite/');
    req.flush('Some error', { status: 500, statusText: 'Server Error' });

    expect(spy).toHaveBeenCalledWith('Some error');
  });

});
