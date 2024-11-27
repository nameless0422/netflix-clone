import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './signIn.component.html',
  standalone: true,
  imports: [FormsModule],
  styleUrls: ['./signIn.component.css'],
})
export class AuthComponent {
  isLoginMode: boolean = true;
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  username: string = '';
  rememberMe: boolean = false;
  agreeTerms: boolean = false;
  isEmailValid: boolean = true;

  constructor(private toastr: ToastrService) {}

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailPattern.test(this.email);
  }

  onLogin() {
    if (!this.isEmailValid) {
      this.toastr.error('Invalid email format', 'Error');
      return;
    }
    this.toastr.success('Login successful', 'Success');
  }

  onSignup() {
    if (!this.isEmailValid) {
      this.toastr.error('Invalid email format', 'Error');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match', 'Error');
      return;
    }
    if (!this.agreeTerms) {
      this.toastr.error('You must agree to the terms', 'Error');
      return;
    }
    this.toastr.success('Signup successful', 'Success');
  }
}
