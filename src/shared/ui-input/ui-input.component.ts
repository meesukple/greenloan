import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ERROR_MESSAGE_INPUT } from '../constant/error-message/input.constant';
import { DETAIL_INPUT } from '../constant/label-and-placeholder/input.constant';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { trigger, transition, style, animate } from '@angular/animations';
import { BooleanInput } from '@angular/cdk/coercion';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'ui-input',
  templateUrl: './ui-input.component.html',
  styleUrl: './ui-input.component.scss',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    NzInputModule,
    NzFormModule,
    NzIconModule,
  ],
  providers: [DecimalPipe],
  animations: [
    trigger('fadeInSlideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate3d(0, -20%, 0)' }),
        animate(
          '300ms',
          style({ opacity: 1, transform: 'translate3d(0, 0, 0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms',
          style({ opacity: 0, transform: 'translate3d(0, -20%, 0)' })
        ),
      ]),
    ]),
  ],
})
export class UiInputComponent implements OnInit, OnChanges {
  @Input() statusChange: boolean = true;
  @Input() styleClass: string = '';
  @Input() styleClassAsterisk: string = '';
  @Input() styleClassLabel: string = '';
  @Input() styleClassInput: string = '';
  @Input() styleClassInputGroup: string = '';
  @Input() styleClassUnit: string = '';
  @Input() styleClassInputBox: string = '';
  @Input() maxLength: number = 100;
  @Input() inputConfig: {
    labelAndPlaceholderVariable: string;
    isLabelLeftSide: boolean;
    formControl: FormControl;
    type: string;
    formValidateType: string[];
    isDisabled: boolean;
    isDecimal?: boolean;
    isOnlyNumber?: boolean;
    isOnlyIntegerStartWithOne?: boolean;
    maxNumberValue?: number;
    dateDash?: boolean;
  } = {
    labelAndPlaceholderVariable: '',
    isLabelLeftSide: false,
    formControl: new FormControl(),
    type: 'text',
    formValidateType: [],
    isDisabled: false,
    isDecimal: false,
    isOnlyNumber: false,
    isOnlyIntegerStartWithOne: false,
    dateDash: false,
  };

  @Output() formControlChange: EventEmitter<FormControl> =
    new EventEmitter<FormControl>();

  statusError: string = '';
  errorMessage: string = '';
  passwordVisible: boolean = false;
  textValue: string | null = null;

  isWorkshipNameInput!: boolean;
  isBudgetInput!: boolean;
  isIncomeInput!: boolean;
  isInvalid: boolean = false;

  constructor(private decimalPipe: DecimalPipe) {}

  async ngOnInit() {
    this.checkIsSpecificInput(this.inputConfig?.labelAndPlaceholderVariable);
    if (this.inputConfig?.isDecimal) {
      await this.checkIsValueForDecimal();
    }
    this.setErrorMessage();
    if (this.inputConfig?.formControl) {
      if (this.inputConfig.isDisabled) {
        this.inputConfig.formControl.disable();
      } else {
        this.inputConfig.formControl.enable();
      }
      this.inputConfig.formControl.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(() => {
          this.setErrorMessage();
        });
    }
  }

  get label(): string {
    return DETAIL_INPUT[
      this.inputConfig?.labelAndPlaceholderVariable as keyof typeof DETAIL_INPUT
    ].label;
  }

  get placeholder(): string {
    return DETAIL_INPUT[
      this.inputConfig?.labelAndPlaceholderVariable as keyof typeof DETAIL_INPUT
    ].placeholder;
  }

  get unit(): string {
    return DETAIL_INPUT[
      this.inputConfig?.labelAndPlaceholderVariable as keyof typeof DETAIL_INPUT
    ].unit;
  }

  get isRequired(): boolean {
    return (
      this.inputConfig?.formValidateType.find(
        validate => validate === 'required'
      ) === 'required'
    );
  }

  async setErrorMessage() {
    this.errorMessage = '';
    for (let i = 0; i < this.inputConfig?.formValidateType.length; i++) {
      const isError = await this.hasError(
        this.inputConfig?.formValidateType[i]
      );
      if (isError) {
        this.errorMessage =
          await ERROR_MESSAGE_INPUT[
            this.inputConfig?.formValidateType[
              i
            ] as keyof typeof ERROR_MESSAGE_INPUT
          ];
        break;
      }
    }
  }

  hasError(validateType: string): boolean {
    const hasError = this.inputConfig?.formControl?.hasError(validateType);
    return hasError;
  }

