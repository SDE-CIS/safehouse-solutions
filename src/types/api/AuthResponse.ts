export interface AuthResponse {
    message: string;
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        username: string;
    }
}
