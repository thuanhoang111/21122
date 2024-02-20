import axios from "axios";

// initialization request by axios with baseUrl
const request = axios.create({
  baseURL: "http://waca.vn:82/api/",
  // baseURL: "http://192.168.90.84:1375/api/",
  // baseURL: "http://192.168.90.88:8090/api/",
});
//
/**
 *  initialization function get with path
 * @param {String} path :url of request
 * @returns response
 */
export const get = async (path, config) => {
  console.log(path);
  const response = await request.get(path, config);
  return response.data;
};
// /**
//  * initialization function post with path and body
//  * @param { String } path:url of request e.g : /api/User?userID=???&password=???
//  * @param { Object } body:infor of request e.g :{name:"ThuanHoang",age:"21"}
//  * @returns response
//  */
/**
 *
 * @param {String} path:url of request e.g : /api/User
 * @param {Object} body:infor of request e.g :{name:"ThuanHoang",age:"21"}:
 * @param {Object} header:header of request contains configuration information for request,e.g:{ Content-Type:application/xml; charset=utf-8,
}
 * @returns response
 */
export const post = async (path, body, header) => {
  const response = await request.post(path, body, header);
  return response.data;
};
export default request;
