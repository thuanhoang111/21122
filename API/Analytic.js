import axiosClient from './AxiosClient'

const AnalyticApi = {
  Analytic: (userId, yearLogin, base64Image) => {
    const jsonInput = {
      userId: userId,
      year: yearLogin,
      base64Image: base64Image,
    }
    const url = `/AnalyticImage`
    return axiosClient.post(url, jsonInput)
  },
}

export default AnalyticApi
