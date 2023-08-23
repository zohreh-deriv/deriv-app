import { useMemo } from 'react';
import useAccountsList from './useAccountsList';

/** A custom hook that gets the list of all wallet accounts for the current user. */
const useWalletAccountsList = () => {
    const { data: account_list_data, ...rest } = useAccountsList();

    // Filter out non-wallet accounts.
    const filtered_accounts = useMemo(
        () => account_list_data?.filter(account => account.is_wallet),
        [account_list_data]
    );

    // Add additional information to each wallet account.
    const modified_accounts = useMemo(() => {
        return filtered_accounts?.map(wallet => {
            const wallet_currency_type = wallet.is_virtual ? 'Demo' : wallet.currency || '';

            return {
                ...wallet,
                /** Returns the wallet's currency type. ex: `Demo`, `USD`, etc. */
                wallet_currency_type,
                /** Landing company shortcode the account belongs to. */
                landing_company_name: wallet.landing_company_name?.replace('maltainvest', 'malta'),
                /** Indicating whether the wallet is a maltainvest wallet. */
                is_malta_wallet: wallet.landing_company_name === 'malta',
            } as const;
        });
    }, [filtered_accounts]);

    return {
        /** List of all wallet accounts for the current user. */
        data: modified_accounts,
        ...rest,
    };
};

export default useWalletAccountsList;