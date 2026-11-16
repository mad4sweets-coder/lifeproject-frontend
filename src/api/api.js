import axios from 'axios';

// 백엔드 주소 (server.port=80 이라서 포트 생략)
const client = axios.create({
  baseURL: 'http://localhost',
});

// 요청을 보내기 직전에 실행됨
// → 로그인 토큰이 있으면 Authorization 헤더에 자동으로 붙여 줌
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
