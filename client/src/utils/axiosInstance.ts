import axios, { AxiosInstance } from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Укажите базовый URL вашего сервера
  withCredentials: true // Чтобы Axios отправлял куки
})

export default axiosInstance
