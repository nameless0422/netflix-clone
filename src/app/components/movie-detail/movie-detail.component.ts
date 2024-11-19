import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MovieService } from '../../util/movie/movie.service';
import { CommonModule } from '@angular/common'; // CommonModule 추가

interface Genre {
  id: number;
  name: string;
}

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class MovieDetailComponent implements OnInit, OnChanges {
  @Input() movieId!: number;
  @Output() close = new EventEmitter<void>();  // 모달 닫기 이벤트 추가
  movieDetails: any = null;
  movieImage: string = '';
  movieGenres: Genre[] = [];
  movieVideos: any[] = [];
  movieCast: any[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    if (this.movieId) {
      this.loadMovieDetails(this.movieId);
      this.loadMovieCast(this.movieId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movieId'] && changes['movieId'].currentValue) {
      this.loadMovieDetails(changes['movieId'].currentValue);
    }
  }

  async loadMovieDetails(movieId: number): Promise<void> {
    try {
      this.movieDetails = await this.movieService.getMovieDetail(movieId);
      console.log('Movie details:', this.movieDetails); // API 응답 데이터 확인
      if (this.movieDetails && (this.movieDetails.backdrop_path || this.movieDetails.poster_path)) {
        this.movieImage = `https://image.tmdb.org/t/p/original${this.movieDetails.backdrop_path || this.movieDetails.poster_path}`;
      } else {
        console.warn('No image available for this movie');
      }
      this.movieGenres = this.movieDetails.genres || []; // 장르 데이터 저장
      this.loadMovieVideos(movieId);
    } catch (error) {
      console.error('Error loading movie details:', error);
      this.movieDetails = null; // 오류 발생 시 초기화
    }
  }

  async loadMovieCast(movieId: number): Promise<void> {
    try {
      const castData = await this.movieService.getMovieCast(movieId);
      this.movieCast = castData.cast.slice(0, 6); // 주요 출연진 6명만 표시
    } catch (error) {
      console.error('Error loading movie cast:', error);
    }
  }

  async loadMovieVideos(movieId: number): Promise<void> {
    try {
      const videos = await this.movieService.getMovieVideos(movieId);
      this.movieVideos = videos.filter((video: any) => video.site === 'YouTube');
    } catch (error) {
      console.error('Error loading movie videos:', error);
    }
  }

  closeModal() {
    this.close.emit();  // 부모 컴포넌트로 닫기 이벤트 전달
  }
}