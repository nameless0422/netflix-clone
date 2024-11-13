import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  imports: [FormsModule],
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSignup(): void {
    // 회원가입 로직 추가 (예: 서버로 데이터 전송)
    alert('회원가입이 완료되었습니다!');
    this.router.navigate(['/login']); // 회원가입 후 로그인 페이지로 리디렉션
  }
}
