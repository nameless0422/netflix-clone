import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { tryRegister } from '../../util/auth/Authentication'; // Authentication.ts 파일의 경로에 맞게 수정

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true, 
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSignup(): void {
    tryRegister(
      this.email,
      this.password,
      () => {
        // 회원가입 성공 시
        alert('회원가입이 완료되었습니다!');
        this.router.navigate(['/login']); // 회원가입 후 로그인 페이지로 리디렉션
      },
      (error) => {
        // 회원가입 실패 시
        alert(error?.message || '회원가입에 실패했습니다.');
      }
    );
  }
}
