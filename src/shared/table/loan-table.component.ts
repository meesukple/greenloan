import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import axios from 'axios';
import { LoanApp, LoanAppService } from '../service/loan-app.service';

@Component({
  selector: 'app-loan-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-table.component.html',
})
export class LoanTableComponent implements OnInit {
  @Input() apps: LoanApp[] = [];
  @Input() loading = false;

  constructor(private loanService: LoanAppService) {}

  ngOnInit() {
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
