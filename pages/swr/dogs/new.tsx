import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, FormEvent, useState } from 'react';
import { mutate } from 'swr';
import { DogForm } from '../../../components/DogForm';
import { Dog, ValidationReport } from '../../../lib/dogs-api';
import { formatValidationErrors } from '../../../lib/forms';
import { sleep } from '../../../lib/sleep';
import { createDog, useBreeds } from '../../../lib/swr';

export default function NewDog() {
    const router = useRouter();
    const { breeds, ...breedsState } = useBreeds();
    const [formState, setFormState] = useState<{
        submitting: boolean;
        validationErrors?: {
            [key: string]: ValidationReport[];
        };
        error?: string | Error;
    }>({
        submitting: false,
        validationErrors: undefined,
    });

    const onSubmit = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            try {
                e.preventDefault();
                setFormState((last) => ({ ...last, submitting: true }));
                const data = new FormData(e.currentTarget);

                const dog: Partial<Dog> = {
                    name: data.get('name') as string,
                    owner: data.get('owner') as string,
                    breed: data.get('breed') as string,
                };

                await mutate('/dog', async () => {
                    // make things slower for testing
                    await sleep(1000);

                    let res = await createDog(dog);

                    if (!res.statusCode) {
                        setFormState({ submitting: false });
                        router.push(`/swr/dogs/${res.id}`);
                        return;
                    }

                    setFormState({
                        submitting: false,
                        validationErrors: formatValidationErrors(res),
                    });
                });
            } catch (err) {
                console.log(err);

                setFormState({
                    submitting: false,
                    error: err instanceof Error ? err : 'Unknown error',
                });
            }
        },
        [router],
    );

    return (
        <DogForm
            preContent={
                <>
                    <Link href="/swr/dogs">Back to dogs</Link>
                    <h1>Add a doggy</h1>
                    {formState.error && (
                        <pre>
                            {formState.error instanceof Error
                                ? formState.error.message + '\n' + formState.error.stack
                                : JSON.stringify(formState.error, null, 2)}
                        </pre>
                    )}
                </>
            }
            breeds={breeds ?? []}
            loading={breedsState.isLoading}
            onSubmit={onSubmit}
            validationErrors={formState.validationErrors}
            submitting={formState.submitting}
        />
    );
}
