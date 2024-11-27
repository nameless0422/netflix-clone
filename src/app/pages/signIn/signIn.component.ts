import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; // Custom Toast 라이브러리

@Component({
  selector: 'app-auth',
  templateUrl: './signIn.component.html',
  standalone: true,
  imports: [CommonModule,FormsModule],
  styleUrls: ['./signIn.component.css'],
})
export class SignInComponent {
  isLoginMode: boolean = true;
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  rememberMe: boolean = false;
  agreeTerms: boolean = false;
  isEmailValid: boolean = true;

  constructor(private router: Router, private cookieService: CookieService, private toastr: ToastrService) {}

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailPattern.test(this.email);
  }

  onLogin() {
    if (!this.isEmailValid) {
      this.toastr.error('올바른 이메일 형식을 입력하세요.');
      return;
    }
    // 로그인 로직 (예제)
    this.toastr.success('로그인 성공!');
    if (this.rememberMe) {
      this.cookieService.set('userEmail', this.email, { expires: 30 });
    }
    this.router.navigate(['/']);
  }

  onSignup() {
    if (!this.isEmailValid) {
      this.toastr.error('올바른 이메일 형식을 입력하세요.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.toastr.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!this.agreeTerms) {
      this.toastr.error('약관에 동의해주세요.');
      return;
    }
    // 회원가입 로직 (예제)
    this.toastr.success('회원가입 성공!');
    this.switchMode();
  }
}
