import { supabase } from './supabaseClient';

export const userService = {
    checkAccess: async (email: string): Promise<boolean> => {
        console.log('Checking access for:', email);

        // 1. Check if user is in whitelist (Case insensitive)
        const { data: whitelistData, error: whitelistError } = await supabase
            .from('freemium_whitelist')
            .select('email')
            .ilike('email', email.trim())
            .maybeSingle(); // Use maybeSingle to avoid error on no result

        if (whitelistError) {
            console.error('Error checking whitelist:', whitelistError);
        }

        if (whitelistData) {
            console.log('User is whitelisted');
            return true; // User is whitelisted, unlimited access
        }

        // 2. Check budget count for common users
        const { data: profileData, error } = await supabase
            .from('profiles')
            .select('budget_count')
            .eq('email', email.trim()) // Profiles usually match the auth email exactly
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            // If profile doesn't exist, it might be a new user or sync issue.
            return false;
        }

        console.log('User budget count:', profileData?.budget_count);
        return (profileData?.budget_count || 0) < 1;
    },

    incrementUsage: async (email: string): Promise<void> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.rpc('increment_budget_count', { user_id: user.id });

        if (error) {
            // Fallback if RPC doesn't exist
            const { data: profile } = await supabase
                .from('profiles')
                .select('budget_count')
                .eq('id', user.id)
                .single();

            if (profile) {
                await supabase
                    .from('profiles')
                    .update({ budget_count: profile.budget_count + 1 })
                    .eq('id', user.id);
            }
        }
    }
};
