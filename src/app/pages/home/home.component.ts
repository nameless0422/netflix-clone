import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../util/movie/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule], // CommonModule 추가
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  popularMovies: any[] = [];
  releaseMovies: any[] = [];
  actionMovies: any[] = [];

  @ViewChild('popularRow', { static: false }) popularRow!: ElementRef;
  @ViewChild('releaseRow', { static: false }) releaseRow!: ElementRef;
  @ViewChild('actionRow', { static: false }) actionRow!: ElementRef;

  constructor(private movieService: MovieService) {}

  async ngOnInit(): Promise<void> {
    try {
      const popularData = await this.movieService.getPopularMovies();
      this.popularMovies = popularData.results;

      const releaseData = await this.movieService.getReleaseMovies();
      this.releaseMovies = releaseData.results;

      const actionData = await this.movieService.getActionMovies();
      this.actionMovies = actionData.results;
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  }

  // 스크롤 메서드 수정 (타입을 명시적으로 정의)
  scrollLeft(section: 'popularRow' | 'releaseRow' | 'actionRow') {
    const rowElement = this[section]?.nativeElement;  // 동적 키 접근
    if (rowElement) {
      rowElement.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }

  scrollRight(section: 'popularRow' | 'releaseRow' | 'actionRow') {
    const rowElement = this[section]?.nativeElement;  // 동적 키 접근
    if (rowElement) {
      rowElement.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }
}
