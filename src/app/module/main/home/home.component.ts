import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../shared/service/toast-alert.service';
import { inputConfigTm, selectConfigTm } from '../../../../shared/interface/input.interface';
import axios from 'axios';

interface filePayload { 
  dob: string | null | null
  address: string | null 
  zipCode: string | null 
  idCardFile: string | null 
  salarySlipFile: string | null 
  creditBureau: string | null
  activeAirflowSystemFile: string | null 
  eVChargerFile: string | null 
  ecoFriendlyMaterialsFile: string | null 
  greenSpaceFile: string | null 
  insulationFile: string | null 
  ledLightsFile: string | null 
  rainwaterHarvestingFile: string | null 
  smartHomeFile: string | null 
  solarRooftopFile: string | null 
  wasteManagementSystemFile: string | null 
  waterSavingToiletsFile: string | null 
  waterTreatmentSystemFile: string | null 
  nearPublicTransportFile: string | null
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false,
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {

  step = 1;
  progress = 20;
  formGroup!: FormGroup;
  formGroupFile!: FormGroup;
  idCardInputConfig!: inputConfigTm;
  firstNameInputConfig!: inputConfigTm;
  lastNameInputConfig!: inputConfigTm;
  phoneInputConfig!: inputConfigTm;
  addressInputConfig!: inputConfigTm;
  salaryInputConfig!: inputConfigTm;
  loanInputConfig!: inputConfigTm;
  countryDropdownSelectConfig!: selectConfigTm;
  customer: any = null;

  stepLabels: string[] = [
    'รายละเอียดผลิตภัณฑ์',
    'การให้ความยินยอม',
    'เอกสารประกอบการอนุมัติสินเชื่อ',
    'กรอกข้อมูลเพิ่มเติม',
    'ยืนยันและส่งคำขอ'
  ];

  files: { [key: string]: File | null } = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      idCard: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^(0[689]{1})+([0-9]{8})$/)]],
      salary: [0],
      loan: [0, [Validators.required]],
    });
    this.formGroupFile = this.fb.group({
      idCardFile: [null, [Validators.required]],
      salarySlipFile: [null, [Validators.required]],
      bankStatement: [null],
      creditBureau: [null, [Validators.required]],
      debtDocs: this.fb.group({
        housing: [null],
        creditCard: [null],
        others: [null],
      }),
      energyDocs: this.fb.group({
        solarRooftopFile: [null],
        activeAirflowSystemFile: [null],
        insulationFile: [null],
        smartHomeFile: [null],
        eVChargerFile: [null],
        ledLightsFile: [null],
      }),
      waterDocs: this.fb.group({
        waterTreatmentSystemFile: [null],
        waterSavingToiletsFile: [null],
      }),
      materialDocs: this.fb.group({
        ecoFriendlyMaterialsFile: [null],
        wasteManagementSystemFile: [null],
      }),
    });
    this.initialComponent();
  }

  nextStepConsentForm() {
    const consentItems = document.querySelectorAll('input[type="radio"]:checked');
    if (consentItems.length < 3) {
      this.alertService.incomplete()
      return;
    }
    this.step++;
    this.progress = this.step * 20;
  }

  onFileSelected(event: Event, controlPath: string) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    const control = this.formGroupFile.get(controlPath);
    if (!control) {
      console.warn(`Form control not found for path: ${controlPath}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      const filePayload = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        content: base64
      };

      control.setValue(filePayload);
      control.markAsDirty();
      control.updateValueAndValidity();
    };
    reader.onerror = err =>
      console.error(`Error reading file for ${controlPath}`, err);

    reader.readAsDataURL(file);
  }

  triggerFile(inputId: string) {
    const el = document.getElementById(inputId) as HTMLInputElement | null;
    if (el) el.click();
  }

  removeFile(controlPath: string) {
    const control = this.formGroupFile.get(controlPath);
    if (control) {
      control.setValue(null);
      control.markAsDirty();
    }
    const input = document.getElementById(
      controlPath.includes('.') ? controlPath.split('.').pop()! : controlPath
    ) as HTMLInputElement | null;
    if (input) {
      input.value = '';
    }
  }

  submitForm() {
    if (this.formGroup.invalid) {
      alert('กรุณากรอกและอัปโหลดทุกช่อง');
      return;
    }
  }

  appendFileToFormData(formData: FormData, key: string, fileObj: any) {
    if (!fileObj) return;

    if (fileObj instanceof File) {
      formData.append(key, fileObj);
    } else if (typeof fileObj.content === 'string' && fileObj.name) {
      try {
        const blob = this.base64ToBlob(fileObj.content, fileObj.type || 'application/octet-stream');
        formData.append(key, blob, fileObj.name);
      } catch (error) {
        console.warn(`Failed to convert ${key} from base64:`, error);
      }
    } else {
      console.warn(`Skipping ${key}: not a valid File or base64 object`, fileObj);
    }
  }

  base64ToBlob(base64: string, type = 'application/octet-stream') {
    // Remove prefix if present: data:<mime>;base64,
    const cleaned = base64.includes('base64,') ? base64.split('base64,')[1] : base64;

    const byteCharacters = atob(cleaned);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  }

  async submitCheckList() {
    const idCardControl = this.formGroupFile.get('idCardFile');
    const salaryControl = this.formGroupFile.get('salarySlipFile');
    const creditBureauBControl = this.formGroupFile.get('creditBureau');
    if (!idCardControl || idCardControl.invalid ||
       !salaryControl || salaryControl.invalid || 
       !creditBureauBControl || creditBureauBControl.invalid) {
      this.alertService.incomplete()
      return;
    }
    const formData = new FormData();
    const fg = this.formGroupFile;

    ['dob', 'address', 'zipCode'].forEach(field => {
      formData.append(field, fg.get(field)?.value || '');
    });

    const flatFiles = ['idCardFile', 'salarySlipFile', 'creditBureau'];
    flatFiles.forEach(key => {
      const fileObj = fg.get(key)?.value;
      if (fileObj) {
        this.appendFileToFormData(formData, key, fileObj);
      }
    });

    const nestedGroups = {
      energyDocs: ['activeAirflowSystemFile', 'eVChargerFile', 'insulationFile', 'ledLightsFile', 'smartHomeFile', 'solarRooftopFile'],
      waterDocs: ['waterTreatmentSystemFile', 'waterSavingToiletsFile'],
      materialDocs: ['ecoFriendlyMaterialsFile', 'wasteManagementSystemFile'],
      debtDocs: ['housing', 'creditCard', 'others'],
    };

    Object.keys(nestedGroups).forEach(groupKey => {
      const group = fg.get(groupKey) as FormGroup;
      if (group) {
        nestedGroups[groupKey as keyof typeof nestedGroups].forEach(controlKey => {
          const controlValue = group.get(controlKey)?.value;
          if (controlValue) {
            this.appendFileToFormData(formData, controlKey, controlValue);
          }
        });
      }
    });

    try {
      const responseCustomerId = await axios.post(
        'https://green-morgage-testing.azurewebsites.net/prescreen',
        formData
      );

      const response = await axios.get(
        `https://green-morgage-testing.azurewebsites.net/verifyCustomerInfo?customerId=${responseCustomerId.data.result}`
      );
      this.customer = response.data;
      this.cdr.detectChanges();
      console.log('Customer data:', this.customer);
      
      this.formGroup.patchValue({
        idCard: this.customer.idNumber || '',
        firstName: this.customer.firstNameTh || '',
        lastName: this.customer.lastNameTh || '',
        address: this.customer.address || ''
      });

      this.step++;
      this.progress = (this.step / 5) * 100;

    } catch (error) {
      this.alertService.error()
      console.error('Failed to submit checklist', error);
      throw error;
    }
  }

  nextStepForm(): void {
    this.formGroup.markAllAsTouched();

    const idCardControl = this.formGroup.get('idCard');
    const firstNameControl = this.formGroup.get('firstName');
    const lastNameControl = this.formGroup.get('lastName');
    const addressControl = this.formGroup.get('address');
    const phoneControl = this.formGroup.get('phone');

    if (!idCardControl || idCardControl.invalid ||
       !firstNameControl || firstNameControl.invalid || 
       !lastNameControl || lastNameControl.invalid || 
       !phoneControl || phoneControl.invalid || 
       !addressControl || addressControl.invalid) {
      this.alertService.incomplete()
      return;
    }
    this.step++;
    this.progress = (this.step / 5) * 100;
  }

  nextStep() {
    this.step++;
    this.progress = this.step * 20;
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
      this.progress = this.step * 20;
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  initialComponent() {
    this.idCardInputConfig = {
      labelAndPlaceholderVariable: 'idCard',
      isLabelLeftSide: false,
      formControl: this.formGroup.get('idCard'),
      type: 'string',
      formValidateType: ['required'],
      isDisabled: false,
      isOnlyNumber: true,
    };
    this.firstNameInputConfig = {
      labelAndPlaceholderVariable: 'firstName',
      isLabelLeftSide: false,
      formControl: this.formGroup.get('firstName'),
      type: 'string',
      formValidateType: ['required'],
      isDisabled: false,
    };
    this.lastNameInputConfig = {
      labelAndPlaceholderVariable: 'lastName',
      isLabelLeftSide: false,
      formControl: this.formGroup.get('lastName'),
      type: 'string',
      formValidateType: ['required'],
      isDisabled: false,
    };
    this.phoneInputConfig = {
      labelAndPlaceholderVariable: 'phone',
      isLabelLeftSide: false,
      formControl: this.formGroup.get('phone'),
      type: 'string',
      formValidateType: ['required'],
      isDisabled: false,
      isOnlyNumber: true,
    };
    this.addressInputConfig = {
      labelAndPlaceholderVariable: 'address',
      isLabelLeftSide: false,
      formControl: this.formGroup.get('address'),
      type: 'string',
      formValidateType: ['required'],
      isDisabled: false,
    };
    this.loanInputConfig = {
      labelAndPlaceholderVariable: 'loan',
      isLabelLeftSide: false,
      formControl: this.formGroup.get('loan'),
      type: 'float',
      formValidateType: ['required'],
      isDisabled: false,
      isOnlyNumber: true,
    };
  }
}
