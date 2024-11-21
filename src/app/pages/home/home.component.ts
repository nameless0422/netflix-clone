import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MovieService } from '../../util/movie/movie.service';
import WishlistManager from '../../util/movie/useWishlist';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MovieDetailComponent } from '../../components/movie-detail/movie-detail.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive, MovieDetailComponent],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  movieCategories: any[] = [];
  movieTitle: string = '';
  movieDescription: string = '';
  movieBackdrop: string = '';
  movieVideos: any[] = [];
  selectedMovieId: any = null;
  hoveredMovieId: number | null = null;
  hoveredContainer: string | null = null;
  wishlistManager: WishlistManager;
  isLoggedIn: boolean = false;

  @ViewChild('popularRow') popularRow!: ElementRef;
  @ViewChild('releaseRow') releaseRow!: ElementRef;
  @ViewChild('actionRow') actionRow!: ElementRef;

  constructor(private movieService: MovieService, private cookieService: CookieService) {
    this.wishlistManager = WishlistManager.getInstance();
    this.wishlistManager.loadWishlist(); // 로컬 스토리지에서 찜 목록 로드
  }

  ngOnInit(): void {
    this.isLoggedIn = this.cookieService.get('isLoggedIn') === 'true';
    this.loadBannerMovie();
    this.loadData();
  }

  async loadBannerMovie() {
    try {
      const randomMovie = await this.movieService.getRandomMovies();
  
      if (randomMovie) {
        this.movieTitle = randomMovie.original_title || '제목 없음';
        this.movieDescription = randomMovie.overview || '설명 없음';
        this.movieBackdrop = `https://image.tmdb.org/t/p/original/${randomMovie.backdrop_path}`;
      } else {
        console.error('No movie data found');
      }
    } catch (error) {
      console.error('Error loading banner movie:', error);
    }
  }

  async loadData() {
    try {
      // 모든 영화 데이터를 병렬로 불러옴
      const [trending, action, adventure, animation, comedy, documentary, scifi, thriller] = await Promise.all([
        this.movieService.getReleaseMovies(1),
        this.movieService.getMoviesByGenre('28', 1),
        this.movieService.getMoviesByGenre('12', 1),
        this.movieService.getMoviesByGenre('16', 1),
        this.movieService.getMoviesByGenre('35', 1),
        this.movieService.getMoviesByGenre('99', 1),
        this.movieService.getMoviesByGenre('878', 1),
        this.movieService.getMoviesByGenre('53', 1)
      ]);

      // 데이터가 모두 로드된 후에 카테고리 배열 업데이트
      this.movieCategories = [
        { title: 'Trending', result: trending.results },
        { title: 'Action', result: action.results },
        { title: 'Adventure', result: adventure.results },
        { title: 'Animation', result: animation.results },
        { title: 'Comedy', result: comedy.results },
        { title: 'Documentary', result: documentary.results },
        { title: 'Science-Fiction', result: scifi.results },
        { title: 'Thriller', result: thriller.results }
      ];
      this.wishlistManager.loadWishlist(); // 위시리스트 업데이트
    } catch (error) {
      console.error('Error loading movie data:', error);
    }
  }

  scrollLeft(category: string) {
    const element = document.querySelector(`[data-category="${category}"]`);
    if (element) {
      element.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  }

  scrollRight(category: string) {
    const element = document.querySelector(`[data-category="${category}"]`);
    if (element) {
      element.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
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

  // movie-row-container에 마우스를 올릴 때
  onContainerEnter(containerTitle: string): void {
    this.hoveredContainer = containerTitle;
  }

  // movie-row-container에서 마우스를 벗어날 때
  onContainerLeave(): void {
    this.hoveredContainer = null;
  }

  onMouseEnter(movieId: number, containerTitle: string): void {
    if (this.hoveredContainer === containerTitle) {
      this.hoveredMovieId = movieId;
    }
  }
  
  onMouseLeave(): void {
    this.hoveredMovieId = null;
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

  refreshHome(): void {
    console.log('Refreshing home data...');
    this.loadData(); // 홈 데이터를 다시 로드
  }
}
