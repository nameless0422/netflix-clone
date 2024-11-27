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
  imports: [CommonModule, MovieDetailComponent],
})
export class NewComponent implements OnInit {
  movies: any[] = [];
  currentMovies: any[] = [];
  page: number = 1; // 초기 페이지
  currentPage: number = 1; // 테이블 보기에서 현재 페이지
  itemsPerPage: number = 10; // 테이블 보기에서 페이지당 영화 개수
  isListView: boolean = true; // 뷰 전환 상태
  isLoggedIn: boolean = false;
  wishlist: any[] = [];
  private wishlistManager = WishlistManager.getInstance();
  hoveredMovieId: number | null = null;
  selectedMovieId: number | null = null;
  isLoading: boolean = false;
  showScrollToTop: boolean = false;

  constructor(private movieService: MovieService, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.cookieService.get('isLoggedIn') === 'true';
    this.wishlistManager.loadWishlist();
    this.loadInitialMovies();
  }

  async loadInitialMovies(): Promise<void> {
    try {
      for (let i = 1; i <= 3; i++) {
        const response = await this.movieService.getReleaseMovies(i);
        if (response && response.results) {
          const filteredMovies = response.results.filter(
            (movie: any) => !this.movies.some((m) => m.id === movie.id)
          );
          this.movies = [...this.movies, ...filteredMovies];
        }
      }
      this.updateCurrentMovies(); // 테이블 보기 초기 페이지 설정
    } catch (error) {
      console.error('Error loading initial movies:', error);
    }
  }

  async loadMoreMovies(): Promise<void> {
    if (!this.isListView) return; // 테이블 보기일 때는 무한 스크롤 비활성화
    this.isLoading = true;
    try {
      const response = await this.movieService.getReleaseMovies(this.page);
      if (response && response.results) {
        const filteredMovies = response.results.filter(
          (movie: any) => !this.movies.some((m) => m.id === movie.id)
        );
        this.movies = [...this.movies, ...filteredMovies];
        this.page++;
      }
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      this.isLoading = false;
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!this.isListView) return;
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) {
      this.loadMoreMovies();
    }
    this.showScrollToTop = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleView(): void {
    this.isListView = !this.isListView;
    if (!this.isListView) {
      this.updateCurrentMovies();
    }
  }

  updateCurrentMovies(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentMovies = this.movies.slice(startIndex, endIndex);
  }

  goToNextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.movies.length) {
      this.currentPage++;
      this.updateCurrentMovies();
    }else{
      this.loadMoreMovies();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateCurrentMovies();
    }
  }

  isFavorite(movieId: number): boolean {
    return this.wishlistManager.isInWishlist(movieId);
  }

  toggleFavorite(movie: { id: number; title: string; poster_path: string }): void {
    this.wishlistManager.toggleWishlist(movie);
  }

  onFavoriteClick(event: MouseEvent, movie: { id: number; title: string; poster_path: string }): void {
    event.stopPropagation();
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

  openMovieDetail(movie: any): void {
    this.selectedMovieId = movie.id;
  }

  closeMovieDetail(): void {
    this.selectedMovieId = null;
  }
}
