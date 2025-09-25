import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';

interface LoanApp {
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

@Component({
  selector: 'app-loan-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-table.component.html',
})
export class LoanTableComponent implements OnInit {
  apps: LoanApp[] = [];
  loading = true;

  ngOnInit(): void {
    this.fetchLoanApps();
  }

  fetchLoanApps() {
    this.loading = true;

    axios
      .get<LoanApp[]>('https://green-morgage-testing.azurewebsites.net/greenLoanList')
      .then(response => {
        this.apps = response.data;
        this.loading = false;
      })
      .catch(error => {
        console.error('Failed to fetch loan apps', error);
        this.apps = [];
        this.loading = false;
      });
  }

  approve(app: LoanApp) {
    axios.post(`https://your-api-endpoint.com/loan-apps/${app.id}/approve`, {})
      .then(() => app.status = 'อนุมัติ')
      .catch(err => console.error('Approve failed', err));
  }

  reject(app: LoanApp) {
    axios.post(`https://your-api-endpoint.com/loan-apps/${app.id}/reject`, {})
      .then(() => app.status = 'ปฏิเสธ')
      .catch(err => console.error('Reject failed', err));
  }
}
