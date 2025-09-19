import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
})
export class PasswordInputComponent implements ControlValueAccessor {
  @Input() label: string = 'Password';
  @Input() placeholder: string = 'Enter your password';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() appearance: MatFormFieldAppearance = 'fill';
  @Input() hint: string = '';
  @Input() errorMessage: string = '';
  @Input() showError: boolean = false;

  @Output() valueChange = new EventEmitter<string>();

  hide = signal(true);
  value: string = '';

  // ControlValueAccessor implementation
  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  togglePasswordVisibility(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
