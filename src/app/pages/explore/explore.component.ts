import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../util/movie/movie.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  searchResults: any[] = [];
  genres: any[] = [];  // 장르 목록
  ratings: number[] = [5, 6, 7, 8, 9, 10];  // 평점
  languages: any[] = [];  // 언어 목록

  selectedGenre: string = '';
  selectedRating: string = '';
  selectedLanguage: string = '';

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadGenres();
    this.loadLanguages();
  }

  loadGenres(): void {
    this.movieService.getGenres().then((genres) => {
      this.genres = genres;
    });
  }

  loadLanguages(): void {
    this.movieService.getLanguages().then((languages) => {
      this.languages = languages;
    });
  }

  applyFilters(): void {
    const genre = this.selectedGenre;
    const rating = this.selectedRating;
    const language = this.selectedLanguage;
  
    this.movieService.getMoviesByFilters(genre, rating, language).then((movies) => {
      this.searchResults = movies;
    });
  }

  resetFilters(): void {
    this.selectedGenre = '';
    this.selectedRating = '';
    this.selectedLanguage = '';
    this.applyFilters();
  }
}
