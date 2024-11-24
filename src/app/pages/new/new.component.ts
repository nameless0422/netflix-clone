import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../util/movie/movie.service';
import { CookieService } from 'ngx-cookie-service';
import WishlistManager from '../../util/movie/useWishlist';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class NewComponent implements OnInit {
  movies: any[] = [];
  page: number = 1;
  isGridView: boolean = true;
  isLoggedIn: boolean = false;
  wishlist: any[] = [];
  private wishlistManager = WishlistManager.getInstance();
  hoveredMovieId: number | null = null;

  constructor(private movieService: MovieService, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.cookieService.get('isLoggedIn') === 'true';
    this.wishlistManager.loadWishlist();
    this.loadReleaseMovies(); // 초기 데이터 로드
  }

  async loadReleaseMovies(): Promise<void> {
    try {
      const response = await this.movieService.getReleaseMovies(this.page);
      if (response && response.results) {
        this.movies = [...this.movies, ...response.results]; // 기존 데이터에 새 데이터 추가
      } else {
        console.error('No results found');
      }
    } catch (error) {
      console.error('Error loading release movies:', error);
    }
  }
  

  // 무한스크롤
  @HostListener('window:scroll', [])
  onScroll(): void {
    if (
      window.innerHeight + window.scrollY >=
      document.body.scrollHeight - 50
    ) {
      this.page++;
      this.loadReleaseMovies();
    }
  }

  // 뷰 전환
  toggleView(): void {
    this.isGridView = !this.isGridView;
  }

  // 찜 여부 확인
  isFavorite(movieId: number): boolean {
    return this.wishlistManager.isInWishlist(movieId);
  }

  // 찜 토글
  toggleFavorite(movie: { id: number; title: string; poster_path: string }): void {
    this.wishlistManager.toggleWishlist(movie);
  }

  onFavoriteClick(event: MouseEvent, movie: { id: number; title: string; poster_path: string }): void {
    event.stopPropagation(); // 이벤트 전파 방지
    this.toggleFavorite(movie);
  }

  getScoreDashArray(score: number): string {
    const percentage = (score / 100) * 100;
    return `${percentage}, 100`;
  }

  onMouseEnter(movieId: number): void {
    this.hoveredMovieId = movieId;
  }

  onMouseLeave(): void {
    this.hoveredMovieId = null;
  }
}
