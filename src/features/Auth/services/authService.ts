import axiosClient from "../../../api/axiosClient";
import { LoginCredentials } from "./AuthTypes";

/**
 * Logs in the user.
 * @param credentials - The user's name and email.
 * @returns A promise that resolves when the login is successful.
 */
export const login = async (credentials: LoginCredentials): Promise<void> => {
    await axiosClient.post('/auth/login', credentials);
};

/**
 * Logs out the user.
 * @returns A promise that resolves when the logout is successful.
 */
export const logout = async (): Promise<void> => {
    await axiosClient.post('/auth/logout');
};
