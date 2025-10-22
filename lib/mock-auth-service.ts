import { User } from "../types/user";

import { logger } from "@/lib/logger";
export interface AuthResponse {
  user: User | null;
  error: string | null;
  status: number;
}

export const mockAuthService = {
  users: new Map<string, User>([
    ['test@quotefast.nl', {
      id: 'demo_user_1',
      email: 'test@quotefast.nl',
      name: 'Demo Gebruiker',
      company: 'QuoteFast Demo'
    }]
  ]),
  currentUser: null as User | null,

  register: async (email: string, password: string, name: string, company?: string): Promise<AuthResponse> => {
    logger.info("Mock: Registering user", "AuthService", { email, name, company });
    
    if (mockAuthService.users.has(email)) {
      return {
        user: null,
        error: "Dit emailadres is al geregistreerd. Probeer in te loggen.",
        status: 409
      };
    }

    const user: User = {
      id: `mock_${Date.now()}`,
      email,
      name,
      company: company || "Mock Company"
    };

    mockAuthService.users.set(email, user);
    mockAuthService.currentUser = user;

    logger.info("Mock: User registered successfully", "AuthService", { user });
    
    return {
      user,
      error: null,
      status: 200
    };
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    logger.info("Mock: Logging in user", "AuthService", { email });
    
    const user = mockAuthService.users.get(email);
    
    if (!user) {
      return {
        user: null,
        error: "Ongeldige inloggegevens. Controleer je email en wachtwoord.",
        status: 401
      };
    }

    mockAuthService.currentUser = user;

    logger.info("Mock: User logged in successfully", "AuthService", { user });
    
    return {
      user,
      error: null,
      status: 200
    };
  },

  logout: async (): Promise<{ error: string | null }> => {
    logger.info("Mock: Logging out user", "AuthService");
    mockAuthService.currentUser = null;
    return { error: null };
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    logger.info("Mock: Getting current user", "AuthService");
    
    if (mockAuthService.currentUser) {
      return {
        user: mockAuthService.currentUser,
        error: null,
        status: 200
      };
    }

    return {
      user: null,
      error: "Geen gebruiker ingelogd",
      status: 401
    };
  },

  updateUser: async (userId: string, userData: Partial<User>): Promise<AuthResponse> => {
    logger.info("Mock: Updating user", "AuthService", { userId, userData });
    
    if (!mockAuthService.currentUser || mockAuthService.currentUser.id !== userId) {
      return {
        user: null,
        error: "Gebruiker niet gevonden",
        status: 404
      };
    }

    const updatedUser = { ...mockAuthService.currentUser, ...userData };
    mockAuthService.currentUser = updatedUser;
    mockAuthService.users.set(updatedUser.email, updatedUser);

    logger.info("Mock: User updated successfully", "AuthService", { user: updatedUser });
    
    return {
      user: updatedUser,
      error: null,
      status: 200
    };
  },

  resetPassword: async (email: string): Promise<{ error: string | null }> => {
    logger.info("Mock: Resetting password for", "AuthService", { email });
    
    if (!mockAuthService.users.has(email)) {
      return { error: "Emailadres niet gevonden" };
    }

    logger.info("Mock: Password reset email sent (simulated)", "AuthService");
    return { error: null };
  },

  updatePassword: async (password: string): Promise<{ error: string | null }> => {
    logger.info("Mock: Updating password", "AuthService");
    
    if (!mockAuthService.currentUser) {
      return { error: "Geen gebruiker ingelogd" };
    }

    logger.info("Mock: Password updated successfully (simulated)", "AuthService");
    return { error: null };
  }
};
