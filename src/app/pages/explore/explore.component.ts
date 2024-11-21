import { Component, OnInit, HostListener } from '@angular/core';
import { MovieService } from '../../util/movie/movie.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import WishlistManager from '../../util/movie/useWishlist';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  searchResults: any[] = [];
  genres: any[] = [];
  ratings: number[] = [5, 6, 7, 8, 9, 10];
  languages: any[] = [];
  
  wishlistManager: WishlistManager;
  hoveredMovieId: number | null = null; // 마우스 호버 상태 관리
  selectedGenre: string = '';
  selectedRating: string = '';
  selectedLanguage: string = '';
  currentPage: number = 1; // 현재 페이지
  isLoading: boolean = false; // 로딩 상태 확인
  isLoggedIn: boolean = false;

  constructor(private movieService: MovieService, private cookieService: CookieService) {
    this.wishlistManager = WishlistManager.getInstance();
    this.wishlistManager.loadWishlist();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.cookieService.get('isLoggedIn') === 'true';
    this.resetFilters(); // 페이지 로드 시 필터와 검색 결과 초기화
    this.loadGenres();
    this.loadLanguages();
  }

  loadGenres(): void {
    this.movieService.getGenres().then((genres) => {
      this.genres = genres;
    });
  }

  loadLanguages(): void {
    this.movieService.getLanguages().then((languages) => {
      this.languages = languages;
    });
  }

  async applyFilters(): Promise<void> {
    this.currentPage = 1;
    this.searchResults = []; // 기존 결과 초기화
  
    // 최초에 60개 데이터 로드
    for (let i = 1; i <= 3; i++) {
      await this.loadMoreMovies(); // 3페이지 데이터 로드
    }
  }

  async loadMoreMovies(): Promise<void> {
    if (this.isLoading) return;

    this.isLoading = true;
    try {
      const newMovies = await this.movieService.getMoviesByFilters(
        this.selectedGenre,
        this.selectedRating,
        this.selectedLanguage,
        this.currentPage
      );
      this.searchResults = [...this.searchResults, ...newMovies];
      this.currentPage++;
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      this.isLoading = false;
    }
  }

  resetFilters(): void {
    this.selectedGenre = '';
    this.selectedRating = '';
    this.selectedLanguage = '';
    this.applyFilters();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const threshold = 300; // 스크롤 바닥과의 거리 (px)
    const position = window.innerHeight + window.scrollY;
    const height = document.body.scrollHeight;

    if (position >= height - threshold) {
      this.loadMoreMovies(); // 추가 데이터 로드
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
}
