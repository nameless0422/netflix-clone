import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MovieService } from '../../util/movie/movie.service';

interface Genre {
  id: number;
  name: string;
}

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
  standalone: true
})
export class MovieDetailComponent implements OnInit, OnChanges {
  @Input() movieId!: number;
  @Output() close = new EventEmitter<void>();  // 모달 닫기 이벤트 추가
  movieDetails: any = null;
  movieImage: string = '';
  movieGenres: Genre[] = [];
  movieVideos: any[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    if (this.movieId) {
      this.loadMovieDetails(this.movieId);
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
      this.movieImage = `https://image.tmdb.org/t/p/original${this.movieDetails.backdrop_path || this.movieDetails.poster_path}`;
      this.movieGenres = this.movieDetails.genres || []; // 장르 데이터 저장
      this.loadMovieVideos(movieId);
    } catch (error) {
      console.error('Error loading movie details:', error);
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
