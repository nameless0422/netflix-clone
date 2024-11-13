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
    this.wishlistManager.loadWishlist();
    this.wishlist = this.wishlistManager.getWishlist();
  }
}
