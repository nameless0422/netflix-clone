import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../util/movie/movie.service';
import { CookieService } from 'ngx-cookie-service';
import WishlistManager from '../../util/movie/useWishlist';
import { MovieDetailComponent } from '../../components/movie-detail/movie-detail.component';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
  standalone: true,
  imports: [CommonModule,MovieDetailComponent],
})
export class NewComponent implements OnInit {
  movies: any[] = [];
  page: number = 4; // 초기 로드 이후 추가 페이지는 4부터 시작
  isGridView: boolean = true;
  isLoggedIn: boolean = false;
  wishlist: any[] = [];
  private wishlistManager = WishlistManager.getInstance();
  hoveredMovieId: number | null = null;
  selectedMovieId: number | null = null;

  constructor(private movieService: MovieService, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.cookieService.get('isLoggedIn') === 'true';
    this.wishlistManager.loadWishlist();
    this.loadInitialMovies(); // 초기 데이터 로드
  }

  async loadInitialMovies(): Promise<void> {
    try {
        for (let i = 1; i <= 3; i++) {
            const response = await this.movieService.getReleaseMovies(i);
            if (response && response.results) {
                // 중복 제거
                const filteredMovies = response.results.filter(
                    (movie: any) => !this.movies.some((m) => m.id === movie.id)
                );
                this.movies = [...this.movies, ...filteredMovies]; // 기존 데이터에 추가
            } else {
                console.error('No results found for page:', i);
            }
        }
    } catch (error) {
        console.error('Error loading initial release movies:', error);
    }
}

  async loadReleaseMovies(): Promise<void> {
    try {
      const response = await this.movieService.getReleaseMovies(this.page);
      if (response && response.results) {
        // 중복 제거
        const filteredMovies = response.results.filter(
          (movie: any) => !this.movies.some((m) => m.id === movie.id)
        );
        this.movies = [...this.movies, ...filteredMovies]; // 기존 데이터에 추가
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
