import axios from 'axios'
import queryString from 'query-string'
import { URL_API_IP } from '../constants/API'

const axiosClient = axios.create({
  baseURL: URL_API_IP,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
})

axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ...
  return config
})

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data
    }
    return response
  },
  (error) => {
    // Handle errors
    throw error
  },
)

export default axiosClient
