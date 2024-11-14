import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  standalone: true,
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent {
  @Input() movie: any;

  closeModal() {
    // 모달 닫기 로직
    this.movie = null;
  }
}
