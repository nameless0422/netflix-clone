import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule } from '@angular/router';
import WishlistManager from '../../util/movie/useWishlist';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule],
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isMenuOpen: boolean = false;
  currentUserEmail: string | null = null;
  touchStartX: number = 0;

  private wishlistManager = WishlistManager.getInstance(); // 싱글턴 인스턴스 가져오기

  constructor(private cookieService: CookieService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // 로그인 상태와 사용자 이메일 확인
        this.isLoggedIn = this.cookieService.get('isLoggedIn') === 'true';
        this.currentUserEmail = this.cookieService.get('userID');

        if (this.isLoggedIn && this.currentUserEmail) {
          this.wishlistManager.setUserEmail(this.currentUserEmail); // 이메일 설정
        }
      }
    });
  }

  onProfileClick(): void {
    if (this.isLoggedIn) {
      this.logout();
    } else {
      this.router.navigate(['/signIn']);
    }
  }

  logout(): void {
    this.cookieService.delete('isLoggedIn', '/');
    this.cookieService.delete('userID', '/');
    alert('로그아웃 되었습니다.');
    this.isLoggedIn = false;
    this.currentUserEmail = null;
    this.router.navigate(['/']);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    const slideMenu = document.getElementById('slideMenu');
    if (this.isMenuOpen) {
      slideMenu?.classList.add('active');
    } else {
      slideMenu?.classList.remove('active');
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX; // 터치 시작 위치 저장
  }

  onTouchEnd(event: TouchEvent): void {
    const touchEndX = event.changedTouches[0].clientX; // 터치 종료 위치 저장
    const swipeDistance = touchEndX - this.touchStartX;

    if (swipeDistance > 50) {
      // 오른쪽으로 50px 이상 스와이프하면 메뉴 닫기
      this.isMenuOpen = false;
      const slideMenu = document.getElementById('slideMenu'); 
      slideMenu?.classList.remove('active');
    }
  }
}
