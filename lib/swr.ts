if (typeof process.env.DOG_API_BASE_URL !== 'string') {
    throw new Error(`process.env.DOG_API_BASE_URL must be set`);
}

import { useEffect } from 'react';
import useSWR from 'swr';
import { Dog, ValidationErrors } from './dogs-api';

const baseUrl = process.env.DOG_API_BASE_URL;

export const fetcher = async (a1: string, a2?: RequestInit) => {
    const url = new URL(a1, baseUrl);
    const res = await fetch(url, a2);
    return res.json();
};

export function useLogError(error: any) {
    useEffect(() => {
        if (error) {
            console.log(error);
        }
    }, [error]);
}

export function useBreeds() {
    const { data, error } = useSWR<string[]>(`/breeds`, fetcher);

    useLogError(error);

    return {
        breeds: data,
        isLoading: !error && !data,
        isError: error,
    };
}

export function useDogs(query?: string) {
    let uri = `/dog`;

    if (query) {
        uri += query;
    }

    const { data, error, mutate } = useSWR<Dog[]>(uri, fetcher);

    // listen for 'dogUpdate' events and invalidate the request so we get the freshest data!
    useEffect(() => {
        const listener = () => mutate();
        window.addEventListener('dogUpdate', listener);
        return () => window.removeEventListener('dogUpdate', listener);
    }, [uri, mutate]);

    useLogError(error);

    return {
        dogs: data,
        isLoading: !error && !data,
        isError: error,
    };
}

export function useDog(id?: string) {
    const { data, error } = useSWR<Dog>(`/dog/${id}`, fetcher);

    useLogError(error);

    return {
        dog: data,
        isLoading: !error && !data,
        isError: error,
    };
}

/** @todo proper type for update */
export async function updateDog(id: string, update: Partial<Dog>) {
    const url = new URL(baseUrl);
    url.pathname = `dog/${id}`;

    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
    });

    return res.json();
}

export async function createDog(data: Partial<Dog>) {
    const url = new URL(baseUrl);
    url.pathname = `dog`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return res.json();
}

export class ValidationError extends Error {
    constructor(public data: ValidationErrors) {
        super('Validation Errors');
    }
}
