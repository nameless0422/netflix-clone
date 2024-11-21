// login.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { tryLogin } from '../../util/auth/Authentication';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private cookieService: CookieService) {}

  onLogin(): void {
    tryLogin(
      this.email,
      this.password,
      () => {
        // 로그인 성공 시
        alert('로그인 성공!');
        this.cookieService.set('isLoggedIn', 'true', { expires: 1, path: '/' }); // 쿠키에 로그인 상태 저장 (1일 유효 기간)
        this.cookieService.set('userID', this.email, { expires: 1, path: '/' });
        this.router.navigate(['/']); // 로그인 후 홈으로 리디렉션
      },
      () => {
        // 로그인 실패 시
        alert('이메일 또는 비밀번호가 잘못되었습니다.');
      }
    );
  }
}

