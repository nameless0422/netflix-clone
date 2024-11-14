import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MovieService } from '../../util/movie/movie.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MovieDetailComponent } from '../../components/movie-detail/movie-detail.component';

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

  @ViewChild('popularRow') popularRow!: ElementRef;
  @ViewChild('releaseRow') releaseRow!: ElementRef;
  @ViewChild('actionRow') actionRow!: ElementRef;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
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

  openMovieDetail(movieId: number) {
    this.selectedMovieId = movieId;
  }
  
  closeMovieDetail() {
    this.selectedMovieId = null;
  }
}