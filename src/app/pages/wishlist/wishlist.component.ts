import { Component, OnInit ,ChangeDetectorRef  } from '@angular/core';
import WishlistManager from '../../util/movie/useWishlist';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  standalone: true,
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];
  private wishlistManager = new WishlistManager();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlistManager.loadWishlist();
    this.wishlist = this.wishlistManager.getWishlist();
    console.log('Loaded Wishlist:', this.wishlist); // 디버깅용
    this.cdr.detectChanges();
  }

  removeFromWishlist(movieId: number): void {
    const movie = this.wishlist.find((item) => item.id === movieId);
    if (movie) {
      this.wishlistManager.toggleWishlist(movie);
      this.loadWishlist();
    }
  }
}
