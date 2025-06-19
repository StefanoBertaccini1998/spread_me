import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks/useRedux';
import { fetchAccounts } from '../redux/asyncThunks/accountThunks';
import { fetchCategories } from '../redux/asyncThunks/categoryThunks';
import { fetchTransactions } from '../redux/asyncThunks/transactionThunks';

const useInitialDataLoad = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((s) => s.user.user?.id);

  useEffect(() => {
    if (!userId) return;
    dispatch(fetchAccounts());
    dispatch(fetchCategories());
    dispatch(fetchTransactions());
  }, [dispatch, userId]);
};

export default useInitialDataLoad;
