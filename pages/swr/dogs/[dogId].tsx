import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useCallback, useState } from 'react';
import { mutate } from 'swr';
import { DogForm } from '../../../components/DogForm';
import { LayoutWithTopDogsSWR } from '../../../components/LayoutWithTopDogs';
import { Dog, ValidationReport } from '../../../lib/dogs-api';
import { formatValidationErrors } from '../../../lib/forms';
import { sleep } from '../../../lib/sleep';
import { updateDog, useBreeds, useDog } from '../../../lib/swr';
import { NextPageWithLayout } from '../../_app';

const SWREditDog: NextPageWithLayout = () => {
    // WTF next.js? where's my search query string? path params should be params
    const router = useRouter();
    const { dogId } = router.query;

    /** @todo sort out "as string" things */
    const { dog, ...dogState } = useDog(dogId as string);
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
            if (!dog) {
                return;
            }

            e.preventDefault();
            setFormState((last) => ({ ...last, submitting: true }));
            const data = new FormData(e.currentTarget);

            const update = {
                // super lazy...
                name: data.get('name') as string,
                owner: data.get('owner') as string,
                breed: data.get('breed') as string,
            };

            await mutate(
                `/dog/${dog.id}`,
                async () => {
                    // make things slower for testing
                    await sleep(1000);

                    const data = await updateDog(dog.id, update);

                    if (!data.statusCode) {
                        setFormState({ submitting: false });

                        // Use event to inform Top Dogs component of updated content
                        window.dispatchEvent(new Event('dogUpdate'));

                        // return data for swr to update the cache with
                        return data;
                    }

                    setFormState({
                        submitting: false,
                        validationErrors: formatValidationErrors(data),
                    });

                    // return un-mutated dog to rest data
                    return dog;
                },
                {
                    optimisticData: {
                        ...dog,
                        ...update,
                    },
                    rollbackOnError: true,
                },
            );
        },
        [setFormState, dog],
    );

    if (!dog || !breeds) {
        return <p className="loading-splash">Loading...</p>;
    }

    if (dogState.isError || breedsState.isError) {
        return <p className="error-splash">Error!</p>;
    }

    return (
        <DogForm
            dog={dog}
            breeds={breeds}
            submitting={formState.submitting}
            validationErrors={formState.validationErrors}
            onSubmit={onSubmit}
            preContent={
                <>
                    <Link href="/swr/dogs">Back to dogs</Link>
                    <h1>Edit &ldquo;{dog.name}&ldquo;</h1>
                </>
            }
        />
    );
};

SWREditDog.getLayout = LayoutWithTopDogsSWR;

export default SWREditDog;
