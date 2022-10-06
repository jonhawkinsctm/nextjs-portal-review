import { ReactElement } from 'react';
import { Layout } from './Layout';
import { TopDogsSWR } from './TopDogs';

export function LayoutWithTopDogsSWR(page: ReactElement) {
    return (
        <Layout current="swr" sidebar={<TopDogsSWR />}>
            {page}
        </Layout>
    );
}
