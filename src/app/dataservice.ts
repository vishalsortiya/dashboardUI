// last-people-data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://dashboard.dnvsspl.com:3000';
  // private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  
  getAllAreas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/emp`);
  }

  getTotalHeadcount(pageName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/totalheadcount/${pageName}`);
  }


  getInAndOutData(pageName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/emp/${pageName}`);
  }

  getFunctTypeCount(pageName:string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/functcount/${pageName}`);
  }

  getFunctListData(pageName:string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/functlists/${pageName}`);
  }

}
