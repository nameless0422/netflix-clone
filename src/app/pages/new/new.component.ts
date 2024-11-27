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
  currentMovies: any[] = []; // 테이블 뷰에서 사용할 영화 데이터
  page: number = 4; // 초기 로드 이후 추가 페이지는 4부터 시작
  currentPage: number = 1; // 현재 페이지 (테이블 뷰에서 사용)
  itemsPerPage: number = 10; // 한 페이지에 표시할 영화 개수
  isGridView: boolean = true; // 뷰 전환 상태
  isLoggedIn: boolean = false;
  wishlist: any[] = [];
  private wishlistManager = WishlistManager.getInstance();
  hoveredMovieId: number | null = null;
  selectedMovieId: number | null = null;
  isLoading: boolean = false; // 로딩 상태
  showScrollToTop: boolean = false; // 맨 위로 버튼 표시 여부

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
          const filteredMovies = response.results.filter(
            (movie: any) => !this.movies.some((m) => m.id === movie.id)
          );
          this.movies = [...this.movies, ...filteredMovies];
        } else {
          console.error('No results found for page:', i);
        }
      }
      this.updateCurrentMovies(); // 초기 데이터 로드 후 현재 페이지 설정
    } catch (error) {
      console.error('Error loading initial release movies:', error);
    }
  }

  async loadReleaseMovies(): Promise<void> {
    if (!this.isGridView) return; // 테이블 뷰일 때는 무한 스크롤 비활성화
    this.isLoading = true;
    try {
      const response = await this.movieService.getReleaseMovies(this.page);
      if (response && response.results) {
        const filteredMovies = response.results.filter(
          (movie: any) => !this.movies.some((m) => m.id === movie.id)
        );
        this.movies = [...this.movies, ...filteredMovies];
        this.page++;
      } else {
        console.error('No results found');
      }
    } catch (error) {
      console.error('Error loading release movies:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // 무한 스크롤
  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!this.isGridView) return; // 테이블 뷰일 때는 무한 스크롤 비활성화
    if (
      window.innerHeight + window.scrollY >=
      document.body.scrollHeight - 50
    ) {
      this.loadReleaseMovies();
    }

    // 맨 위로 버튼 표시 여부
    this.showScrollToTop = window.scrollY > 300;
  }

  // 맨 위로 이동
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 뷰 전환
  toggleView(): void {
    this.isGridView = !this.isGridView;
    if (!this.isGridView) {
      this.updateCurrentMovies(); // 테이블 뷰로 전환 시 현재 페이지 업데이트
    }
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
      this.selectedMovieId = movie.id;
    } else {
      console.error('Invalid movieId:', movie.id);
    }
  }

  closeMovieDetail() {
    this.selectedMovieId = null;
  }

  // 페이지네이션 로직
  goToNextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.movies.length) {
      this.currentPage++;
      this.updateCurrentMovies();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateCurrentMovies();
    }
  }

  hasNextPage(): boolean {
    const startIndex = this.currentPage * this.itemsPerPage;
    return startIndex < this.movies.length;
  }

  updateCurrentMovies(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentMovies = this.movies.slice(startIndex, endIndex);
  }
}
