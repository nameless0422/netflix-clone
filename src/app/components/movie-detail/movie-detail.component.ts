import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
  standalone: true
})
export class MovieDetailComponent {
  @Input() movie: any;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.movie = null;
    this.close.emit();  // 부모 컴포넌트에 모달 닫기 이벤트 전송
  }
}

