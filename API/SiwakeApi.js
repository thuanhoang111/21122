import axiosClient from "./AxiosClient";
import { URL_API_LISTINVOICE } from "../constants/API";
import { URL_API_ONLYINVOICE } from "../constants/API";

const SiwakeAPI = {
  get: (uni_k_code, agriCode, yearLogin, isMod) => {
    let URL_GETINVOICE =
      URL_API_LISTINVOICE +
      uni_k_code +
      "&agriCode=" +
      agriCode +
      "&year=" +
      yearLogin +
      "&isMod=" +
      isMod;
    return axiosClient.get(URL_GETINVOICE);
  },

  add: (userID, SiwakeMobile, ProductModel) => {
    const jsonInput = {
      userId: userID,
      siwakeMobile: SiwakeMobile,
      productMobile: ProductModel,
    };
    const url = `/SiwakeMB`;
    return axiosClient.post(url, jsonInput);
  },

  delete: (uni_k_code, itemNo, agriCode, yearLogin) => {
    const url = `/SiwakeMB/?uni_k_code=${uni_k_code}&soHD=${itemNo}&LoginYear=${yearLogin}&Angricode=${agriCode}`;
    return axiosClient.post(url);
  },

  getOnly: (uni_k_code, itemNo, agriCode, yearLogin, isMod) => {
    let URL_ONLYINVOICE =
      URL_API_ONLYINVOICE +
      uni_k_code +
      "&agriCode=" +
      agriCode +
      "&year=" +
      yearLogin +
      "&soHD=" +
      itemNo +
      "&isMod=" +
      isMod;
    return axiosClient.get(URL_ONLYINVOICE);
  },

  update: (uni_k_code, userId, itemNo, SiwakeMobile, ProductModel) => {
    try {
      const jsonInput = {
        userId: userId,
        siwakeMobile: SiwakeMobile,
        productMobile: ProductModel,
      };
      const url = `/SiwakeMB/EditSiwake?uni_k_code=${uni_k_code}&no=${itemNo}`;
      return axiosClient.post(url, jsonInput);
    } catch (error) {
      console.log(error);
    }
  },
};

export default SiwakeAPI;
