import * as request from "../../API/util/httpRequest";

export const HandleGet = async (path, q, config) => {
  try {
    const res = await request.get(`${path}/${q}`, config);
    return res
      ? res
      : {
          isError: true,
          errorDescription: "Không có dữ liệu.Vui lòng chọn lại năm",
        };
  } catch (error) {
    return { isError: true, errorDescription: "Đã xảy ra lỗi " };
  }
};
export const HandleGetWithParam = async (path, q, config) => {
  try {
    const res = await request.get(`${path}?${q}`, config);
    return res
      ? res
      : {
          isError: true,
          errorDescription: "Không có dữ liệu.Vui lòng chọn lại năm",
        };
  } catch (error) {
    return { isError: true, errorDescription: "Đã xảy ra lỗi " };
  }
};
