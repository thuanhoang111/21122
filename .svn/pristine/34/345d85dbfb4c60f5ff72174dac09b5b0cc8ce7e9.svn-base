import axiosClient from './AxiosClient'
import { URL_API_PRODUCTINVOICE } from '../constants/API'

const ProductAPI = {
    get: (uni_k_code, no, agriCode, yearLogin) => {
        let URL_GETPRODUCT = URL_API_PRODUCTINVOICE + uni_k_code + "&agriCode=" + agriCode + "&year=" + yearLogin + "&soHD=" + no;
        return axiosClient.get(URL_GETPRODUCT)
    },
}

export default ProductAPI