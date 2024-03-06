// shared-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private areaTypeSubject = new BehaviorSubject<string>(''); // Initial value is an empty string
  areaType$ = this.areaTypeSubject.asObservable();

  setAreaType(areaType: string): void {
    this.areaTypeSubject.next(areaType);
  }
}
