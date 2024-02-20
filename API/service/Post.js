import * as request from "../../API/util/httpRequest";

export const handlePostWithBody = async (path, body, header) => {
  try {
    const res = await request.post(`${path}`, body, header);
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
export const HandlePostWithParam = async (path, param, header) => {
  try {
    const res = await request.post(`${path}?${param}`, "", header);
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
