import { Component } from '@angular/core';
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
  releaseMovies: any[] = [];  // 변수 이름도 releaseMovies로 수정
  actionMovies: any[] = [];

  constructor(private movieService: MovieService) {}

  async ngOnInit(): Promise<void> {
    try {
      const popularData = await this.movieService.getPopularMovies();
      this.popularMovies = popularData.results;

      const releaseData = await this.movieService.getReleaseMovies(); // 메서드 이름 수정
      this.releaseMovies = releaseData.results;

      const actionData = await this.movieService.getActionMovies();
      this.actionMovies = actionData.results;
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  }
}
