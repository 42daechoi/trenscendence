import axios, { AxiosResponse } from "axios";
import { type } from "os";
import { whoami } from "./whoami";
import { StringLiteral } from "typescript";

// const serverUrl: string = "http://localhost:3001";
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
  body: {
    nickname?: string;
    profilePicture?: profilePicture;
    currentAvatarData?: boolean;
  }
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

export function modifyNickname(
  name: string,
  alertFlag: boolean
): Promise<AxiosResponse<any>> {
  return new Promise((resolve, reject) => {
    getWhoami()
      .then((res) => {
        return patchId(res.data.id, { nickname: name });
      })
      .then((response) => {
        if (alertFlag === true) alert("닉네임 수정 성공!");
        resolve(response);
      })
      .catch((error) => {
        if (error.response?.data?.statusCode) alert("닉네임 수정 실패");
        reject(error);
      });
  });
}

type profilePicture = {
  data: ArrayBuffer;
};

export function modifyAvatar(img: File): Promise<AxiosResponse<any>> {
  return new Promise((resolve, reject) => {
    if (!img) reject(null);
    getWhoami()
      .then((res) => {
        const reader = new FileReader();
        reader.onload = function (event) {
          const result = event.target?.result;
          if (result) {
            const arrayBuffer = new Uint8Array(result as ArrayBuffer);
            axios
              .patch(`${serverUrl}/users/${res.data.id}`, {
                headers: {
                  "Content-Type": "application/json",
                },
                profilePicture: Array.from(arrayBuffer),
              })
              .then((result) => {
                resolve(result);
              })
              .catch((err) => {
                reject(err);
              });
          }
        };
        reader.readAsArrayBuffer(img);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function modifyFirstCreateFlag() {
  getWhoami()
    .then((res) => {
      patchId(res.data.id, { currentAvatarData: true })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

export function getGameLog<T = any>(id: number): Promise<AxiosResponse<T>> {
  return apiRequest("get", `${serverUrl}/game/gameStats/id/${String(id)}`);
}

export function getLeaderBoard<T = any>(): Promise<AxiosResponse<T>> {
  return apiRequest("get", `${serverUrl}/game/gameStats/leaderBoard`);
}

export function getAllUsers<T = any>(): Promise<AxiosResponse<T>> {
  return apiRequest("get", `${serverUrl}/${tagUser}/findAll`);
}
