export const environment = {
    production: false,
    tmdbApiKey: process.env['TMDB_API_KEY'] || ''  // 환경 변수에서 API 키를 가져옴
  };