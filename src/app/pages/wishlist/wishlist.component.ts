import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import WishlistManager from '../../util/movie/useWishlist';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MovieDetailComponent } from '../../components/movie-detail/movie-detail.component';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  standalone: true,
  imports: [CommonModule,MovieDetailComponent],
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];
  private wishlistManager = WishlistManager.getInstance();
  hoveredMovieId: number | null = null;
  selectedMovieId: number | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.cookieService.get('isLoggedIn') === 'true';
    if (!this.isLoggedIn) {
      // 로그인 상태가 아니면 로그인 페이지로 리다이렉트
      this.router.navigate(['/login']);
    } else {
      this.loadWishlist();
    }
  }

  loadWishlist(): void {
    this.wishlistManager.loadWishlist();
    this.wishlist = this.wishlistManager.getWishlist();
    this.cdr.detectChanges();
  }

  toggleFavorite(movie: any): void {
    this.wishlistManager.toggleWishlist(movie);
    this.loadWishlist();
  }

  // 평점 원형 차트 데이터 생성
  getScoreDashArray(score: number): string {
    const percentage = (score / 10) * 100;
    return `${percentage}, 100`;
  }

  // 위시리스트 여부 확인
  isMovieInWishlist(movieId: number): boolean {
    return this.wishlistManager.isInWishlist(movieId);
  }

  onMouseEnter(movieId: number): void {
    this.hoveredMovieId = movieId;
  }

  onMouseLeave(): void {
    this.hoveredMovieId = null;
  }

  openMovieDetail(movie: any) {
    if (typeof movie.id === 'number') {
      this.selectedMovieId = movie.id; // movie.id를 올바르게 전달
    } else {
      console.error('Invalid movieId:', movie.id);
    }
  }

  closeMovieDetail() {
    this.selectedMovieId = null;
  }
}
