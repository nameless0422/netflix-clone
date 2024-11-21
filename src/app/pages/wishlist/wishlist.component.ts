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
  private wishlistManager = WishlistManager.getInstance(); // 싱글턴 인스턴스 가져오기
  hoveredMovieId: number | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlist = this.wishlistManager.getWishlist();
    this.cdr.detectChanges();
  }

  toggleFavorite(movie: any): void {
    this.wishlistManager.toggleWishlist(movie);
    this.loadWishlist();
  }

  onMouseEnter(movieId: number): void {
    this.hoveredMovieId = movieId;
  }

  onMouseLeave(): void {
    this.hoveredMovieId = null;
  }
}
