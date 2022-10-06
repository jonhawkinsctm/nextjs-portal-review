import Link from 'next/link';
import { useRouter } from 'next/router';
import { DogsList } from '../../components/DogsList';
import { Layout } from '../../components/Layout';
import { callApi } from '../../lib/callApi';
import { Dog } from '../../lib/dogs-api';
import { NextPageWithLayout } from '../_app';

export interface DogsPageProps {
    dogs: Dog[];
}

const Dogs: NextPageWithLayout<DogsPageProps> = (props) => {
    return <DogsList section="ssr" dogs={props.dogs} hideNew />;
};

Dogs.getLayout = function PageLayout(page) {
    return <Layout current="ssr">{page}</Layout>;
};

export default Dogs;

export async function getServerSideProps() {
    const res = await callApi('dog');

    return {
        props: {
            dogs: res,
        },
    };
}
