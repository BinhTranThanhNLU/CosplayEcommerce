export interface UserDTO {
    id: number;
    username: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    fullName: string;
    avatarUrl: string;
    createdAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role?: string;
}

export interface LoginResponse {
    token: string;
    user: UserDTO;
}