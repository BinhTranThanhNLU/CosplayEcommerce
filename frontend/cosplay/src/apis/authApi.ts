import axiosClient from "./axiosClient";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../model/AuthModel";

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post("/auth/login", payload);
    return response.data;
};

export const register = async (payload: RegisterRequest): Promise<void> => {
    await axiosClient.post("/auth/register", payload);
};