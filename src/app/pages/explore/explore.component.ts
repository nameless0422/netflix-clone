import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../util/movie/movie.service';  // TMDB API를 호출할 서비스
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
  searchQuery: string = '';  // 사용자 입력
  searchResults: any[] = [];  // 검색 결과 저장

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.movieService.searchMovies(this.searchQuery).then(results => {
        this.searchResults = results;
      });
    }
  }
}
