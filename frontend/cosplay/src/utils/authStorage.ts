import type { UserDTO } from "../model/UserModel";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const AUTH_EVENT = "authchange";

export type StoredAuthSession = {
  token: string | null;
  user: UserDTO | null;
};

const parseUser = (value: string | null): UserDTO | null => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as UserDTO;
  } catch {
    return null;
  }
};

export const getStoredAuthSession = (): StoredAuthSession => ({
  token: localStorage.getItem(TOKEN_KEY),
  user: parseUser(localStorage.getItem(USER_KEY)),
});

export const getDisplayName = (user: UserDTO | null): string => {
  if (!user) {
    return "Khách";
  }

  return user.fullName?.trim() || user.username?.trim() || user.email?.trim() || "Khách";
};

export const getUserInitials = (user: UserDTO | null): string => {
  const displayName = getDisplayName(user);

  if (displayName === "Khách") {
    return "U";
  }

  return displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export const saveAuthSession = (session: { token: string; user: UserDTO }) => {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const subscribeToAuthSession = (listener: () => void) => {
  window.addEventListener(AUTH_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(AUTH_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
};