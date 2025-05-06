import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class CrudService {
  public httpOptions;
  invokeLoginComponentFunction = new EventEmitter();
  invokeSigninComponentFunction = new EventEmitter();
  clearFilters = new EventEmitter();

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getAccessToken() {
    // old
    // const clientId = 'client_c5e77d49b80c4efda639f751c5e2e168';
    // const secret = 'secret_d417765e54dd9577910b83632a6bea36';

    // Domain API - remove for now
    // const clientId = 'client_c9a0bc8807634913971ee44de795917b';
    // const secret = 'secret_8cf927b464899fd5a1090c7c8504a1e0';
    // let data = 'grant_type=client_credentials&scope=api_agencies_read%20api_listings_read';
    const clientId = '';
    const secret = '';
    const data = '';
    try {
      return this.http.post('https://auth.domain.com.au/v1/connect/token', data, {
        headers: {
          'Authorization': `Basic ${btoa(`${clientId}:${secret}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    } catch (e) {
      console.log('\n Err : ', e);
    }
  }

  get(apiUrl) {
    const url = environment.apiUrl + apiUrl;
    return this.http.get(url, this.httpOptions);
  }

  getParam(apiUrl, data) {
    const url = environment.apiUrl + apiUrl;
    let Params = new HttpParams();
    for (const key in data) {
      Params = Params.append(key, data[key]);
    }
    return this.http.get(url, { params: Params });
  }

  post(apiUrl, data) {
    const url = environment.apiUrl + apiUrl;
    return this.http.post(url, data, this.httpOptions);
  }

  put(apiUrl, data) {
    const url = environment.apiUrl + apiUrl;
    return this.http.put(url, data, this.httpOptions);
  }

  postFormData(apiUrl, formData) {
    const url = environment.apiUrl + apiUrl;
    return this.http.post(url, formData);
  }

  putFormData(apiUrl, formData) {
    const url = environment.apiUrl + apiUrl;
    return this.http.put(url, formData);
  }

  //Get agent profile data
  agentProfile(apiUrl, userId) {
    const data = { userId: userId, roleId: "5a1d113016bed22901ce050b" }
    const url = environment.apiUrl + apiUrl;
    return this.http.post(url, data);
  }

  //Get trader profile data
  traderProfile(apiUrl, userId) {
    let serviceCategoryList = JSON.parse(localStorage.getItem('service_cat')) ? JSON.parse(localStorage.getItem('service_cat')) : 'null'
    let data = { userId: userId, roleId: "5a1d26b26ef60c3d44e9b377", service_cat: true }
    console.info('---------------------------------')
    console.info('TRADER_REQ_ BEFORE =>', data)
    console.info('TRADER_REQ_ BEFORE serviceCategoryList =>', serviceCategoryList)
    console.info('---------------------------------')
    if (serviceCategoryList && serviceCategoryList !== null && serviceCategoryList !== 'null' && serviceCategoryList.length > 0) {
      data.service_cat = false
    } else {
      data.service_cat = true
    }
    const url = environment.apiUrl + apiUrl;
    console.info('---------------------------------')
    console.info('TRADER_REQ_ AFTER =>', data)
    console.info('TRADER_REQ_ AFTER serviceCategoryList =>', serviceCategoryList)
    console.info('---------------------------------')
    return this.http.post(url, data);
  }

  onloginClick() {
    this.invokeLoginComponentFunction.emit();
  }

  onSignupClick() {
    this.invokeSigninComponentFunction.emit();
  }

  //This function use for clear the filter from Home compormt to Header Component
  onSeachClearFilters() {
    this.clearFilters.emit();
  }

}
