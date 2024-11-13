import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin(): void {
    // 로그인 로직 추가
    if (this.email === 'test@example.com' && this.password === 'password') {
      // 임시 로그인 성공 조건 - 실제로는 API 호출로 처리
      alert('로그인 성공!');
      this.router.navigate(['/']); // 로그인 후 홈으로 리디렉션
    } else {
      alert('이메일 또는 비밀번호가 잘못되었습니다.');
    }
  }
}
