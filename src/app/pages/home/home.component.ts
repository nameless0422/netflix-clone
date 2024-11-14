import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../util/movie/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  popularMovies: any[] = [];
  releaseMovies: any[] = [];
  actionMovies: any[] = [];

  // 각 구역에 대한 ViewChild 참조를 미리 정의
  @ViewChild('popularRow', { static: false }) popularRow!: ElementRef;
  @ViewChild('releaseRow', { static: false }) releaseRow!: ElementRef;
  @ViewChild('actionRow', { static: false }) actionRow!: ElementRef;

  // 좌측/우측 버튼의 활성화 상태
  isActiveLeft: boolean = false;
  isActiveRight: boolean = true;

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

  // 이전 버튼 (왼쪽) 클릭
  handlePrev(section: 'popularRow' | 'releaseRow' | 'actionRow') {
    const rowElement = this.getRowElement(section)?.nativeElement;
    if (rowElement) {
      rowElement.scrollBy({ left: -200, behavior: 'smooth' });
      this.updateButtonState();
    }
  }

  // 다음 버튼 (오른쪽) 클릭
  handleNext(section: 'popularRow' | 'releaseRow' | 'actionRow') {
    const rowElement = this.getRowElement(section)?.nativeElement;
    if (rowElement) {
      rowElement.scrollBy({ left: 200, behavior: 'smooth' });
      this.updateButtonState();
    }
  }

  // 섹션에 대한 rowElement를 동적으로 가져오는 메서드
  private getRowElement(section: 'popularRow' | 'releaseRow' | 'actionRow'): ElementRef | undefined {
    switch (section) {
      case 'popularRow':
        return this.popularRow;
      case 'releaseRow':
        return this.releaseRow;
      case 'actionRow':
        return this.actionRow;
      default:
        return undefined;
    }
  }

  // 버튼 상태 업데이트
  private updateButtonState() {
    // popularRow의 스크롤 상태 확인
    const rowElement = this.popularRow.nativeElement;

    // 좌측 버튼 활성화 조건: 스크롤이 0보다 크면 활성화
    this.isActiveLeft = rowElement.scrollLeft > 0;

    // 우측 버튼 활성화 조건: 스크롤이 끝에 도달했으면 비활성화
    this.isActiveRight = rowElement.scrollLeft < rowElement.scrollWidth - rowElement.clientWidth;
  }
}
