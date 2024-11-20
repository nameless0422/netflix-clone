import { Injectable } from '@angular/core';
import { getURL4PopularMovies, 
          getURL4ReleaseMovies, 
          getURL4GenreMovies, 
          getURL4SearchMovies, 
          getURL4MovieVideos, 
          getMovieVideos, 
          getURL4DetailsMovies, 
          getURL4MovieCasts,
          getURL4Genres,
          getURL4Languages,
          getURL4MoviesWithFilters,
          fetchMovies } from './URL';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  getTrendingMovies(arg0: number) {
    throw new Error('Method not implemented.');
  }
  private apiKey = environment.apiKey;  // 발급받은 API 키로 변경

  // 인기 영화 가져오기
  async getPopularMovies(page: number = 1): Promise<any> {
    const url = getURL4PopularMovies(this.apiKey, page);
    return await fetchMovies(url);
  }

  // 최신 개봉 영화 가져오기
  async getReleaseMovies(page: number = 1): Promise<any> {
    const url = getURL4ReleaseMovies(this.apiKey, page);
    return await fetchMovies(url);
  }

  // 영화 검색 기능
  async searchMovies(query: string): Promise<any> {
    const url = getURL4SearchMovies(this.apiKey, query);
    return await fetchMovies(url); // 검색 영화 요청을 URL.ts에서 처리
  }

  // 추가적인 장르 기반 영화 가져오기
  async getMoviesByGenre(genreId: string, page: number = 1): Promise<any> {
    const url = getURL4GenreMovies(this.apiKey, genreId, page);
    return await fetchMovies(url);
  }

  // 배너 영화 데이터 가져오기
  async getRandomMovies(): Promise<any> {
    try {
      const popularMovies = await this.getPopularMovies(1);  // 첫 페이지의 인기 영화 가져오기
  
      // popularMovies나 results 배열이 유효한지 확인
      const movies = popularMovies?.results;
      
      if (movies && movies.length > 0) {
        const randomIndex = Math.floor(Math.random() * movies.length);  // 무작위 인덱스 선택
        return movies[randomIndex];  // 무작위 영화 반환
      } else {
        throw new Error('No movies found');
      }
    } catch (error) {
      console.error('Error fetching random movie:', error);
      return null;  // 에러 발생 시 null 반환
    }
  }

  // 영화의 동영상 정보 가져오기
  async getMovieVideos(movieId: number): Promise<any> {
    try {
      // URL을 생성하여 동영상 정보를 가져옴
      const response = getMovieVideos(getURL4MovieVideos(this.apiKey, movieId))
      return (await response).data.results;  // 동영상 정보 배열 리턴
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      return [];  // 에러 발생 시 빈 배열 리턴
    }
  }
  async getMovieDetail(movieId: number): Promise<any> {
    try {
      const url = getURL4DetailsMovies(this.apiKey, movieId);
      return await fetchMovies(url); // 여기서 fetchMovies는 올바른 URL을 받음
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  }
  async getMovieCast(movieId: number): Promise<any> {
    try {
      const url = getURL4MovieCasts(this.apiKey, movieId)
      const response = await fetch(url);
      const data = await response.json();
      return data; // 출연진 데이터를 반환
    } catch (error) {
      console.error('Error fetching movie cast:', error);
      return { cast: [] }; // 에러 발생 시 빈 출연진 데이터 반환
    }
  }

  // 장르 목록 가져오기
  async getGenres(): Promise<any[]> {
    try {
      const url = getURL4Genres(this.apiKey);
      const response = await fetchMovies(url);
      return response.genres || []; // 장르 배열 반환
    } catch (error) {
      console.error('Error fetching genres:', error);
      return [];
    }
  }

  // 언어 목록 가져오기
  async getLanguages(): Promise<any[]> {
    try {
      const url = getURL4Languages(this.apiKey);
      const response = await fetchMovies(url);
      return response || []; // 언어 배열 반환
    } catch (error) {
      console.error('Error fetching languages:', error);
      return [];
    }
  }
  // 필터로 가져오기
  async getMoviesByFilters(genre: string, rating: string, language: string): Promise<any[]> {
    try {
      const url = getURL4MoviesWithFilters(this.apiKey, genre, rating, language);
      const response = await fetchMovies(url);
      return response.results || []; // 영화 목록 반환
    } catch (error) {
      console.error('Error fetching movies by filters:', error);
      return [];
    }
  }

}

