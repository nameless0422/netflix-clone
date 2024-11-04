import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  onSignIn(): void {
    // 회원 가입 처리 로직
    console.log('SignIn clicked');
  }
}
