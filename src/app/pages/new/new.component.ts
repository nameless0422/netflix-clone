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
  page: number = 1;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  isListView: boolean = true;
  isLoggedIn: boolean = false;
  wishlist: any[] = [];
  private wishlistManager = WishlistManager.getInstance();
  hoveredMovieId: number | null = null;
  selectedMovieId: number | null = null;
  isLoading: boolean = false;
  showScrollToTop: boolean = false;
  gridTemplateColumns: string = '';

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
      this.updateCurrentMovies();
    } catch (error) {
      console.error('Error loading initial movies:', error);
    }
  }

  async loadMoreMovies(): Promise<void> {
    if (!this.isListView) return;
    this.isLoading = true;
    try {
      const response = await this.movieService.getReleaseMovies(this.page);
      if (response && response.results) {
        const filteredMovies = response.results.filter(
          (movie: any) => !this.movies.some((m) => m.id === movie.id)
        );
        this.movies = [...this.movies, ...filteredMovies];
        this.page++;
        this.updateCurrentMovies(); // 페이지 업데이트
      }
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      this.isLoading = false;
    }
  }

  setGridTemplateColumns(): void {
    const containerWidth = window.innerWidth;
    const cardWidth = 200 + 15;
    const columns = Math.floor(containerWidth / cardWidth);
    this.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }

  @HostListener('window:resize', [])
  onResize(): void {
    if (!this.isListView) this.setGridTemplateColumns();
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
      this.setGridTemplateColumns();
    }
  }

  updateCurrentMovies(): void {
    if (this.isListView) {
      // 리스트 보기: 현재 페이지 데이터만 표시
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.currentMovies = this.movies.slice(startIndex, endIndex);
    } else {
      // 테이블 보기: 화면 크기에 맞게 데이터 표시
      const containerHeight = window.innerHeight - 200; // 화면 높이에서 상하 여백을 뺀 값
      const containerWidth = window.innerWidth - 40; // 화면 너비에서 좌우 여백을 뺀 값
      const cardHeight = 300 + 20; // 카드 높이 + 간격 (CSS와 일치)
      const cardWidth = 200 + 20; // 카드 너비 + 간격
  
      const rows = Math.floor(containerHeight / cardHeight); // 표시할 행 수
      const cols = Math.floor(containerWidth / cardWidth); // 표시할 열 수
      const visibleItems = rows * cols; // 화면에 표시할 수 있는 최대 아이템 수
  
      this.currentMovies = this.movies.slice(0, visibleItems);
    }
  }

  goToNextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.movies.length) {
      this.currentPage++;
      this.updateCurrentMovies();
    } else {
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
