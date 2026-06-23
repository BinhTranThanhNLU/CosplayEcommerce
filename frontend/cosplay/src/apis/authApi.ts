import type { ForgotPasswordRequest } from "../requestmodel/ForgotPasswordRequest";
import type { GoogleLoginRequest } from "../requestmodel/GoogleLoginRequest";
import type { LoginRequest } from "../requestmodel/LoginRequest";
import type { RegisterRequest } from "../requestmodel/RegisterRequest";
import type { ResetPasswordRequest } from "../requestmodel/ResetPasswordRequest";
import type { LoginResponse } from "../responsemodel/LoginResponse";
import axiosClient from "./axiosClient";

export const loginWithGoogleToken = async (data: GoogleLoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>("/auth/google", data);
    return response.data;
};

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<string> => {
    const response = await axiosClient.post<string>("/auth/forgot-password", data);
    return response.data;
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<string> => {
    const response = await axiosClient.post<string>("/auth/reset-password", data);
    return response.data;
};

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post("/auth/login", payload);
    return response.data;
};

export const register = async (payload: RegisterRequest): Promise<void> => {
    await axiosClient.post("/auth/register", payload);
};

