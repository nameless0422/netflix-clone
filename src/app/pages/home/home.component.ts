import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MovieService } from '../../util/movie/movie.service';  // MovieService 가져오기
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // 영화 데이터 배열 정의
  popularMovies: any[] = [];
  trendingMovieResult: any[] = [];
  actionMovieResult: any[] = [];
  adventureMovieResult: any[] = [];
  animationMovieResult: any[] = [];
  comedyMovieResult: any[] = [];
  documentaryMovieResult: any[] = [];
  sciencefictionMovieResult: any[] = [];
  thrillerMovieResult: any[] = [];
  movieTitle: string = ''; 
  movieDescription: string = ''; 
  movieBackdrop: string = ''; 
  movieVideos: any[] = []; 
  movieCategories : any[] = [];

  @ViewChild('popularRow') popularRow!: ElementRef;
  @ViewChild('releaseRow') releaseRow!: ElementRef;
  @ViewChild('actionRow') actionRow!: ElementRef;
  
  constructor(private movieService: MovieService) {}
 
  ngOnInit(): void {
    this.loadBannerMovie();
    this.loadData();  // 데이터 로드
  }

  async loadBannerMovie() {
    const randomMovie = await this.movieService.getPopularMovies(1);  
    const movieId = randomMovie.results[0].id;  

    this.movieTitle = randomMovie.results[0].original_title;
    this.movieDescription = randomMovie.results[0].overview;
    this.movieBackdrop = randomMovie.results[0].backdrop_path;

    const movieVideos = await this.movieService.getMovieVideos(movieId);
    this.movieVideos = movieVideos;  
  }

  loadData() {
    this.movieService.getPopularMovies(1).then(result => {
      this.popularMovies = result.results;
      console.log('Popular Movies:', this.popularMovies); // 콘솔 로그 추가
    });
  
    this.movieService.getReleaseMovies(1).then(result => {
      this.trendingMovieResult = result.results;
      console.log('Trending Movies:', this.trendingMovieResult); // 콘솔 로그 추가
    });
  
    this.movieService.getMoviesByGenre('28',1).then(result => {
      this.actionMovieResult = result.results;
      console.log('Action Movies:', this.actionMovieResult); // 콘솔 로그 추가
    });
  
    // 각 카테고리에 대해 데이터 로드 로그 추가
    this.movieService.getMoviesByGenre('12', 1).then(result => {
      this.adventureMovieResult = result.results;
      console.log('Adventure Movies:', this.adventureMovieResult);
    });
    this.movieService.getMoviesByGenre('16', 1).then(result => {
      this.animationMovieResult = result.results;
      console.log('Animation Movies:', this.animationMovieResult);
    });
    this.movieService.getMoviesByGenre('35', 1).then(result => {
      this.comedyMovieResult = result.results;
      console.log('Comedy Movies:', this.comedyMovieResult);
    });
    this.movieService.getMoviesByGenre('99', 1).then(result => {
      this.documentaryMovieResult = result.results;
      console.log('Documentary Movies:', this.documentaryMovieResult);
    });
    this.movieService.getMoviesByGenre('878', 1).then(result => {
      this.sciencefictionMovieResult = result.results;
      console.log('Science Fiction Movies:', this.sciencefictionMovieResult);
    });
    this.movieService.getMoviesByGenre('53', 1).then(result => {
      this.thrillerMovieResult = result.results;
      console.log('Thriller Movies:', this.thrillerMovieResult);
    });
  
    // movieCategories 업데이트
    this.movieCategories = [
      { title: 'Trending', result: this.trendingMovieResult },
      { title: 'Action', result: this.actionMovieResult },
      { title: 'Adventure', result: this.adventureMovieResult },
      { title: 'Animation', result: this.animationMovieResult },
      { title: 'Comedy', result: this.comedyMovieResult },
      { title: 'Documentary', result: this.documentaryMovieResult },
      { title: 'Science-Fiction', result: this.sciencefictionMovieResult },
      { title: 'Thriller', result: this.thrillerMovieResult }
    ];
  }
  

  scrollLeft(category: string) {
    const element = document.querySelector(`.${category} .movie-row`);
    if (element) {
      element.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }

  scrollRight(category: string) {
    const element = document.querySelector(`.${category} .movie-row`);
    if (element) {
      element.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }
}
