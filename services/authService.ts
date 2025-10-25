import type { User } from '../types';

const USER_KEY = 'ia-budget-generator-user';
const SESSION_KEY = 'ia-budget-generator-session';

// Simulates user database
const getUsers = (): Record<string, { passwordHash: string, user: User }> => {
    return JSON.parse(localStorage.getItem(USER_KEY) || '{}');
};

const saveUsers = (users: Record<string, { passwordHash: string, user: User }>) => {
    localStorage.setItem(USER_KEY, JSON.stringify(users));
};

export const authService = {
    signup: async (name: string, whatsapp: string, email: string, password: string): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                const users = getUsers();
                if (users[email]) {
                    return reject(new Error('Este e-mail já está cadastrado.'));
                }
                const newUser: User = { name, whatsapp, email };
                // In a real app, you'd hash the password. Here we just store it.
                users[email] = { passwordHash: password, user: newUser };
                saveUsers(users);
                resolve(newUser);
            }, 500);
        });
    },

    login: async (email: string, password: string): Promise<User> => {
         return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                const users = getUsers();
                const storedUser = users[email];
                if (storedUser && storedUser.passwordHash === password) {
                    localStorage.setItem(SESSION_KEY, JSON.stringify(storedUser.user));
                    resolve(storedUser.user);
                } else {
                    reject(new Error('E-mail ou senha inválidos.'));
                }
            }, 500);
        });
    },

    logout: (): void => {
        localStorage.removeItem(SESSION_KEY);
    },

    getCurrentUser: (): User | null => {
        const userJson = localStorage.getItem(SESSION_KEY);
        if (!userJson) return null;
        try {
            return JSON.parse(userJson);
        } catch (e) {
            return null;
        }
    }
};