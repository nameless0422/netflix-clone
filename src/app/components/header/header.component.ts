import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule } from '@angular/router';
import WishlistManager from '../../util/movie/useWishlist';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterModule],
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isMenuOpen: boolean = false;
  currentUserEmail: string | null = null;

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
      this.router.navigate(['/login']);
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
  }
}
