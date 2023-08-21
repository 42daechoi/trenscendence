import axios, { AxiosResponse } from "axios";

export const apiRequest = <T,>(
  method: "get" | "post",
  url: string,
  data?: any
): Promise<AxiosResponse<T>> => {
  return axios({
    method,
    url,
    data,
    withCredentials: true,
  })
    .then((response) => response)
    .catch((error) => {
      if (error.response) {
        // 서버가 요청을 받았으나 응답 상태 코드가 실패인 경우
        console.error(error.response.data);
        console.error(error.response.status);
      } else if (error.request) {
        // 요청이 브라우저에 도달하지 않은 경우 (CORS 등의 이유)
        console.error(error.request);
      } else {
        // 기타 다른 오류
        console.error("Error", error.message);
      }
      return error;
    });
};