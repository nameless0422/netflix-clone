import { Injectable } from '@angular/core';
import { getURL4PopularMovies, getURL4ReleaseMovies, getURL4GenreMovies, getURL4SearchMovies, fetchMovies } from './URL';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = environment.apiKey;  // 발급받은 API 키로 변경

  async getPopularMovies(page: number = 1): Promise<any> {
    const url = getURL4PopularMovies(this.apiKey, page);
    return await fetchMovies(url);
  }

  async getReleaseMovies(page: number = 1): Promise<any> {
    const url = getURL4ReleaseMovies(this.apiKey, page);
    return await fetchMovies(url);
  }

  async getActionMovies(page: number = 1): Promise<any> {
    const actionGenreId = '28';  // 액션 장르 ID (TMDb 기준)
    const url = getURL4GenreMovies(this.apiKey, actionGenreId, page);
    return await fetchMovies(url);
  }

  async searchMovies(query: string): Promise<any> {
    const url = getURL4SearchMovies(this.apiKey, query);
    return await fetchMovies(url); // 검색 영화 요청을 URL.ts에서 처리
  }
  
}
