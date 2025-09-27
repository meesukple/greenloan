import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import axios from 'axios';

export interface LoanApp {
  id: string;
  name: string;
  salary: string;
  loan: string;
  status: string;
  aml: string;
  mule: string;
  boycott: string;
  creditBureau: string;
  kyc: string;
  score: string;
  dsr: string;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class LoanAppService {
  private appsSubject = new BehaviorSubject<LoanApp[]>([]);
  apps$ = this.appsSubject.asObservable();

  async loadApps() {
    const res = await axios.get<LoanApp[]>(
      'https://green-morgage-testing.azurewebsites.net/greenLoanList'
    );
    this.appsSubject.next(res.data);
  }
}
