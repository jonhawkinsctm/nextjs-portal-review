import Link from 'next/link';
import { Dog } from '../lib/dogs-api';

export function DogsList(props: { dogs?: Dog[]; section: 'swr' | 'ssr'; hideNew?: boolean }) {
    const { dogs, section, hideNew } = props;

    return (
        <div className="wrapper">
            <h1>Dogs!</h1>
            <ul>
                {dogs?.map((dog) => (
                    <li key={dog.id}>
                        <b>{dog.name}</b> the <b>{dog.breed}</b> looks after <b>{dog.owner}</b> the human.{' '}
                        <Link href={`/${section}/dogs/${dog.id}`}>Edit</Link>
                    </li>
                ))}
            </ul>
            {hideNew !== true && (
                <Link href={`/${section}/dogs/new`}>
                    <a className="btn">Add a pooch</a>
                </Link>
            )}
        </div>
    );
}
