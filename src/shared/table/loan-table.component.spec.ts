import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoanTableComponent } from './loan-table.component';
import { By } from '@angular/platform-browser';

describe('LoanTableComponent', () => {
  let component: LoanTableComponent;
  let fixture: ComponentFixture<LoanTableComponent>;
  let httpMock: HttpTestingController;

  const mockApps = [
    {
      id: 'APP001',
      name: 'ทดสอบ หนึ่ง',
      amount: '2.5 ล้านบาท',
      status: 'อนุมัติ',
      aml: '1',
      mule: 'ปกติ',
      boycott: '0',
      kyc: '1',
      score: '75',
      date: '2025-07-15'
    },
    {
      id: 'APP002',
      name: 'ทดสอบ สอง',
      amount: '1.8 ล้านบาท',
      status: 'รอดำเนินการ',
      aml: '2',
      mule: 'ปกติ',
      boycott: '0',
      kyc: '2',
      score: '40',
      date: '2025-07-20'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LoanTableComponent],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LoanTableComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load data from the API and render rows', () => {
    fixture.detectChanges(); // triggers ngOnInit + HTTP call

    // Mock the HTTP response
    const req = httpMock.expectOne('/api/loan-applications');
    expect(req.request.method).toBe('GET');
    req.flush(mockApps);

    fixture.detectChanges();

    // Check that rows were rendered
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);

    // Check that a cell contains a known name
    const firstRowText = rows[0].nativeElement.textContent;
    expect(firstRowText).toContain('ทดสอบ หนึ่ง');
  });

  it('should call approve() when Approve link clicked', () => {
    spyOn(component, 'approve');

    fixture.detectChanges();
    httpMock.expectOne('/api/loan-applications').flush(mockApps);
    fixture.detectChanges();

    // Only the "รอดำเนินการ" row shows Approve/Reject links
    const approveLink = fixture.debugElement.query(By.css('tbody tr:nth-child(2) a'));
    approveLink.triggerEventHandler('click', null);

    expect(component.approve).toHaveBeenCalledWith(mockApps[1]);
  });

  it('should show loading text before data arrives', () => {
    fixture.detectChanges(); // triggers ngOnInit but we don't flush response yet

    const loadingEl = fixture.debugElement.query(By.css('div'));
    expect(loadingEl.nativeElement.textContent).toContain('กำลังโหลดข้อมูล');
  });
});
