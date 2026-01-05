import { jwtVerify } from 'jose';


export type UserData = {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
  iat: number;
  exp: number;
};

class AuthService {
  async getUserData(access_token?: string): Promise<UserData | null> {
    const token = localStorage.getItem('authToken') || access_token;
    if (token) {
      try {
        const secret = new TextEncoder().encode(import.meta.env.VITE_SECRET_KEY);
        const { payload } = await jwtVerify(token, secret);

        const exp = payload.exp;
        if (exp && Date.now() < exp * 1000) {
          return payload as UserData;
        }
      } catch {
        return null;
      }
      return null;
    }
    return null;
  }
}

export const authService = new AuthService();