import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf,NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router,RouterModule } from '@angular/router';
import { register } from '../../store/actions/auth.actions';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterModule, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) 
  
  {
    this.registerForm = this.fb.group({
      confirmPassword: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    },{ validators: this.passwordMatchValidator });
  }
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null 
      : { passwordMismatch: true };
  }
  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      console.log('Form data:', { email, password }); // Verifică datele din formular
      this.store.dispatch(register({ email, password }));
    }
  }
}