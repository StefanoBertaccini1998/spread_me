import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks/useRedux';
import { fetchAccounts } from '../redux/asyncThunks/accountThunks';
import { fetchCategories } from '../redux/asyncThunks/categoryThunks';
import { fetchTransactions } from '../redux/asyncThunks/transactionThunks';

const useInitialDataLoad = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchCategories());
    dispatch(fetchTransactions());
  }, [dispatch]);
};

export default useInitialDataLoad;
