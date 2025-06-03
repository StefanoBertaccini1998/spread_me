import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks/useRedux';
import { createUserInvestment, fetchUserInvestments } from '../redux/asyncThunks/investmentUserThunks';
import AddInvestmentForm from './AddInvestmentForm';
import MyInvestmentCard from './MyInvestmentCard';
import styles from './MyInvestments.module.css';

const MyInvestments = () => {
    const dispatch = useAppDispatch();
    const investments = useAppSelector((state) => state.investmentsUser.data);

    useEffect(() => {
        dispatch(fetchUserInvestments());
    }, [dispatch]);

    const handleAdd = (newInv) => {
        dispatch(createUserInvestment(newInv));
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>💼 I miei investimenti</h2>
            <AddInvestmentForm onAdd={handleAdd} />
            <div className={styles.grid}>
                {investments.map((inv) => (
                    <MyInvestmentCard key={inv.id} data={inv} />
                ))}
            </div>
        </div>
    );
};

export default MyInvestments;
