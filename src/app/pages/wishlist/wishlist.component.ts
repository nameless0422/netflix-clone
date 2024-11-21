import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import WishlistManager from '../../util/movie/useWishlist';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];
  private wishlistManager = WishlistManager.getInstance();
  hoveredMovieId: number | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadWishlist();
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
}

