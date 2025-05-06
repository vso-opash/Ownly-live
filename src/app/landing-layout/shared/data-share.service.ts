import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {
  private loadingSource = new BehaviorSubject(null);
  private isPageSource = new BehaviorSubject(null);
  private searchObjSource = new BehaviorSubject(null);
  private searchAgentObjSource = new BehaviorSubject(null);
  private searchTitle = new BehaviorSubject(null);
  private loginUserInfo = new BehaviorSubject(null);

  currentloading = this.loadingSource.asObservable();
  currentPage = this.isPageSource.asObservable();
  currentsearchObj = this.searchObjSource.asObservable();
  currentAgentsearchObj = this.searchAgentObjSource.asObservable();
  currentsearchTitle = this.searchTitle.asObservable();
  loginUser = this.loginUserInfo.asObservable();

  constructor(@Inject(DOCUMENT) private document: HTMLDocument) { }

  changeLoading(value) {
    this.loadingSource.next(value);
  }

  changePages(message: string) {
    this.isPageSource.next(message);
  }

  changeSearchObj(message: any) {
    this.searchObjSource.next(message);
  }

  changeAgentSearchObj(message: any) {
    this.searchAgentObjSource.next(message);
  }

  search_Title(message: any) {
    this.searchTitle.next(message);
  }

  getLoginUser(message: any) {
    this.loginUserInfo.next(message);
  }
}
