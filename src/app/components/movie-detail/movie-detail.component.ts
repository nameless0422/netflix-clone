import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MovieService } from '../../util/movie/movie.service';

interface Video {
  key: string;
  site: string;
}

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
  standalone: true
})
export class MovieDetailComponent implements OnInit {
  @Input() movie: any;
  @Output() close = new EventEmitter<void>();  // 모달 닫기 이벤트 추가
  movieImage: string = '';
  movieVideos: any[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    if (this.movie) {
      // backdrop_path가 존재하지 않을 경우 poster_path 사용
      const imagePath = this.movie.backdrop_path || this.movie.poster_path;
      if (imagePath) {
        this.movieImage = `https://image.tmdb.org/t/p/original${imagePath}`;
      }
      this.loadMovieVideos(this.movie.id);
      console.log(this.movieImage)
    }
  }
  

  async loadMovieVideos(movieId: number): Promise<void> {
    try {
      const videos = await this.movieService.getMovieVideos(movieId);
      this.movieVideos = videos.filter((video:Video) => video.site === 'YouTube');
    } catch (error) {
      console.error('Error loading movie videos:', error);
    }
  }

  closeModal() {
    this.close.emit();  // 부모 컴포넌트로 닫기 이벤트 전달
  }
}

