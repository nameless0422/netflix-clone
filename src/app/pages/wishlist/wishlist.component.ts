import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import WishlistManager from '../../util/movie/useWishlist';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];
  private wishlistManager = new WishlistManager();
  hoveredMovieId: number | null = null; // 마우스 호버 상태 관리

  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.wishlistManager.checkLoginStatus();
    if (this.wishlistManager.isLoggedIn) {
      this.loadWishlist();
    } else {
      alert('로그인이 필요합니다.');
      this.router.navigate(['/login']);
    }
  }

  // 위시리스트 로드
  loadWishlist(): void {
    this.wishlistManager.loadWishlist(); // 사용자별 위시리스트 로드
    this.wishlist = this.wishlistManager.getWishlist();
    console.log('Loaded Wishlist:', this.wishlist); // 디버깅용
    this.cdr.detectChanges(); // 상태 변경 강제 반영
  }

  // 좋아요 상태 확인
  isMovieInWishlist(movieId: number): boolean {
    return this.wishlistManager.isInWishlist(movieId);
  }

  // 좋아요 상태 토글
  toggleFavorite(movie: any): void {
    if (!this.wishlistManager.isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }
    this.wishlistManager.toggleWishlist(movie); // 사용자별 데이터 저장
    this.loadWishlist(); // 위시리스트 다시 로드
  }

  // 마우스가 영화 카드 위로 올라갔을 때
  onMouseEnter(movieId: number): void {
    this.hoveredMovieId = movieId;
  }

  // 마우스가 영화 카드에서 벗어났을 때
  onMouseLeave(): void {
    this.hoveredMovieId = null;
  }

  // 평점 원형 차트 데이터 생성
  getScoreDashArray(score: number): string {
    const percentage = (score / 10) * 100; // 평점이 10점 만점이므로 10으로 나눔
    return `${percentage}, 100`;
  }
}
