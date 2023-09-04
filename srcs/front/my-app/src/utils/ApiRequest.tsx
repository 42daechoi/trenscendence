import axios, { AxiosResponse } from "axios";
import { type } from "os";
import { whoami } from "./whoami";
import { StringLiteral } from "typescript";

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
  return apiRequest("get", `${serverUrl}/${tagUser}/id/${Id}`);
}
export function getUserByNickname<T = any>(
  nickname: string
): Promise<AxiosResponse<T>> {
  return apiRequest("get", `${serverUrl}/${tagUser}/nickname/${nickname}`);
}

export function patchId<T = any>(
  id: number,
  body: { nickname?: string; profilePicture?: profilePicture }
): Promise<AxiosResponse<T>> {
  return apiRequest("patch", `${serverUrl}/${tagUser}/${String(id)}`, body);
}

export function patchAddFriend<T = any>(id: number): Promise<AxiosResponse<T>> {
  return apiRequest(
    "patch",
    `${serverUrl}/${tagUser}/friends/add/${String(id)}}`
  );
}

export function patchDeleteFriend<T = any>(
  id: number
): Promise<AxiosResponse<T>> {
  return apiRequest(
    "patch",
    `${serverUrl}/${tagUser}/friends/remove/${String(id)}}`
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
          alert("닉네임 수정 성공!");
        })
        .catch((error) => {
          if (error.response.data.statusCode) alert("닉네임 수정 실패");
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

type profilePicture = {
  data: ArrayBuffer;
};

export function modifyAvatar(img: ArrayBuffer) {
  // getWhoami()
  //   .then((res) => {
  //     axios.patch("/some/api/endpoint", {
  //       profilePicture: Array.from(arrayBuffer),
  //     });
  //     const formData = new FormData();
  //     axios.patch("/some/api/endpoint", {
  //       profilePicture: Array.from(arrayBuffer),
  //     });
  //   })
  //   .catch((err) => {});
  // getWhoami()
  //   .then((res) => {
  //     patchId(res.data.id, {
  //       profilePicture: {
  //         data: img,
  //       },
  //     })
  //       .then((response) => {
  //         console.log(response);
  //         alert("아바타 수정 성공");
  //       })
  //       .catch((error) => {
  //         if (error.response.data.statusCode) alert("아바타 수정 실패");
  //       });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
}

export function getAllUsers<T = any>(): Promise<AxiosResponse<T>> {
  return apiRequest("get", `${serverUrl}/${tagUser}/findAll`);
}
