import { Component, OnInit } from '@angular/core';
import WishlistManager from '../../util/movie/useWishlist';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];
  private wishlistManager = new WishlistManager();

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlistManager.loadWishlist();
    this.wishlist = this.wishlistManager.getWishlist();
  }

  removeFromWishlist(movieId: number): void {
    const movie = this.wishlist.find((item) => item.id === movieId);
    if (movie) {
      this.wishlistManager.toggleWishlist(movie); // 위시리스트에서 제거
      this.loadWishlist(); // 위시리스트 갱신
    }
  }
}
