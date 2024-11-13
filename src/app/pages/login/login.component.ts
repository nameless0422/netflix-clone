import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

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
    // 로그인 로직 추가
    if (this.email === 'test@example.com' && this.password === 'password') {
      // 임시 로그인 성공 조건 - 실제로는 API 호출로 처리
      alert('로그인 성공!');
      this.cookieService.set('isLoggedIn', 'true', { expires: 1, path: '/' }); // 쿠키에 로그인 상태 저장 (1일 유효 기간)
      this.router.navigate(['/']); // 로그인 후 홈으로 리디렉션
    } else {
      alert('이메일 또는 비밀번호가 잘못되었습니다.');
    }
  }
}
