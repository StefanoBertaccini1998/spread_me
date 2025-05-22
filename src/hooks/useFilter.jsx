import { useLocation } from 'react-router-dom';

const useFilter = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    return {
        filter: params.get('filter') || 'all',
    };
};

export default useFilter;
