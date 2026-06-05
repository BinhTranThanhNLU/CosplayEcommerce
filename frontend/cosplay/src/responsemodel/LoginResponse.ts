import type { UserDTO } from "../model/UserModel";

export interface LoginResponse {
    token: string;
    user: UserDTO;
}