import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001', // Your NestJS backend URL
});

export default API;
