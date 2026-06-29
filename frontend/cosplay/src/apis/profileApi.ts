import axiosClient from "./axiosClient";
import type { UserDTO } from "../model/UserModel";

export interface UpdateProfilePayload {
  fullName: string;
  phone?: string;
  avatarUrl?: string;
}

// GET /api/profile/me — Lấy thông tin profile của user đang đăng nhập
export const getMyProfile = async (): Promise<UserDTO> => {
  const response = await axiosClient.get<UserDTO>("/profile/me");
  return response.data;
};

// PUT /api/profile/me — Cập nhật thông tin profile
export const updateMyProfile = async (
  payload: UpdateProfilePayload
): Promise<UserDTO> => {
  const response = await axiosClient.put<UserDTO>("/profile/me", payload);
  return response.data;
};
