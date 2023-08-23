import axios, { AxiosResponse } from "axios";

const serverUrl: string = "http://localhost:3001";
const tagUser: string = "users";

export const apiRequest = <T = any,>(
  method: "get" | "post" | "patch",
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

export function getWhoami<T = any>(): Promise<AxiosResponse<T>> {
  return apiRequest("get", `${serverUrl}/${tagUser}/whoami`).then(
    (response) => response
  );
}

export function getIntraId<T = any>(
  intraId: string
): Promise<AxiosResponse<T>> {
  return apiRequest("get", `${serverUrl}/${tagUser}/intraId/${intraId}`).then(
    (response) => response
  );
}

export function getId<T = any>(Id: string): Promise<AxiosResponse<T>> {
  return apiRequest("get", `${serverUrl}/${tagUser}/${Id}`).then(
    (response) => response
  );
}

export function patchId<T = any>(Id: string): Promise<AxiosResponse<T>> {
  return apiRequest("patch", `${serverUrl}/${tagUser}/${Id}`).then(
    (response) => response
  );
}
