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
    });

    this.movieService.getReleaseMovies(1).then(result => this.trendingMovieResult = result.results);
    this.movieService.getMoviesByGenre('28',1).then(result => this.actionMovieResult = result.results);
    this.movieService.getMoviesByGenre('12', 1).then(result => this.adventureMovieResult = result.results);
    this.movieService.getMoviesByGenre('16', 1).then(result => this.animationMovieResult = result.results);
    this.movieService.getMoviesByGenre('35', 1).then(result => this.comedyMovieResult = result.results);
    this.movieService.getMoviesByGenre('99', 1).then(result => this.documentaryMovieResult = result.results);
    this.movieService.getMoviesByGenre('878', 1).then(result => this.sciencefictionMovieResult = result.results);
    this.movieService.getMoviesByGenre('53', 1).then(result => this.thrillerMovieResult = result.results);
  }

  movieCategories = [
    { title: 'Trending', result: this.trendingMovieResult },
    { title: 'Action', result: this.actionMovieResult },
    { title: 'Adventure', result: this.adventureMovieResult },
    { title: 'Animation', result: this.animationMovieResult },
    { title: 'Comedy', result: this.comedyMovieResult },
    { title: 'Documentary', result: this.documentaryMovieResult },
    { title: 'Science-Fiction', result: this.sciencefictionMovieResult },
    { title: 'Thriller', result: this.thrillerMovieResult }
  ];

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
