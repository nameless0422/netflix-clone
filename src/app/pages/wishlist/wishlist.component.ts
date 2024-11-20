import { Component, OnInit } from '@angular/core';
import WishlistManager from '../../util/movie/useWishlist';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: Movie[] = [];
  isLoading: boolean = true;

  constructor(private wishlistManager: WishlistManager) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    try {
      this.isLoading = true;
      this.wishlist = this.wishlistManager.getWishlist();
      console.log('Loaded Wishlist:', this.wishlist);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      this.wishlist = [];
    } finally {
      this.isLoading = false;
    }
  }

  removeFromWishlist(movieId: number): void {
    try {
      const movie = this.wishlist.find((item) => item.id === movieId);
      if (movie) {
        this.wishlistManager.toggleWishlist(movie);
        this.loadWishlist();
      }
    } catch (error) {
      console.error('Error removing movie from wishlist:', error);
    }
  }
}
