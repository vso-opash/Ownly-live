import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  public accessToken = '';
  constructor(private http: HttpClient, private router: Router) { 
    this.accessToken = atob(localStorage.getItem('accessToken'));
  }

  getProperties(search_obj){
    let data = search_obj ? JSON.stringify(search_obj): localStorage.getItem('search_obj');
    if(data === null){
      this.router.navigate([""]);
    }
    try{
      return this.http.post('https://api.domain.com.au/v1/listings/residential/_search', data,{
          headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'accept': 'application/json',
              'Content-Type': 'application/json'
            }
      });
    }catch(e){
        console.log('\n Err : ', e);
    }
  }

  getPropertyDetails(property_id){
    try {
      return this.http.get(`https://api.domain.com.au/v1/listings/${property_id}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    } catch (e) {
      console.log('\n Err : ', e);
    }
  }

  getAgencyDetails(agency_id){
    try {
      return this.http.get(`https://api.domain.com.au/v1/agencies/${agency_id}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    } catch (e) {
      console.log('\n Err : ', e);
    }
  }

}
