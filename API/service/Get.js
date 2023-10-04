import * as request from "../../API/util/httpRequest";

export const get = async (path, q) => {
  try {
    const res = await request.get(`${path}/${q}`);
    return res;
  } catch (error) {
    return error;
  }
};
export const getWithParam = async (path, q) => {
  try {
    const res = await request.get(`${path}?${q}`);
    return res;
  } catch (error) {
    return error;
  }
};
