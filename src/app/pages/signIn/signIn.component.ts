import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tryLogin, tryRegister } from '../../util/auth/Authentication';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './signIn.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private router: Router, private cookieService: CookieService) {}

  ngOnInit() {
    // 카카오 SDK 초기화
    if (!Kakao.isInitialized()) {
      Kakao.init(environment.kakaoApiKey); // 발급받은 카카오 JavaScript 키
      console.log('Kakao Initialized:', Kakao.isInitialized());
    }

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
        alert(`안녕하세요, ${user.id}님! 로그인 성공`); // 성공 메시지
        this.cookieService.set('isLoggedIn', 'true', { path: '/', expires: 7 });
        this.cookieService.set('userID', this.email, { expires: 1, path: '/' });
        // 루트 경로로 라우팅
        this.router.navigate(['/']);
      },
      () => {
        alert('이메일 또는 비밀번호가 잘못되었습니다. 로그인 실패'); // 실패 메시지
      }
    );
  }

  // 회원가입 처리
  onSignup() {
    if (this.password !== this.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다. 회원가입 실패'); // 비밀번호 불일치 메시지
      return;
    }

    if (!this.agreeToTerms) {
      alert('약관에 동의해야 합니다. 회원가입 실패'); // 약관 동의 메시지
      return;
    }

    tryRegister(
      this.email,
      this.password,
      () => {
        alert('회원가입이 완료되었습니다! 회원가입 성공'); // 성공 메시지
        this.switchMode(); // 회원가입 후 로그인 화면으로 전환
      },
      (error) => {
        alert(error?.message || '오류가 발생했습니다. 회원가입 실패'); // 실패 메시지
      }
    );
  }

  // 카카오 로그인 처리
  onKakaoLogin(event: Event) {
    // 기본 동작 차단
    event.preventDefault();
    event.stopPropagation();
  
    if (!Kakao.isInitialized()) {
      console.error('Kakao SDK가 초기화되지 않았습니다.');
      return;
    }
  
    // 카카오 인증 성공 후 처리
    Kakao.Auth.login({
      success: (authObj: any) => {
        console.log('카카오 로그인 성공:', authObj);
        Kakao.API.request({
          url: '/v2/user/me',
          success: (res: any) => {
            const kakaoEmail = res.kakao_account.profile.nickname;
            const kakaoNickname = res.kakao_account.profile.nickname;
  
            console.log(`카카오 계정 정보: ${kakaoEmail}, ${kakaoNickname}`);
  
            // tryLogin 시도
            tryLogin(
              kakaoEmail,
              kakaoNickname, // 비밀번호 대신 닉네임을 임시로 사용
              (user) => {
                alert(`로그인 성공! ${user.id}님, 환영합니다.`);
                this.cookieService.set('isLoggedIn', 'true', { path: '/', expires: 7 });
                this.cookieService.set('userID', kakaoEmail, { path: '/', expires: 7 });
                this.router.navigate(['/']); // 로그인 성공 시 홈으로 이동
              },
              () => {
                // 로그인 실패 시 회원가입 시도
                console.log('로그인 실패, 회원가입 시도');
                tryRegister(
                  kakaoEmail,
                  kakaoNickname, // 비밀번호 대신 닉네임 사용
                  () => {
                    alert(`회원가입 성공! ${kakaoNickname}님, 환영합니다.`);
                    tryLogin(
                      kakaoEmail,
                      kakaoNickname, // 비밀번호 대신 닉네임 사용
                      (user) => {
                        alert(`자동 로그인 성공! ${user.id}님, 환영합니다.`);
                        this.cookieService.set('isLoggedIn', 'true', { path: '/', expires: 7 });
                        this.cookieService.set('userID', kakaoEmail, { path: '/', expires: 7 });
                        this.router.navigate(['/']); // 자동 로그인 성공 시 홈으로 이동
                      },
                      () => {
                        alert('자동 로그인 실패: 다시 시도해주세요.');
                      }
                    );
                  },
                  (error) => {
                    alert(error?.message || '회원가입 실패: 알 수 없는 오류 발생');
                  }
                );
              }
            );
          },
          fail: (err: any) => {
            console.error('카카오 사용자 정보 요청 실패:', err);
          },
        });
      },
      fail: (err: any) => {
        console.error('카카오 로그인 실패:', err);
      },
    });
  }
  

  // 로그인/회원가입 모드 전환
  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
