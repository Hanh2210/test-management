import { authApi } from "@/apis";
import { type AxiosResponse } from "axios";
import { type AUTH_USER_TYPE } from "~/types";

export const signUp = async (
  username: string,
  email: string,
  password: string
) => {
  const res = await authApi
    .post("/auth/signup", {
      username,
      email,
      password,
    })
    .catch((err) => {});
  return res;
};

export interface SignInResponse {
  accessToken: string;
  roles: AUTH_USER_TYPE[];
  username: string;
  message: string;
  refreshToken: string;
}

export const signIn = async (
  username: string,
  password: string
): Promise<AxiosResponse<SignInResponse, any>> =>
  authApi.post<SignInResponse>("/auth/signin", {
    username,
    password,
  });
