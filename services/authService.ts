import { supabase } from './supabaseClient';
import type { User } from '../types';

export const authService = {
    signup: async (name: string, whatsapp: string, email: string, password: string): Promise<User> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    whatsapp,
                },
            },
        });

        if (error) {
            throw new Error(error.message);
        }

        if (!data.user) {
            throw new Error('Erro ao criar usuário.');
        }

        return {
            name: data.user.user_metadata.name,
            whatsapp: data.user.user_metadata.whatsapp,
            email: data.user.email || '',
        };
    },

    login: async (email: string, password: string): Promise<User> => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw new Error(error.message);
        }

        if (!data.user) {
            throw new Error('Erro ao fazer login.');
        }

        return {
            name: data.user.user_metadata.name,
            whatsapp: data.user.user_metadata.whatsapp,
            email: data.user.email || '',
        };
    },

    logout: async (): Promise<void> => {
        await supabase.auth.signOut();
    },

    getCurrentUser: async (): Promise<User | null> => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return null;

        return {
            name: session.user.user_metadata.name,
            whatsapp: session.user.user_metadata.whatsapp,
            email: session.user.email || '',
        };
    }
};