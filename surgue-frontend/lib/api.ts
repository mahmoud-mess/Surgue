import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export const getAuthStatus = () => api.get('/auth/status');
export const logout = () => api.get('/auth/logout');

export const startGame = () => api.post('/game/start');
export const submitGuess = (guess: string) => api.post('/game/guess', { guess });

export const getDailyLeaderboard = () => api.get('/leaderboard/daily');
export const getWorldwideLeaderboard = () => api.get('/leaderboard/worldwide');