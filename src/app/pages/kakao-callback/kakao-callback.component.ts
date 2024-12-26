import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kakao-callback',
  template: `<p>카카오 로그인 중...</p>`,
})
export class KakaoCallbackComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      console.log('카카오 인증 코드:', code);
      // TODO: 서버로 인증 코드 전송 또는 추가 처리
      this.router.navigate(['/']); // 인증 완료 후 홈 화면으로 이동
    } else {
      console.error('카카오 인증 실패');
      this.router.navigate(['/signIn']); // 인증 실패 시 다시 로그인 페이지로 이동
    }
  }
}
