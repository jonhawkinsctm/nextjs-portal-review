import { Dog } from '../lib/dogs-api';
import { useDogs } from '../lib/swr';

export function TopDogsSWR() {
    const { dogs } = useDogs('?take=3');

    return (
        <>
            <h2>Top Dogs!</h2>
            {dogs && <TopDogsList dogs={dogs} />}
        </>
    );
}

export function TopDogsList(props: { dogs: Dog[] }) {
    return (
        <ol className="top-dogs">
            {props.dogs.map((d) => (
                <li key={d.id}>
                    <b>{d.name}</b> the <b>{d.breed}</b>
                </li>
            ))}
        </ol>
    );
}
