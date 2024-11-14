import { Component, Input, OnInit } from '@angular/core';
import { MovieService } from '../../util/movie/movie.service'; // 경로는 상황에 맞게 수정하세요

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
  standalone: true
})
export class MovieDetailComponent implements OnInit {
  @Input() movie: any;
  movieImage: string = '';  // movieImage 속성 추가
  movieVideos: any[] = [];  // movieVideos 속성 추가

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    if (this.movie) {
      this.movieImage = `https://image.tmdb.org/t/p/original/${this.movie.backdrop_path}`;
      this.loadMovieVideos(this.movie.id);
    }
  }

  async loadMovieVideos(movieId: number): Promise<void> {
    try {
      const videos = await this.movieService.getMovieVideos(movieId);
      this.movieVideos = videos.filter((video: { site: string; }) => video.site === 'YouTube'); // YouTube 비디오만 필터링
    } catch (error) {
      console.error('Error loading movie videos:', error);
    }
  }

  closeModal() {
    this.movie = null;
  }
}

