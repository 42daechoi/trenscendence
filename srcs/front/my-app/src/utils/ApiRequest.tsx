import axios, { AxiosResponse } from "axios";
import { type } from "os";
import { whoami } from "./whoami";

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
  });
};

export function getWhoami<T = any>(): Promise<AxiosResponse<T>> {
  return apiRequest("get", `${serverUrl}/${tagUser}/whoami`);
}

export function getIntraId<T = any>(
  intraId: string
): Promise<AxiosResponse<T>> {
  return apiRequest("get", `${serverUrl}/${tagUser}/intraId/${intraId}`);
}

export function getId<T = any>(Id: string): Promise<AxiosResponse<T>> {
  return apiRequest("get", `${serverUrl}/${tagUser}/${Id}`);
}

export function patchId<T = any>(
  id: number,
  body: { nickname: string }
): Promise<AxiosResponse<T>> {
  return apiRequest("patch", `${serverUrl}/${tagUser}/${String(id)}`, body);
}

export function patchAddFriend<T = any>(id: number): Promise<AxiosResponse<T>> {
  return apiRequest(
    "patch",
    `${serverUrl}/${tagUser}/friends/add/${String(id)}}`
  );
}

export function getFriendList<T = any>(id: number): Promise<AxiosResponse<T>> {
  return apiRequest("get", `${serverUrl}/${tagUser}/friends/list`);
}

export function modifyNickname(name: string) {
  getWhoami()
    .then((res) => {
      patchId(res.data.id, { nickname: name })
        .then((response) => {
          alert("닉네임을 수정 성공!");
        })
        .catch((error) => {
          if (error.response.data.statusCode)
            alert("닉네임을 수정하지 못했습니다!");
        });
    })
    .catch((error) => {
      console.log(error);
    });
}
