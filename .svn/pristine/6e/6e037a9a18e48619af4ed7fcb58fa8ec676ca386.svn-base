import * as request from "../../API/util/httpRequest";

export const postWithBody = async (path, q) => {
  try {
    const res = await request.post(`${path}`, q);
    return res;
  } catch (error) {
    return error;
  }
};
export const postWithParam = async (path, param) => {
  try {
    const res = await request.postWithParam(`${path}?${param}`);
    return res;
  } catch (error) {
    return error;
  }
};
