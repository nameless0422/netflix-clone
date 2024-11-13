import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../util/movie/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  popularMovies: any[] = [];
  releaseMovies: any[] = [];
  actionMovies: any[] = [];

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
}
