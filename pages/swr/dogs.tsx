import Link from 'next/link';
import { DogsList } from '../../components/DogsList';
import { LayoutWithTopDogsSWR } from '../../components/LayoutWithTopDogs';
import { useDogs } from '../../lib/swr';
import { NextPageWithLayout } from '../_app';

const SWRDogs: NextPageWithLayout = () => {
    const { dogs, isError, isLoading } = useDogs();

    if (isLoading) return <p className="loading-splash">Loading...</p>;

    if (isError) {
        return <p className="error-splash">Error!</p>;
    }

    return <DogsList section="swr" dogs={dogs} />;
};

SWRDogs.getLayout = LayoutWithTopDogsSWR;

export default SWRDogs;