  onFormControlChange() {
    this.setErrorMessage();
    this.checkIsSpecificInput(this.inputConfig?.labelAndPlaceholderVariable);
    this.checkIsValueForDecimal();
    this.formControlChange?.emit(this.inputConfig?.formControl?.value);
  }

  async ngOnChanges() {
    if (this.inputConfig?.isDecimal) {
      await this.checkIsValueForDecimal();
    }
    const hasTouched = this.inputConfig?.formControl?.touched;
    const invalid = this.inputConfig?.formControl?.status === 'INVALID';
    if (hasTouched && invalid) {
      this.statusError = 'error';
      this.setErrorMessage();
    } else {
      this.statusError = '';
    }
  }

  onValueChange(value: string) {
    const regex = /^-?\d*\.?\d+$/;
    const regexOnlyIntegerStartWhithOne = /^1\d*$/;
    if (value) {
      if (this.inputConfig?.isOnlyNumber) {
        if (!regex.test(this.inputConfig.formControl.value)) {
          this.formatInputOnlyNumber(value);
        }
      } else if (this.inputConfig?.isOnlyIntegerStartWithOne) {
        if (
          !regexOnlyIntegerStartWhithOne.test(
            this.inputConfig.formControl.value
          )
        ) {
          this.formatInputIntegerStartWithOne(value);
        }
      }

      if (this.inputConfig?.dateDash) {
        this.formatInputDateDash(value);
      }

      const maxValue = this.inputConfig?.maxNumberValue;
      if (maxValue) {
        +value > maxValue
          ? this.inputConfig?.formControl?.setValue(maxValue.toString())
          : '';
      }
    }
  }

  async blur() {
    if (this.inputConfig?.isDecimal) {
      await this.checkIsValueForDecimal();
    }
  }

  checkIsSpecificInput(label: string) {
    label === 'workshipName'
      ? (this.isWorkshipNameInput = true)
      : label === 'usedBudget'
        ? (this.isBudgetInput = true)
        : label === 'income'
          ? (this.isIncomeInput = true)
          : '';
  }

  checkInvalid() {
    this.isInvalid =
      this.inputConfig?.formControl?.touched &&
      this.inputConfig?.formControl?.invalid;

    return (
      this.inputConfig?.formControl?.touched &&
      this.inputConfig?.formControl?.invalid
    );
  }

  async checkIsValueForDecimal() {
    if (this.inputConfig?.isDecimal) {
      if (this.inputConfig?.formControl?.value < 0) {
        await this.inputConfig?.formControl.setValue(
          Math.abs(this.inputConfig?.formControl?.value)
        );
      }
      const isMulipleDot = this.containsMultipleDots(
        this.inputConfig?.formControl?.value
      );
      if (isMulipleDot) {
        const splitStr = this.inputConfig?.formControl?.value?.split('.');
        const data = `${splitStr[0]}.${splitStr[1]}`;
        this.inputConfig.formControl?.setValue(data);
      }
      const formattedValue = await this.decimalPipe.transform(
        this.inputConfig?.formControl?.value?.replace(/,/g, ''),
        '1.2-2'
      );
      this.inputConfig?.formControl?.setValue(formattedValue);
    }
  }

  formatInputOnlyNumber(value: string) {
    if (this.inputConfig?.isOnlyNumber && typeof value === 'string') {
      const formattedValue = value.replace(/[^0-9.,]/g, '');
      if (formattedValue !== value) {
        this.inputConfig?.formControl?.setValue(formattedValue);
      }
    }
  }

  formatInputDateDash(value: string) {
    if (this.inputConfig?.dateDash && typeof value === 'string') {
      const cleanedValue = value.replace(/\D/g, '');

      let formattedValue = '';

      for (let i = 0; i < cleanedValue.length; i++) {
        if (i === 4 || i === 6) {
          formattedValue += '-';
        }
        formattedValue += cleanedValue[i];
      }
      if (formattedValue !== value) {
        this.inputConfig.formControl.setValue(formattedValue);
      }
    }
  }

  formatInputIntegerStartWithOne(value: string) {
    if (
      this.inputConfig?.isOnlyIntegerStartWithOne &&
      typeof value === 'string'
    ) {
      let formattedValue = value.replace(/^0+|\.|\-|[^0-9]/g, '');
      if (formattedValue !== value) {
        this.inputConfig?.formControl?.setValue(formattedValue);
      }
    }
  }

  containsMultipleDots(value: string): boolean {
    const dotCount = (value?.match(/\./g) || []).length;

    return dotCount > 1;
  }
}
