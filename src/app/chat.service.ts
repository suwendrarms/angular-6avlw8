
import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';

// Mock remote service

@Injectable(
  {providedIn: 'root'}
)
export class ChatService {
  constructor(public http: HttpClient) { }
  public readonly responses: Subject<string> = new Subject<string>();

  public submit(question: string): void {
    //console.log(question);
    const length = question.length;

    const answer = `"${question}" contains exactly ${length} symbols.`;

    setTimeout(
      () => this.responses.next(answer),
      1000
    );
  }
}
