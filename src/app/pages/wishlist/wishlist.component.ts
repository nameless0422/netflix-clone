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
  private wishlistManager = new WishlistManager();
  hoveredMovieId: number | null = null; // 마우스 호버 상태 관리

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlistManager.loadWishlist();
    this.wishlist = this.wishlistManager.getWishlist();
    console.log('Loaded Wishlist:', this.wishlist); // 디버깅용
    this.cdr.detectChanges(); // 상태 변경 강제 반영
  }

  isMovieInWishlist(movieId: number): boolean {
    return this.wishlistManager.isInWishlist(movieId); // 위시리스트에 영화가 있는지 확인
  }

  toggleFavorite(movie: any): void {
    this.wishlistManager.toggleWishlist(movie); // 좋아요 상태 토글
    this.loadWishlist(); // 위시리스트 다시 로드
  }

  onMouseEnter(movieId: number): void {
    this.hoveredMovieId = movieId; // 마우스가 영화 카드 위로 올라갔을 때
  }

  onMouseLeave(): void {
    this.hoveredMovieId = null; // 마우스가 영화 카드에서 벗어났을 때
  }
}
