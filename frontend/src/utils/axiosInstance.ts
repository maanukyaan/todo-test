import axios from 'axios';

const axiosInstance = axios.create({
	// baseURL: 'http://localhost:8080/todo/',
	baseURL: 'http://172.20.10.11:8080/todo/'
});

export default axiosInstance;
