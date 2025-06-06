export const useTransactions = () => {
    const supabase = useSupabaseClient();

    const getTransactions = async () => {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        return data;
    };

    const addTransaction = async (transactionData) => {
        const { data, error } = await supabase
            .from('transactions')
            .insert([transactionData])
            .select();

        if (error) throw error;
        return data;
    };

    return {
        getTransactions,
        addTransaction
    };
};

export const useUserBalance = () => {
    const supabase = useSupabaseClient();

    const getBalance = async (userId) => {
        const { data, error } = await supabase
            .from('user_balance')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data;
    };

    return {
        getBalance
    };
};