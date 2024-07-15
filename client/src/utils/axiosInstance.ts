import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true // Включаем куки в запросы
})

export default axiosInstance
