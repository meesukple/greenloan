import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UiInputComponent } from './ui-input.component';

describe('UiInputComponent', () => {
  let component: UiInputComponent;
  let fixture: ComponentFixture<UiInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, UiInputComponent],
      providers: [FormBuilder]
    });

    fixture = TestBed.createComponent(UiInputComponent);
    component = fixture.componentInstance;

    const formBuilder = TestBed.inject(FormBuilder);
    const formGroup: FormGroup = formBuilder.group({
      demo: ['', Validators.required],
    });
    component.styleClass = "w-full";
    component.inputConfig = {
      labelAndPlaceholderVariable: 'demo',
      isLabelLeftSide: true,
      formControl: formGroup.get('demo') as FormControl,
      type: 'text',
      formValidateType: ['required'],
      isDisabled: false,
    };
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.styleClass).toBe('w-full');
    expect(component.inputConfig.labelAndPlaceholderVariable).toBe('demo');
    expect(component.inputConfig.isLabelLeftSide).toBe(true);
    expect(component.inputConfig.formControl instanceof FormControl).toBeTruthy();
    expect(component.inputConfig.type).toBe('text');
    expect(component.inputConfig.formValidateType.length).toBe(1);
    expect(component.inputConfig.isDisabled).toBe(false);
    expect(component.passwordVisible).toBe(false);
    expect(component.label).toBe('demo');
    expect(component.placeholder).toBe('กรุณากรอกข้อความ');
    expect(component.unit).toBe('');
    expect(component.isRequired).toBe(true);
  });

  it('should set error message correctly', () => {
    component.inputConfig.formControl.setValue(null);
    component.setErrorMessage();

    expect(component.errorMessage).toBe('กรุณากรอกข้อความ');
    expect(component.inputConfig.formControl.invalid).toBe(true);
  });

  it('should disable form control when isDisabled is true', () => {
    component.inputConfig.isDisabled = true;
    component.ngOnInit();

    expect(component.inputConfig.formControl.disabled).toBe(true);
  });

  it('should enable form control when isDisabled is false', () => {
    component.inputConfig.isDisabled = false;
    component.ngOnInit();

    expect(component.inputConfig.formControl.enabled).toBe(true);
  });
});
