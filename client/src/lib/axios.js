import axios from 'axios'

const axiosInstance = axios.create({
        //TODO:base url
    baseURL:import.meta.env.MODE === "development" ? "http://localhost:3000" : "/",
    withCredentials:true,
})

export default axiosInstance;