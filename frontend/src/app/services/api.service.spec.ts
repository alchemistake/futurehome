import {TestBed} from '@angular/core/testing';

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
    const testResponse = {tweets: []};

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
  })
});
