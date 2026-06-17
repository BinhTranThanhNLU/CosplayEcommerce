import axiosClient from "./axiosClient";
import type { UserDTO } from "../model/AuthModel";

// ─── Response types ───────────────────────────────────────────────────────────

export interface UserPageResponse {
    users: UserDTO[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export interface UserStatsResponse {
    totalUsers: number;
    bannedUsers: number;
    activeUsers: number;
    customerCount: number;
    sellerCount: number;
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface UserQueryParams {
    keyword?: string;
    role?: string;
    status?: string;
    page?: number;
    size?: number;
}

export interface UpdateUserPayload {
    fullName: string;
    phone?: string;
    avatarUrl?: string;
}

export interface CreateUserPayload {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const getUsers = async (params: UserQueryParams = {}): Promise<UserPageResponse> => {
    const response = await axiosClient.get("/admin/users", { params });
    return response.data;
};

export const createUser = async (payload: CreateUserPayload): Promise<UserDTO> => {
    const response = await axiosClient.post("/admin/users", payload);
    return response.data;
};

export const getUserStats = async (): Promise<UserStatsResponse> => {
    const response = await axiosClient.get("/admin/users/stats");
    return response.data;
};

export const getUserById = async (id: number): Promise<UserDTO> => {
    const response = await axiosClient.get(`/admin/users/${id}`);
    return response.data;
};

export const updateUser = async (id: number, payload: UpdateUserPayload): Promise<UserDTO> => {
    const response = await axiosClient.put(`/admin/users/${id}`, payload);
    return response.data;
};

export const changeUserStatus = async (id: number, status: string): Promise<UserDTO> => {
    const response = await axiosClient.patch(`/admin/users/${id}/status`, { status });
    return response.data;
};

export const changeUserRole = async (id: number, role: string): Promise<UserDTO> => {
    const response = await axiosClient.patch(`/admin/users/${id}/role`, { role });
    return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await axiosClient.delete(`/admin/users/${id}`);
};
