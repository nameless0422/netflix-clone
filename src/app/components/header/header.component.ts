import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private cookieService: CookieService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // 페이지 이동이 완료되면 로그인 상태 확인
        this.isLoggedIn = this.cookieService.get('isLoggedIn') === 'true';
      }
    });
  }

  onProfileClick(): void {
    console.log('Profile button clicked');
    if (this.isLoggedIn) {
      this.logout();
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.cookieService.delete('isLoggedIn', '/');
    alert('로그아웃 되었습니다.');
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
