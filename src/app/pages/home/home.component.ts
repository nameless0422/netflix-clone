import { Component, OnInit } from '@angular/core';
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
  popularMovies: any[] = [];  // 여기에 인기 영화를 담을 배열 정의
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

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadBannerMovie();
    this.loadData();  // 데이터 로드
  }
  async loadBannerMovie() {
    // 인기 영화 중 하나를 가져옵니다.
    const randomMovie = await this.movieService.getPopularMovies(1);  
    const movieId = randomMovie.results[0].id;  // 영화 ID 가져오기

    this.movieTitle = randomMovie.results[0].original_title;
    this.movieDescription = randomMovie.results[0].overview;
    this.movieBackdrop = randomMovie.results[0].backdrop_path;

    // 해당 영화의 예고편 동영상 정보를 가져옵니다.
    const movieVideos = await this.movieService.getMovieVideos(movieId);
    this.movieVideos = movieVideos;  // 동영상 정보 저장
  }
  // 데이터 로드 함수
  loadData() {
    // 인기 영화 데이터 로드
    this.movieService.getPopularMovies(1).then(result => {
      this.popularMovies = result.results;  // 인기 영화 데이터 할당
    });

    // 다른 카테고리 영화 데이터 로드
    this.movieService.getReleaseMovies(1).then(result => this.trendingMovieResult = result.results);
    this.movieService.getMoviesByGenre('28',1).then(result => this.actionMovieResult = result.results);
    this.movieService.getMoviesByGenre('12', 1).then(result => this.adventureMovieResult = result.results);
    this.movieService.getMoviesByGenre('16', 1).then(result => this.animationMovieResult = result.results);
    this.movieService.getMoviesByGenre('35', 1).then(result => this.comedyMovieResult = result.results);
    this.movieService.getMoviesByGenre('99', 1).then(result => this.documentaryMovieResult = result.results);
    this.movieService.getMoviesByGenre('878', 1).then(result => this.sciencefictionMovieResult = result.results);
    this.movieService.getMoviesByGenre('53', 1).then(result => this.thrillerMovieResult = result.results);
  }

  // 동적 영화 카테고리 배열
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
  getRowElement: any;

   // 좌측 버튼 클릭 시 스크롤
   scrollLeft(section: 'popularRow' | 'releaseRow' | 'actionRow') {
    const rowElement = this.getRowElement(section)?.nativeElement;
    if (rowElement) {
      rowElement.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }

  // 우측 버튼 클릭 시 스크롤
  scrollRight(section: 'popularRow' | 'releaseRow' | 'actionRow') {
    const rowElement = this.getRowElement(section)?.nativeElement;
    if (rowElement) {
      rowElement.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }
}
