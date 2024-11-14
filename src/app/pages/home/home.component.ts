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
  // 영화 카테고리 데이터
  bannerResult: any = [];
  trendingMovieResult: any = [];
  actionMovieResult: any = [];
  adventureMovieResult: any = [];
  animationMovieResult: any = [];
  comedyMovieResult: any = [];
  documentaryMovieResult: any = [];
  sciencefictionMovieResult: any = [];
  thrillerMovieResult: any = [];

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

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadData();  // 초기 데이터 로드
  }

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
  // 데이터 로드 함수
  loadData() {
    // 배너 데이터
    this.movieService.getPopularMovies(1).then(result => {
      this.bannerResult = result.results;
    });

    // 트렌딩 영화 데이터
    this.movieService.getReleaseMovies(1).then(result => {
      this.trendingMovieResult = result.results;
    });

    // 액션 영화 데이터
    this.movieService.getMoviesByGenre('28',1).then(result => {
      this.actionMovieResult = result.results;
    });

    // 어드벤처 영화 데이터
    this.movieService.getMoviesByGenre('12', 1).then(result => {  // 장르 ID '12'는 어드벤처
      this.adventureMovieResult = result.results;
    });

    // 애니메이션 영화 데이터
    this.movieService.getMoviesByGenre('16', 1).then(result => {  // 장르 ID '16'은 애니메이션
      this.animationMovieResult = result.results;
    });

    // 코미디 영화 데이터
    this.movieService.getMoviesByGenre('35', 1).then(result => {  // 장르 ID '35'는 코미디
      this.comedyMovieResult = result.results;
    });

    // 다큐멘터리 영화 데이터
    this.movieService.getMoviesByGenre('99', 1).then(result => {  // 장르 ID '99'는 다큐멘터리
      this.documentaryMovieResult = result.results;
    });

    // 사이언스 픽션 영화 데이터
    this.movieService.getMoviesByGenre('878', 1).then(result => {  // 장르 ID '878'은 사이언스 픽션
      this.sciencefictionMovieResult = result.results;
    });

    // 스릴러 영화 데이터
    this.movieService.getMoviesByGenre('53', 1).then(result => {  // 장르 ID '53'은 스릴러
      this.thrillerMovieResult = result.results;
    });
  }
}
