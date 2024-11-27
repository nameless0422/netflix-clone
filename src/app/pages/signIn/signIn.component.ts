import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { tryLogin, tryRegister } from '../../util/auth/Authentication';

@Component({
  selector: 'app-sign-in',
  templateUrl: './signIn.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastrModule],
  styleUrls: ['./signIn.component.css'],
})
export class SignInComponent {
  isLoginMode: boolean = true; // 로그인/회원가입 모드 전환
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  username: string = '';
  isEmailValid: boolean = true;
  rememberMe: boolean = false; // 아이디 저장 및 자동 로그인
  agreeToTerms: boolean = false; // 약관 동의

  constructor(private toastr: ToastrService) {}

  ngOnInit() {
    // 자동 로그인 정보 로드
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedEmail && savedPassword) {
      this.email = savedEmail;
      this.password = savedPassword;
      this.rememberMe = true;
    }
  }

  // 이메일 유효성 검사
  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailPattern.test(this.email);
  }

  // 로그인 처리
  onLogin() {
    if (this.rememberMe) {
      localStorage.setItem('savedEmail', this.email);
      localStorage.setItem('savedPassword', this.password);
    } else {
      localStorage.removeItem('savedEmail');
      localStorage.removeItem('savedPassword');
    }

    tryLogin(
      this.email,
      this.password,
      (user) => {
        this.toastr.success(`안녕하세요, ${user.id}님!`, '로그인 성공');
      },
      () => {
        this.toastr.error('이메일 또는 비밀번호가 잘못되었습니다.', '로그인 실패');
      }
    );
  }

  // 회원가입 처리
  onSignup() {
    if (this.password !== this.confirmPassword) {
      this.toastr.error('비밀번호가 일치하지 않습니다.', '회원가입 실패');
      return;
    }

    if (!this.agreeToTerms) {
      this.toastr.warning('약관에 동의해야 합니다.', '회원가입 실패');
      return;
    }

    tryRegister(
      this.email,
      this.password,
      () => {
        this.toastr.success('회원가입이 완료되었습니다!', '회원가입 성공');
        this.switchMode(); // 회원가입 후 로그인 화면으로 전환
      },
      (error) => {
        this.toastr.error(error?.message || '오류가 발생했습니다.', '회원가입 실패');
      }
    );
  }

  // 로그인/회원가입 모드 전환
  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
