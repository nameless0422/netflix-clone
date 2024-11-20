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
    let filteredResults = [...this.searchResults];
    if (this.selectedGenre) {
      filteredResults = filteredResults.filter((movie) => movie.genre_ids.includes(Number(this.selectedGenre)));
    }
    if (this.selectedRating) {
      filteredResults = filteredResults.filter((movie) => Math.floor(movie.vote_average) >= Number(this.selectedRating));
    }
    if (this.selectedLanguage) {
      filteredResults = filteredResults.filter((movie) => movie.original_language === this.selectedLanguage);
    }
    this.searchResults = filteredResults;
  }

  resetFilters(): void {
    this.selectedGenre = '';
    this.selectedRating = '';
    this.selectedLanguage = '';
    this.applyFilters();
  }
}
