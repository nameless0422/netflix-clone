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


export { fetchFeaturedMovie, getURL4PopularMovies, getURL4ReleaseMovies, getURL4GenreMovies, getURL4SearchMovies, getURL4MovieVideos, getMovieVideos, fetchMovies };
