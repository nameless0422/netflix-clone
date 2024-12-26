import * as dotenv from 'dotenv';

dotenv.config();

export const environment = {
    production: true,
    apiKey: process.env.TMDB_API_KEY || '',
    kakaoApiKey: process.env.KAKAO_API_KEY || '',
};