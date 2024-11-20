import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../util/movie/movie.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class NewComponent implements OnInit {
  movies: any[] = [];
  page: number = 1;
  isGridView: boolean = true;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadReleaseMovies(); // 초기 데이터 로드
  }

  async loadReleaseMovies(): Promise<void> {
    try {
      const response = await this.movieService.getReleaseMovies(this.page);
      if (response && response.results) {
        this.movies = [...this.movies, ...response.results]; // 기존 데이터에 새 데이터 추가
      } else {
        console.error('No results found');
      }
    } catch (error) {
      console.error('Error loading release movies:', error);
    }
  }
  

  // 무한스크롤
  @HostListener('window:scroll', [])
  onScroll(): void {
    if (
      window.innerHeight + window.scrollY >=
      document.body.scrollHeight - 50
    ) {
      this.page++;
      this.loadReleaseMovies();
    }
  }

  // 뷰 전환
  toggleView(): void {
    this.isGridView = !this.isGridView;
  }
}
