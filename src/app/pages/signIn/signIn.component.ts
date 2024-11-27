import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { tryLogin, tryRegister } from '../../util/auth/Authentication'; // auth 경로에 맞게 수정

@Component({
  selector: 'app-sign-in',
  templateUrl: './signIn.component.html',
  standalone: true,
  imports: [FormsModule,BrowserAnimationsModule],
  styleUrls: ['./signIn.component.css'],
})
export class SignInComponent {
  isLoginMode: boolean = true; // 로그인/회원가입 모드 전환
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  username: string = '';
  isEmailValid: boolean = true;

  constructor(private toastr: ToastrService) {}

  // 이메일 유효성 검사
  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailPattern.test(this.email);
  }

  // 로그인 처리
  onLogin() {
    tryLogin(
      this.email,
      this.password,
      (user) => {
        this.toastr.success(`Welcome back, ${user.id}!`, 'Login Successful');
      },
      () => {
        this.toastr.error('Invalid email or password.', 'Login Failed');
      }
    );
  }

  // 회원가입 처리
  onSignup() {
    if (this.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match.', 'Signup Failed');
      return;
    }

    tryRegister(
      this.email,
      this.password,
      () => {
        this.toastr.success('Account created successfully!', 'Signup Successful');
        this.switchMode(); // 회원가입 후 로그인 화면으로 전환
      },
      (error) => {
        this.toastr.error(error?.message || 'An error occurred.', 'Signup Failed');
      }
    );
  }

  // 로그인/회원가입 모드 전환
  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
