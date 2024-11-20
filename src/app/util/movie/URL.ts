import axios from "axios";

const fetchFeaturedMovie = async (apiKey: string) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`);
        console.log(response.data.results[0]);
        return response.data.results[0];
    } catch (error) {
        console.error('Error fetching featured movie:', error);
    }
}

const getURL4PopularMovies = (apiKey: string, page: number=1) => {
    return `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${page}`;
}

const getURL4ReleaseMovies = (apiKey: string, page: number=2) => {
    return `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=${page}`;
}

const getURL4GenreMovies = (apiKey: string, genre: string, page: number = 1) => {
    return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=ko-KR&page=${page}`;
}

const fetchMovies = async (url: string): Promise<any> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

const getURL4SearchMovies = (apiKey: string, query: string): string => {
    return `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ko-KR&query=${query}&page=1`;
};

// 영화 동영상 URL 생성 (예고편 등)
const getURL4MovieVideos = (apiKey: string, movieId: number) => {
    return `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=ko-KR`;
};

const getMovieVideos = (url: string)  => {
    return axios.get(url);
};

const getURL4DetailsMovies = (apiKey: string, movieId: number): string => {
    return `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR&api_key=${apiKey}`;
};

const getURL4MovieCasts = ( apiKey: string, movieId: number ): string => {
    return `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=ko-KR`;
}

const getURL4Genres = (apiKey: string): string => {
    return `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=ko-KR`;
};

const getURL4Languages = (apiKey: string): string => {
    return `https://api.themoviedb.org/3/configuration/languages?api_key=${apiKey}`;
};

const getURL4MoviesWithFilters = (apiKey: string, genre: string, rating: string, language: string, page: number): string => {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=ko-KR&page=${page}`;
  
    if (genre) {
      url += `&with_genres=${genre}`;
    }
    if (rating) {
      url += `&vote_average.gte=${rating}`;
    }
    if (language) {
      url += `&with_original_language=${language}`;
    }
  
    return url;
  };

export { fetchFeaturedMovie, 
        getURL4PopularMovies, 
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
        fetchMovies };
